import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useImagesContext } from '../../../context/ImagesContext';
import { uploadFile } from '../../../firebase/firebaseConfig';
import Resizer from 'react-image-file-resizer';

interface ImageManagerProps {
  initialData: Image[];
}

export interface Image {
  url: string;
}

export interface ResizeResult {
  url: string;
}



const ImageManager: React.FC<ImageManagerProps> = ({ initialData }) => {
  const { images, updateImages } = useImagesContext()!;
  const [files, setFiles] = useState<Image[]>(initialData || []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedImageCount, setSelectedImageCount] = useState<number>(
    initialData?.length || 0
  );

  useEffect(() => {
    if (initialData) {
      setFiles(initialData);
    }
  }, [initialData]);

  const transformBlobToFirebase = async (blobUrl: string): Promise<string | null> => {
    if (!blobUrl.startsWith('blob:')) {
      return null; // No es una URL blob
    }

    try {
      const blob = await fetch(blobUrl).then(response => response.blob());
      const file = new File([blob], 'filename', { lastModified: new Date().getTime() });
      const firebaseUrl = await uploadFile(file);
      return firebaseUrl;
    } catch (error) {
      console.error('Error al transformar la URL blob a Firebase:', error);
      return null;
    }
  };

  const normalizeImages = async (imageFiles: Image[]) => {
    const normalizedImages: Image[] = await Promise.all(imageFiles.map(async (image) => {
      const url = image.url;

      if (url.startsWith('blob:')) {
        const firebaseUrl = await transformBlobToFirebase(url);
        return { url: firebaseUrl || url };
      } else {
        return { url };
      }
    }));

    return normalizedImages;
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = [...images];
    const updatedFiles = [...files];
    updatedImages.splice(index, 1)[0];
    updatedFiles.splice(index, 1)[0];
    setSelectedImageCount(updatedImages.length);
    setUploadMessage("");
    updateImages(updatedImages);
    setFiles(updatedFiles);
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
  
      try {
        const resizedFiles = await Promise.all(
          selectedFiles.map(
            async (file) =>
              new Promise<ResizeResult>((resolve) => {
                Resizer.imageFileResizer(
                  file,
                  500,
                  500,
                  'JPEG',
                  100,
                  0,
                  (value: string | Blob | File | ProgressEvent<FileReader>) => {
                    const urlString = typeof value === 'string' ? value : URL.createObjectURL(value as Blob);
                    resolve({ url: urlString });
                  },
                  'blob'
                );
              })
          )
        );
  
        setFiles([...files, ...resizedFiles]);
        setUploadMessage("");
      } catch (error) {
        console.error('Error al redimensionar las imágenes:', error);
        setUploadMessage('Error al redimensionar las imágenes');
      }
    }
  };
  
  
  
  
  useEffect(() => {
    const updateImagesAsync = async () => {
      try {
        const normalizedImages = await normalizeImages(files);
        await updateImages(normalizedImages);
      } catch (error) {
        console.error("Error al normalizar las imágenes:", error);
        setUploadMessage("Error al cargar las imágenes");
      }
    };

    updateImagesAsync();
  }, [files]);

  return (
    <div>
      {/* Maneja la carga de las imágenes para Modificar */}
      <Grid item xs={12} lg={12} style={{ width: '100%', margin: 'auto', marginRight: '130px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
          {files.map((image, index) => (
            <Card key={index} style={{ maxWidth: 600, width: '100%', margin: '10px' }}>
              <CardContent>
                <p>{`Vista Previa ${index + 1}`}</p>
              </CardContent>
              <CardMedia
                component="img"
                height="140"
                image={image.url}
                alt={`Vista Previa ${index + 1}`}
                style={{ objectFit: "contain" }}
              />
              <CardActions>
                <Button
                  size="small"
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveImage(index)}
                  style={{ marginLeft: 'auto' }}
                >
                  <DeleteForeverIcon />
                </Button>
              </CardActions>
            </Card>
          ))}
        </div>
      </Grid>

      {/* Maneja la carga de las imágenes para Crear */}
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Button variant="contained" color="primary" onClick={openFileInput}>
          Subir foto
        </Button>
      </Grid>

      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {selectedImageCount >= 1 && selectedImageCount < 8 && <p>Puedes subir otra foto.</p>}
        {selectedImageCount === 8 && <p>Llegaste al máximo de fotos permitido.</p>}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <p>{uploadMessage}</p>
      </Grid>
    </div>
  );
};

export default ImageManager;
