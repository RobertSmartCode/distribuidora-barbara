import React, { useState, useContext } from 'react';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { Button, Card, CardContent, TextField, Snackbar } from '@mui/material';
import orderSuccessSound from './orderSuccessBeep.mp3';
import * as yup from 'yup';
import {ErrorMessage} from '../../messages/ErrorMessage'; // Ajusta la ruta según tu estructura de archivos

const OrderForm: React.FC = () => {
  const { cart, getTotalAmount, clearCart } = useContext(CashRegisterContext)!;
  const [customerName, setCustomerName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const validationSchema = yup.object().shape({
    dni: yup.string().required('El DNI es requerido').matches(/^\d{8}$/, 'Ingrese un DNI válido'),
  });
  const handleCustomerNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerName(event.target.value);
  };

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

  const clearErrors = () => {
    setErrors({});
  };

  // Función para manejar el tiempo de duración de los errores
  const setErrorTimeoutAndClear = () => {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    const timeout = setTimeout(clearErrors, 2000);
    setErrorTimeout(timeout);
  };

  const playOrderSuccessBeep = () => {
    const audio = new Audio(orderSuccessSound);
    audio.play();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Crear un objeto de orden con la información necesaria
    const order = {
      customerName,
      totalAmount: getTotalAmount(),
      products: cart.map((product) => ({
        ...product,
        timestamp: Timestamp.now(),
      })),
      timestamp: Timestamp.now(),
    };
    

    // Lógica para enviar la orden a Firebase
    const firestore = getFirestore();
    const ordersCollection = collection(firestore, 'ordersbox');

    try {
      await validationSchema.validate({ dni: customerName });

      await addDoc(ordersCollection, order);
      playOrderSuccessBeep();

      // Mostrar el mensaje de éxito
      setSnackbarMessage('Orden creada con éxito');
      setSnackbarOpen(true);

      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Cerrar automáticamente la Snackbar después de 4000 milisegundos (4 segundos)
      setTimeout(() => {
        setSnackbarOpen(false);
      }, 4000);

      // Esperar 2000 milisegundos (2 segundos) antes de limpiar el carrito
      setTimeout(() => {
        // Limpiar el carrito después de que se muestra el mensaje de éxito
        clearCart();

        // Limpiar el nombre del cliente después de crear la orden
        setCustomerName('');
      }, 2000);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Manejar el error de validación de yup
        console.error('Error de validación:', error.message);
        setSnackbarMessage(error.message);
        setSnackbarOpen(true);
        // Configurar los errores para mostrar en ErrorMessage
        setErrors({ dni: error.message });
        setErrorTimeoutAndClear();
      } else {
        // Manejar otros tipos de errores
        console.error('Error al crear la orden:', error);
      }
    }
  };

  return (
    <Card sx={{ width: '80%', margin: 'auto', mt: 1,  marginBottom: '30px' }}>
      <CardContent>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            type="number"
            value={customerName}
            onChange={handleCustomerNameChange}
            label="DNI del Cliente"
            name="dni"
            variant="outlined"
            sx={{ mb: 2, width: '80%' }}
          />
          <ErrorMessage
            messages={errors.dni ? (Array.isArray(errors.dni) ? errors.dni : [errors.dni]) : []}
          />
          <Button type="submit" variant="contained" color="primary" sx={{ width: '80%' }}>
            Comenzar Compra
          </Button>
        </form>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          message={snackbarMessage}
          sx={{
            margin: 'auto',
          }}
          onClose={() => setSnackbarOpen(false)} // Manejar el cierre de Snackbar
        />
      </CardContent>
    </Card>
  );
};

export default OrderForm;
