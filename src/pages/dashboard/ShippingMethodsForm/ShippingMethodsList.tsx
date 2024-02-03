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
  IconButton,
  Drawer,
  Typography,

} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import ShippingMethodsForm from "./ShippingMethodsForm";

// Define el tipo ShippingMethod
interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

const ShippingMethodsList: React.FC = () => {
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [editMethod, setEditMethod] = useState<ShippingMethod | null>(null); // Añade el tipo aquí
  const [openForm, setOpenForm] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [shippingOpen, setShippingOpen] = useState(false);

  useEffect(() => {
    fetchShippingMethods();
  }, []);

  const fetchShippingMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shippingMethods"));
      const methodsData: ShippingMethod[] = [];

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

  const handleEditMethod = (method: ShippingMethod) => {
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

  const handleUpdateMethod = async (methodId: string, updatedMethod: ShippingMethod) => {
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

  const handleBtnClick = () => {
    setShippingOpen(!shippingOpen);
  };

  const handleClose = () => {
    setShippingOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',
      contrastText: '#fff',
    },
  };

  const topBarStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: "12px 8px",
    width: "100%",
    margin: "0 auto",
    backgroundColor: customColors.primary.main,
    color: customColors.secondary.main,
  };

  const closeButtonStyles = {
    color: customColors.secondary.main,
    marginRight: '2px',
    marginLeft: '0',
    fontSize: '24px',
  };

  const textStyles = {
    fontSize: '20px',
    color: customColors.secondary.main,
    marginLeft: '24px',
  };

  return (
    <Box>
    

      {/* Sección "Configuración de Envío" */}
      <Button
        variant="contained"
        onClick={handleBtnClick}
        sx={{
          backgroundColor: customColors.primary.main,
          color: customColors.secondary.contrastText,
          width: '70vw', // 70% del ancho de la ventana
          margin: '0 auto', // Centra horizontalmente
          
        }}
      >
        Métodos de Envíos
      </Button>

      <Drawer
        anchor="left"
        open={shippingOpen}
        onClose={handleClose}
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            height: "100%",
            zIndex: 1300,
          },
        }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={textStyles}>Configuración de Envío</Typography>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box>
        <div style={{ margin: '0 auto', textAlign: 'center', marginTop:"20px" }}>
            <Button
              variant="contained"
              onClick={() => setOpenForm(true)}
              style={{ marginBottom: "20px" }}
            >
              Agregar Método de Envío
            </Button>
          </div>


      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Acciones</TableCell>
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
      </Drawer>

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

export default ShippingMethodsList;
