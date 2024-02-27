import { useState, useContext } from 'react';
import { Button, Snackbar } from '@mui/material';
import { db } from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useCustomer } from '../../context/CustomerContext';

const CashPayment = () => {
  const { customerInfo } = useCustomer()!;
  const { cart, clearCart, getTotalPrice } = useContext(CartContext)! || {};
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const navigate = useNavigate();

  const total = getTotalPrice ? getTotalPrice() : 0;
  const userData = customerInfo!;
  const handleOrder = async () => {
    const order = {
      userData,
      items: cart,
      total,
      date: serverTimestamp(),
      status: 'pending',
      paymentType: 'efectivo',
    };
  
    const ordersCollection = collection(db, 'orders');
  
    try {
      const orderDocRef = await addDoc(ordersCollection, {
        ...order,
      });
  
      sendWhatsAppMessage(orderDocRef.id);
  
      // Retrasa la ejecución de las siguientes líneas por 2 segundos (2000 milisegundos)
      setTimeout(() => {
        navigate('/checkout/pendingverification');
        setSnackbarMessage('Orden generada con éxito.');
        setSnackbarOpen(true);
        clearCart();
      }, 2000);
    } catch (error) {
      console.error('Error al generar la orden:', error);
      setUploadMessage('Error al generar la orden.');
    }
  };
  
  const sendWhatsAppMessage = (orderId: string) => {
    const phoneNumber = '+59898724545'; // Número de teléfono de WhatsApp
    const message = `¡Nueva orden!\n\nID de orden: ${orderId}\nCliente: ${
      userData.firstName
    }\nDirección de entrega: ${ userData.postalCode}, ${userData.city}, ${userData.department}, ${userData.streetAndNumber}\n\nProductos:\n${cart
      .map(
        (product) =>
          `${product.title} - Tipo: ${product.type}, Barcode: ${
            product.barcode
          }, Precio: ${product.price}, Cantidad: ${
            product.quantity
          }, Total: ${product.price * product.quantity}\n`
      )
      .join('')}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappURL, '_blank', 'noopener noreferrer');
  };
  
  const handleGenerateOrder = () => {
    handleOrder();
  };
  
  

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
      <h2 style={{ color: 'black' }}>Pago en Efectivo</h2>
      <Button 
        variant="contained" 
        style={{
          backgroundColor: '#25D366', // Color de WhatsApp
          color: 'white', // Texto en color blanco
          borderRadius: '20px', // Bordes redondos
          padding: '10px 30px', // Padding horizontal y vertical
          marginBottom: '20px', // Margen inferior
        }}
        onClick={handleGenerateOrder}
      >
        Enviar Orden al WhatsApp
      </Button>

      <p>{uploadMessage}</p>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </div>
  );
};

export { CashPayment };
