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

import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import StoreDataForm from "./StoreDataForm"; // Importa el formulario de datos de la tienda


// Define el tipo StoreData (ajusta las propiedades según las necesidades)
interface StoreData {
  id: string;
  storeName: string;
  logo: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessHours: string;
  // Agrega otras propiedades específicas de los datos de la tienda si es necesario
}



interface StoreData {
  id: string;
  storeName: string;
  // Otras propiedades aquí
}


const StoreDataDesktop: React.FC = () => {
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [editStoreData, setEditStoreData] = useState<StoreData | null>(null);
  const [openForm, setOpenForm] = useState<boolean>(false); // Corregido: especifica el tipo boolean
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false); // Corregido: especifica el tipo boolean
  const [snackbarMessage, setSnackbarMessage] = useState<string>(""); // Corregido: especifica el tipo string


  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "storeData"));
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
        };

        storeDataArray.push(storeDataItem);
      });

      setStoreData(storeDataArray);
    } catch (error) {
      console.error("Error al obtener los datos de la tienda:", error);
    }
  };

const handleEditStoreData = (data: StoreData) => {
  
  setEditStoreData(data);
  // Evitar abrir el formulario automáticamente aquí
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
    setEditStoreData(null);
    setOpenForm(false);
    fetchStoreData();
  };

  const handleUpdateStoreData = async (storeId: string, updatedData: Partial<StoreData>) => {
    try {
      const dataRef = doc(db, "storeData", storeId);
      await updateDoc(dataRef, updatedData);
      setSnackbarMessage("Datos de la tienda actualizados con éxito.");
      setSnackbarOpen(true);
      fetchStoreData();
    } catch (error) {
      console.error("Error al actualizar los datos de la tienda:", error);
      setSnackbarMessage("Error al actualizar los datos de la tienda.");
      setSnackbarOpen(true);
    }
  };
  
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
      {/* Sección "Configuración de Datos de la Tienda" */}
    
        <Box style={{  marginRight:"150px" }}>
            {storeData.length === 0 ? (
                <Button
                variant="contained"
                onClick={() => setOpenForm(true)}
                style={{ marginBottom: "20px" }}
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
      </CardContent>
      <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
        <IconButton onClick={() => handleEditStoreData(data)}>
          <EditIcon />
        </IconButton>
        <IconButton onClick={() => handleDeleteStoreData(data.id)}>
          <DeleteForeverIcon />
        </IconButton>
      </CardActions>


    </Card>
  ))}



        
          <StoreDataForm
            open={openForm}
            onClose={handleCloseForm}
            storeDataToEdit={{
              id: editStoreData?.id || "",
              storeName: editStoreData?.storeName || "",
              // logo: editStoreData?.logo || "",
              description: editStoreData?.description || "",
              address: editStoreData?.address || "",
              phoneNumber: editStoreData?.phoneNumber || "",
              email: editStoreData?.email || "",
              website: editStoreData?.website || "",
              socialMedia: editStoreData?.socialMedia || {},
              businessHours: editStoreData?.businessHours || "",
              // Agregar otras propiedades específicas de editStoreData si es necesario
            }}
            onUpdateStoreData={handleUpdateStoreData}
          />


         

        </Box>
      

      {/* Snackbar para mostrar mensajes al usuario */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default StoreDataDesktop;
