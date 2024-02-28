import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, CardActions, CardContent, CardMedia, Grid, Modal, Backdrop, CircularProgress } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useImagesContext } from '../../../context/ImagesContext';
import { ref, deleteObject } from 'firebase/storage'; // Importa las funciones necesarias de Firebase Storage
import { storage } from '../../../firebase/firebaseConfig';
import { uploadFile } from '../../../firebase/firebaseConfig';

interface ImageManagerProps {
  initialData: Image[];
}

export interface Image {
  url: string; // URL de la imagen en Firebase
}

const ImageManager: React.FC<ImageManagerProps> = ({ initialData }) => {
  const { images, updateImages } = useImagesContext()!;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedImageCount, setSelectedImageCount] = useState<number>(
    initialData?.length || 0
  );
  const [loading, setLoading] = useState<boolean>(false); // Estado para controlar la visualización del modal de carga

  useEffect(() => {
    if (initialData) {
      updateImages(initialData);
    }
  }, [initialData]);

  const handleRemoveImage = async (index: number) => {
    const updatedImages = [...images];
   
    const removedImage = updatedImages.splice(index, 1)[0];
    setSelectedImageCount(updatedImages.length);
    setUploadMessage("");
    updateImages(updatedImages);
    
    try {
      const storageRef = ref(storage, removedImage.url); // Utiliza la instancia de Firebase Storage
      await deleteObject(storageRef); // Eliminar el archivo de Firebase Storage
      console.log('Imagen eliminada correctamente');
    } catch (error) {
      console.error('Error al eliminar la imagen de Firebase:', error);
      // Manejar el error apropiadamente
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoading(true); // Muestra el modal de carga cuando se inicia la carga de imágenes
      const selectedFiles = Array.from(e.target.files);
      const uploadPromises = selectedFiles.map(async (file) => {
        // Subir el archivo a Firebase Storage y obtener la URL
        const firebaseUrl = await uploadFile(file);
        return { url: firebaseUrl };
      });

      try {
        const uploadedFiles = await Promise.all(uploadPromises);
        updateImages([...images, ...uploadedFiles]);
        setUploadMessage("");
      } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        setUploadMessage("Error al cargar las imágenes");
      } finally {
        setLoading(false); // Oculta el modal de carga cuando se completan todas las cargas de imágenes
      }
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div>
      <Grid item xs={12} lg={12} style={{ width: '100%', margin: 'auto', marginRight: '130px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%' }}>
          {images.map((image, index) => (
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

      {/* Modal de carga */}
      <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Modal
        open={loading}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress color="primary" size={80} />
      </Modal>
      </Grid>
    </div>
  );
};

export default ImageManager;
