import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Box,

  

} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";

import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import ShippingMethodsForm from "./ShippingMethodsForm";

// Define el tipo ShippingMethod
interface ShippingMethodsDesktop{
  id: string;
  name: string;
  price: number;
}

const ShippingMethodsDesktop: React.FC = () => {
  const [methods, setMethods] = useState<ShippingMethodsDesktop[]>([]);
  const [editMethod, setEditMethod] = useState<ShippingMethodsDesktop | null>(null); // Añade el tipo aquí
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shippingMethods"));
      const methodsData: ShippingMethodsDesktop[] = [];

      querySnapshot.forEach((doc) => {
        const methodData = doc.data();
        if (methodData.name && methodData.price) {
          methodsData.push({ id: doc.id, name: methodData.name, price: methodData.price });
        }
      });

      setMethods(methodsData);
    } catch (error) {
      console.error("Error al obtener los métodos de envío:", error);
    }
  };

  const handleEditMethod = (method: ShippingMethodsDesktop) => {
    setEditMethod(method);
    setOpenForm(true);
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      await deleteDoc(doc(db, "shippingMethods", id));
      setSnackbarMessage("Método de envío eliminado con éxito.");
      setSnackbarOpen(true);
      fetchShippingMethods();
    } catch (error) {
      console.error("Error al eliminar el método de envío:", error);
      setSnackbarMessage("Error al eliminar el método de envío.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseForm = () => {
    setEditMethod(null);
    setOpenForm(false);
    fetchShippingMethods();
  };

  const handleUpdateMethod = async (methodId: string, updatedMethod: ShippingMethodsDesktop) => {
    try {
      const methodRef = doc(db, "shippingMethods", methodId);
      const { name, price } = updatedMethod;
      await updateDoc(methodRef, { name, price });
      setSnackbarMessage("Método de envío actualizado con éxito.");
      setSnackbarOpen(true);
      fetchShippingMethods();
    } catch (error) {
      console.error("Error al actualizar el método de envío:", error);
      setSnackbarMessage("Error al actualizar el método de envío.");
      setSnackbarOpen(true);
    }
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box>
    

      {/* Sección "Configuración de Envío" */}
 

        <Box style={{  textAlign: 'center'}}>

        <div style={{ margin: '0 auto', textAlign: 'center', marginTop:"20px" }}>
            <Button
              variant="contained"
              onClick={() => setOpenForm(true)}
              style={{ marginBottom: "20px" }}
            >
              Agregar Método de Envío
            </Button>
          </div>

         
            <TableContainer
              component={Paper}
              sx={{
                margin: '0 auto',
                maxWidth: '80%',
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                <TableCell style={{ width: '40%' }}>Nombre</TableCell>
                <TableCell style={{ width: '40%' }}>Precio</TableCell>
                <TableCell style={{ width: '20%' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {methods.map((method) => (
                    <TableRow key={method.id}>
                      <TableCell>{method.name}</TableCell>
                      <TableCell>{method.price}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditMethod(method)}>
                          <EditIcon />
                        </Button>
                        <Button onClick={() => handleDeleteMethod(method.id)}>
                          <DeleteForeverIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
     

      <ShippingMethodsForm
        open={openForm}
        onClose={handleCloseForm}
        methodToEdit={editMethod}
        onUpdateMethod={handleUpdateMethod}
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

export default ShippingMethodsDesktop;
