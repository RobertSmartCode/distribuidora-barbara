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
import PaymentMethodsForm from "./PaymentMethodsForm"; // Cambio en la importación

// Define el tipo PaymentMethod (actualizado con propiedades específicas de pago)
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  // Agrega otras propiedades específicas de los métodos de pago si es necesario
}

const PaymentMethodsDesktop: React.FC = () => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]); // Cambio en el tipo
  const [editMethod, setEditMethod] = useState<PaymentMethod | null>(null); // Cambio en el tipo
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


  useEffect(() => {
    fetchPaymentMethods(); // Cambio en la función
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "paymentMethods")); // Cambio en la colección
      const methodsData: PaymentMethod[] = [];

      querySnapshot.forEach((doc) => {
        const methodData = doc.data();
        if (methodData.name && methodData.description) { // Cambio en las propiedades
          methodsData.push({ id: doc.id, name: methodData.name, description: methodData.description });
        }
      });

      setMethods(methodsData);
    } catch (error) {
      console.error("Error al obtener los métodos de pago:", error);
    }
  };

  const handleEditMethod = (method: PaymentMethod) => {
    setEditMethod(method);
    setOpenForm(true);
  };

  const handleDeleteMethod = async (id: string) => {
    try {
      await deleteDoc(doc(db, "paymentMethods", id)); // Cambio en la colección
      setSnackbarMessage("Método de pago eliminado con éxito.");
      setSnackbarOpen(true);
      fetchPaymentMethods(); // Cambio en la función
    } catch (error) {
      console.error("Error al eliminar el método de pago:", error);
      setSnackbarMessage("Error al eliminar el método de pago.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseForm = () => {
    setEditMethod(null);
    setOpenForm(false);
    fetchPaymentMethods(); // Cambio en la función
  };

  const handleUpdateMethod = async (methodId: string, updatedMethod: PaymentMethod) => {
    try {
      const methodRef = doc(db, "paymentMethods", methodId); // Cambio en la colección
      const { name, description } = updatedMethod; // Cambio en las propiedades
      await updateDoc(methodRef, { name, description }); // Cambio en las propiedades
      setSnackbarMessage("Método de pago actualizado con éxito.");
      setSnackbarOpen(true);
      fetchPaymentMethods(); // Cambio en la función
    } catch (error) {
      console.error("Error al actualizar el método de pago:", error);
      setSnackbarMessage("Error al actualizar el método de pago.");
      setSnackbarOpen(true);
    }
  };

 



  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };



  return (
    <Box>
 

        <Box  style={{  textAlign: 'center' }}>
        <div style={{ margin: '0 auto', textAlign: 'center', marginTop:"20px" }}>
          <Button
            variant="contained"
            onClick={() => setOpenForm(true)}
            style={{ marginBottom: "20px" }}
          >
            Agregar Método de Pago
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
                <TableCell style={{ width: '40%' }}>Descripción</TableCell>
                <TableCell style={{ width: '20%' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {methods.map((method) => (
                <TableRow key={method.id}>
                  <TableCell>{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>{/* Cambio en la propiedad */}
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

          <PaymentMethodsForm
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

export default PaymentMethodsDesktop;
