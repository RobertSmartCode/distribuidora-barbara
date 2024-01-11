import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Grid } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useImagesContext } from '../../../context/ImagesContext';
import { Product } from '../../../type/type';
import { uploadFile } from "../../../firebase/firebaseConfig";
import { Image } from '../../../type/type';

interface ImageManagerProps {
  files?: File[];
  productSelected: Product | null;
}


const ImageManager: React.FC<ImageManagerProps> = ({ productSelected }) => {
  const { images, updateImages } = useImagesContext()!;


  // Estado para las imágenes existentes
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedImageCount, setSelectedImageCount] = useState<number>(
    productSelected?.images.length || 0
  );

  useEffect(() => {
    if (productSelected) {
      setFiles(productSelected.images.map((imageUrl) => new File([], imageUrl)));
    } else {
      // Asumiendo que `newImages.images` es un array de URLs, no de Files
      setFiles([]);
    }
  }, [productSelected]);

  
 



  const normalizeImages = async (imageFiles: File[], existingImages: Image[]) => {
    // Filtra las imágenes que ya son URLs de Firebase
    const firebaseImages = existingImages.map((image) => image.url).filter((url) =>
      url.startsWith('https://firebasestorage.googleapis.com')
    );
  
    // Filtra las imágenes que son blob URLs (temporales)
    const localImages = imageFiles.filter((file) =>
      URL.createObjectURL(file).startsWith('blob:')
    );
  
    // Sube las imágenes locales a Firebase y obtén sus URLs
    const uploadedLocalImages = await Promise.all(localImages.map(async (file) => {
      // Asume que uploadFile es una función que sube el archivo a Firebase
      const url = await uploadFile(file);
      return url;
    }));
  
    // Combina todas las URLs y crea objetos Image
    const normalizedImages: Image[] = [...firebaseImages, ...uploadedLocalImages].map((url, index) => ({
      url,
      alt: `Image ${index + 1}`,
    }));
  
    return normalizedImages;
  };
  
  const handleRemoveImage = (index: number) => {
    // Clona el array de images para evitar mutaciones directas
    const updatedImages = [...images];
    const updatedFiles = [...files];
    // Remueve la imagen correspondiente al índice
      updatedImages.splice(index, 1)[0];
      updatedFiles.splice(index, 1)[0];
    // Después de eliminar la imagen, actualiza el contador
    setSelectedImageCount(updatedImages.length);
    setUploadMessage("");
    // Actualiza las imágenes en el contexto
    updateImages(updatedImages);
    setFiles(updatedFiles);

  };
  

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Uso en tu función handleImageChange
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
  
      if (
        selectedFiles.length + selectedImageCount <= 8 &&
        selectedFiles.length + selectedImageCount >= 1
      ) {
        const updatedFiles = [...files, ...selectedFiles];
  
        setFiles(updatedFiles);
        setSelectedImageCount(selectedImageCount + selectedFiles.length);
        setUploadMessage("");
  
        try {
          // Llamada a normalizeImages con el array de objetos Image
          const normalizedImages = await normalizeImages(selectedFiles, images);
  
          // Actualiza las imágenes en el contexto
          updateImages(normalizedImages);
  
          
         
        } catch (error) {
          console.error("Error al normalizar las imágenes:", error);
          setUploadMessage("Error al cargar las imágenes");
        }
      } else {
        setUploadMessage(
          "Llegaste al límite de fotos permitido (mínimo 1, máximo 8)."
        );
      }
    }
  };
  
  
  

  return (
    <div>
      {/* Maneja la carga de las imágenes para Modificar */}
      <Grid item xs={12} lg={12} style={{ width: '100%', margin: 'auto', marginRight: '130px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
          {productSelected ? (
            productSelected.images.map((imageUrl, index) => (
              <Card key={index} style={{ width: '100%', margin: '10px' }}>
                <CardContent>
                  <p>{`Vista Previa ${index + 1}`}</p>
                </CardContent>
                <CardMedia
                  component="img"
                  height="140"
                  image={imageUrl}
                  alt={`Imagen ${index + 1}`}
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
            ))
          ) : (
            files.map((file, index) => (
              <Card key={index} style={{ maxWidth: 600, width: '100%', margin: '10px' }}>
                <CardContent>
                  <p>{`Vista Previa ${index + 1}`}</p>
                </CardContent>
                <CardMedia
                  component="img"
                  height="140"
                  image={URL.createObjectURL(file)}
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
            ))
          )}
        </div>
      </Grid>

      {/* Maneja la carga de las imágenes para Crear */}
      <Grid item xs={12} style={{ textAlign: 'center', marginRight: '200px' }}>
        <Button variant="contained" color="primary" onClick={openFileInput}>
          Subir foto
        </Button>
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
