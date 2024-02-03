import React, { useState, useEffect } from "react";
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Snackbar,
  Box,
  IconButton,

  Typography,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import { collection,  onSnapshot, deleteDoc, doc, } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import StoreDataForm from "./StoreDataForm"; // Importa el formulario de datos de la tienda
import { StoreData } from "../../../type/type";






  const StoreDataDesktop: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false); 
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); 
  const [snackbarMessage, setSnackbarMessage] = useState<string>(""); 




  const fetchStoreData = () => {
    const storeDataCollection = collection(db, "storeData");
  
    // Suscribirse a eventos de cambios en la colección
    const unsubscribe = onSnapshot(storeDataCollection, (querySnapshot) => {
      const storeDataArray: StoreData[] = [];
  
      querySnapshot.forEach((doc) => {
        const methodData = doc.data();
  
        const storeDataItem: StoreData = {
          id: doc.id,
          storeName: methodData.storeName || "",
          logo: methodData.logo || "",
          description: methodData.description || "",
          address: methodData.address || "",
          phoneNumber: methodData.phoneNumber || "",
          email: methodData.email || "",
          website: methodData.website || "",
          socialMedia: methodData.socialMedia || {},
          businessHours: methodData.businessHours || "",
          branches: methodData.branches || []
        };
  
        storeDataArray.push(storeDataItem);
      });
  
      setStoreData(storeDataArray);
    });
  
    // Devolver una función de limpieza para dejar de escuchar cuando sea necesario
    return () => unsubscribe();
  };
  

  useEffect(() => {
    const unsubscribe = fetchStoreData();
  
    // Devolver una función de limpieza para dejar de escuchar cuando el componente se desmonte
    return () => unsubscribe();
  }, []);
  


const handleEditStoreData = () => {
  setOpenForm(true);
};


  const handleDeleteStoreData = async (id: string) => {
    try {
      await deleteDoc(doc(db, "storeData", id));
      setSnackbarMessage("Datos de la tienda eliminados con éxito.");
      setSnackbarOpen(true);
      fetchStoreData();
    } catch (error) {
      console.error("Error al eliminar los datos de la tienda:", error);
      setSnackbarMessage("Error al eliminar los datos de la tienda.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseForm = () => {
   
    setOpenForm(false);
    fetchStoreData();
  };


 

  return (
    <Box
    sx={{
      margin: '0 auto',  
      maxWidth: '80%',
    }}
    
    >
      {/* Sección "Configuración de Datos de la Tienda" */}
    
        <Box >
            {storeData.length === 0 ? (
                <Button
                variant="contained"
                onClick={() => setOpenForm(true)}
                style={{
                  display: 'block',
                  margin: '0 auto ',
                }}
                >
                Crear Datos de la Tienda
                </Button>
            ) : null}


  {storeData.map((data) => (
    <Card key={data.id} style={{ marginBottom: "20px" }}>
      <CardContent>
      <Typography variant="h6" sx={{ textAlign: "center" }}>
        {data.storeName}
      </Typography>

        {/* <Typography>Logo: {data.logo}</Typography> */}
        <Typography>Descripción: {data.description}</Typography>
        <Typography>Dirección: {data.address}</Typography>
        <Typography>Teléfono: {data.phoneNumber}</Typography>
        <Typography>Correo Electrónico: {data.email}</Typography>
        <Typography>Enlace al Sitio Web: {data.website}</Typography>
        <Typography>
          Redes Sociales:
        </Typography>
          <ul>
            {data.socialMedia?.facebook && (
              <li>
                <a href={data.socialMedia.facebook}>Facebook</a>
              </li>
            )}
            {data.socialMedia?.instagram && (
              <li>
                <a href={data.socialMedia.instagram}>Instagram</a>
              </li>
            )}
            {data.socialMedia?.tiktok && (
              <li>
                <a href={data.socialMedia.tiktok}>TikTok</a>
              </li>
            )}
            {data.socialMedia?.twitter && (
              <li>
                <a href={data.socialMedia.twitter}>Twitter</a>
              </li>
            )}
            {data.socialMedia?.linkedin && (
              <li>
                <a href={data.socialMedia.linkedin}>LinkedIn</a>
              </li>
            )}
          </ul>
       

        <Typography>Horario de Atención: {data.businessHours}</Typography>

          {/* Sucursales */}
          {data.branches && data.branches.length > 0 && (
            <Box>
              <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '10px' }}>
                Sucursales
              </Typography>
              {data.branches.map((branch) => (
                <Box key={branch.name} style={{ marginBottom: '10px' }}>
                  <Typography>Sucursal: {branch.name}</Typography>
                  <Typography>Dirección: {branch.address}</Typography>
                  <Typography>Teléfono: {branch.phone}</Typography>

                  {/* Información de las cajas */}
                  {branch.boxes && branch.boxes.length > 0 && (
                    <Box>
                      <Typography variant="subtitle1" sx={{ marginTop: '5px' }}>
                        Cajas:
                      </Typography>
                      {branch.boxes.map((box) => (
                        <Box key={box.number} style={{ marginLeft: '10px' }}>
                          <Typography>Número: {box.number}</Typography>
                          <Typography>Ubicación: {box.location}</Typography>
                          {/* Puedes agregar más detalles de la caja si es necesario */}
                        </Box>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
          )}

      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
      <IconButton onClick={() => handleEditStoreData()}> 
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => data.id ? handleDeleteStoreData(data.id) : undefined}>
        <DeleteForeverIcon />
      </IconButton>
    </CardActions>
    </Card>
  ))}

        
          <StoreDataForm
            open={openForm}
            onClose={handleCloseForm}
            storeData={storeData[0]} 
          />

        </Box>
      

      {/* Snackbar para mostrar mensajes al usuario */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
       
        message={snackbarMessage}
      />
    </Box>
  );
};

export default StoreDataDesktop;
