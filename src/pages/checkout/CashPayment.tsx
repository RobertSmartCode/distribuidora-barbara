// CashPayment.jsx
import { useState, useContext } from 'react';
import { Button, Snackbar } from '@mui/material';
import { db} from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const CashPayment = () => {
  const { cart, clearCart, getSelectedShippingMethod, getTotalPrice, discountInfo, getCustomerInformation } = useContext(CartContext)! || {};
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const selectedShippingMethod = getSelectedShippingMethod();

  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const shippingCost = selectedShippingMethod ? selectedShippingMethod.price : 0;
  const discountPercentage = discountInfo?.discountPercentage ?? 0;
  const maxDiscountAmount = discountInfo?.maxDiscountAmount ?? 0;
  const discountAmount = (discountPercentage / 100) * (subtotal + shippingCost);

  let total = (subtotal + shippingCost) * (1 - (discountPercentage ?? 0) / 100);

  if (discountAmount < maxDiscountAmount) {
    total = (subtotal + shippingCost) * (1 - discountPercentage / 100);
  } else {
    total = subtotal + shippingCost - maxDiscountAmount;
  }

  const userData = getCustomerInformation();

  const handleOrder = async () => {
    const order = {
      userData,
      items: cart,
      shippingMethod: selectedShippingMethod ? selectedShippingMethod.name : 'No shipping method',
      shippingCost,
      total,
      date: serverTimestamp(),
      status: "pending",
      paymentType: "efectivo", 
    };

    const ordersCollection = collection(db, 'orders');

    try {
      const orderDocRef = await addDoc(ordersCollection, {
        ...order,
      });

      console.log('Orden creada con éxito:', orderDocRef.id);

      navigate('/checkout/pendingverification');
      setSnackbarMessage('Orden generada con éxito.');
      setSnackbarOpen(true);
      clearCart()
    } catch (error) {
      console.error('Error al generar la orden:', error);
      setUploadMessage('Error al generar la orden.');
    }
  };

  const handleGenerateOrder = () => {
    handleOrder();
  };



  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '40px' }}>
      <h2 style={{ color: 'black' }}>Pago en Efectivo</h2>
      <Button variant="contained" color="primary" onClick={handleGenerateOrder}>
        Generar Orden
      </Button>
      <p>{uploadMessage}</p>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </div>
  );
  
};

export { CashPayment };
