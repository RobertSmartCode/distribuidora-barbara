import { useState, useEffect, useContext } from 'react';
import { Snackbar, Tooltip } from '@mui/material';
import { FaWhatsapp } from 'react-icons/fa';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { useCustomer } from '../../context/CustomerContext';
import { db } from '../../firebase/firebaseConfig';

const CashPayment = () => {
  const { customerInfo } = useCustomer()!;
  const { cart, clearCart, getTotalPrice } = useContext(CartContext)! || {};
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [whatsappURL, setWhatsappURL] = useState('');
  const navigate = useNavigate();
  const phoneNumber = '+59898724545';

  useEffect(() => {
    const generateWhatsAppURL = () => {
      const phoneNumber = '+59898724545';
      const message = `¡Nueva orden!\n\nID de orden: {orderId}\nCliente: ${
        userData.firstName
      }\nDirección de entrega: ${userData.postalCode}, ${userData.city}, ${userData.department}, ${userData.streetAndNumber}\n\nProductos:\n${cart
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
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    };

    setWhatsappURL(generateWhatsAppURL());
  }, []);

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
    const message = `¡Nueva orden!\n\nID de orden: ${orderId}\nCliente: ${
      userData.firstName
    }\nDirección de entrega: ${userData.postalCode}, ${userData.city}, ${userData.department}, ${userData.streetAndNumber}\n\nProductos:\n${cart
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

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
      <h2 style={{ color: 'black' }}>Mandar el Pedido a WhatsApp</h2>
      <Tooltip title="Enviar mensaje por WhatsApp">
          <a
            href={whatsappURL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25d366',
              color: 'white',
              borderRadius: '8px', // Ajusta el radio de los bordes según sea necesario
              padding: '10px 20px', // Ajusta el padding horizontal y vertical según sea necesario
              textDecoration: 'none',
              display: 'block', // Cambia a bloque para permitir el centrado horizontal
              margin: '0 auto', // Centra horizontalmente
              maxWidth: '20%', // Establece el ancho máximo al 90% del contenedor
              zIndex: 99,
            }}
            onClick={handleOrder}
          >
            <FaWhatsapp size={40} />
          </a>
        </Tooltip>


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
