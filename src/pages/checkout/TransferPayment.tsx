import React, { useState, useRef, useContext } from 'react';
import { Button, Card, CardContent, CardMedia, Snackbar } from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { db, uploadFile } from '../../firebase/firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useShippingMethods } from '../../context/ShippingMethodsContext';
import { useCustomer} from '../../context/CustomerContext';

const TransferPayment = () => {


  const { getSelectedShippingMethod } = useShippingMethods()!;
  const { customerInfo } = useCustomer()!;
  const { cart, getTotalPrice, clearCart } = useContext(CartContext)! || {};
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const selectedShippingMethod = getSelectedShippingMethod();




  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [uploadMessage, setUploadMessage] = useState<string>('');


  const shippingCost = selectedShippingMethod ? selectedShippingMethod.price : 0;

 
  let total = (subtotal + shippingCost) 

const userData = customerInfo

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];

      setFile(selectedFile);
      setUploadMessage('');
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
    setUploadMessage('');
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadMessage('Por favor, selecciona un comprobante antes de enviar.');
      return;
    }

    try {
      const url = await uploadFile(file);
      let order = {
        userData,
        items: cart,
        shippingCost,
        shippingMethod: selectedShippingMethod ? selectedShippingMethod.name : 'No shipping method',
        total,
        date: serverTimestamp(),
        status: "pending",
        paymentType: "transferencia", 
        transferUrl: url, 

        
      };
      const ordersCollection = collection(db, "orders");

      const orderDocRef = await addDoc(ordersCollection, {
        ...order,
      });

      console.log("Orden creada con éxito:", orderDocRef.id);


      navigate("/checkout/pendingverification");
      setSnackbarMessage('Comprobante cargado con éxito.');
      setSnackbarOpen(true);
      clearCart()
    } catch (error) {
      console.error('Error al cargar el comprobante:', error);
      setUploadMessage('Error al cargar el comprobante.');
    }
  };

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
      <h2 style={{ color: 'black' }}>Transferencia Bancaria</h2>
      <h4 style={{ color: 'black' }}>Banco: HSBC</h4>
      <h4 style={{ color: 'black' }}>Cuenta N°:12345678</h4>
      {file && (
        <Card style={{ maxWidth: 345, margin: 'auto', borderRadius: '10px', overflow: 'hidden', marginBottom:"20px" }}>
          <CardContent>
            <p>Vista Previa</p>
          </CardContent>
          <CardMedia
            component="img"
            height="140"
            image={URL.createObjectURL(file)}
            alt="Vista Previa"
            style={{ objectFit: 'contain' }}
          />
          <CardContent>
            <Button size="small" variant="contained" color="secondary" onClick={handleRemoveImage}>
              <DeleteForeverIcon />
            </Button>
          </CardContent>
        </Card>
      )}
      <Button variant="contained" color="primary" onClick={openFileInput}>
        {file ? 'Cambiar Comprobante' : 'Cargar Comprobante'}
      </Button>
      {file && (
        <Button variant="contained" color="primary" onClick={handleUpload} style={{ margin: '20px'}}>
          Enviar Comprobante
        </Button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      <p>{uploadMessage}</p>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
    </div>
  );
};

export { TransferPayment };
