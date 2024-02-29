import React, { useState, useEffect, useContext, useRef } from 'react';
import { getProductByBarCode } from '../../firebase/firebaseOperations';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { Box, Container, TextField, Button } from '@mui/material';
import CartList from './CartList';
import { Product } from '../../type/type';
import cashRegisterSound from './barcodeScanBeep.mp3';

export interface CartItem extends Product {
  quantity?: number;
}

const ProductScanner: React.FC = () => {
  const inputRef = useRef(null);
  const [autoBarcode, setAutoBarcode] = useState<string>('');
  const [manualBarcode, setManualBarcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToCart } = useContext(CashRegisterContext)!;

  const handleAutoBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAutoBarcode(event.target.value);
  };

  const handleManualBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setManualBarcode(event.target.value);
  };

  const playBarcodeScanBeep = () => {
    const audio = new Audio(cashRegisterSound);
    audio.play();
  };

  const scanProduct = async (barcode: string) => {
    try {
      setLoading(true);
      const products = await getProductByBarCode(barcode);
  
      if (products.length > 0) {
        const productToAdd = products[0] as Product;
  
        if ('id' in productToAdd && productToAdd.quantities > 0) {
          addToCart({
            ...productToAdd,
            quantity: 1,
          });
  
          playBarcodeScanBeep();
          console.log('Producto encontrado y agregado al carrito:', productToAdd);
        } else {
          console.log('Producto encontrado, pero no hay suficiente stock.');
        }
      } else {
        console.log('Producto no encontrado');
      }
  
      setAutoBarcode('');
    } catch (error) {
      console.error('Error al escanear el producto:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    if (autoBarcode) {
      scanProduct(autoBarcode);
    }
  }, [autoBarcode, addToCart]);

  const handleManualScan = () => {
    if (manualBarcode.trim() !== '') {
      scanProduct(manualBarcode.trim());
      setManualBarcode(''); 
    } else {
      console.log('Por favor ingrese un código de barras válido.');
    }
  };

  return (
    <Container maxWidth="xs">
      <TextField
        type="text"
        value={autoBarcode}
        onChange={handleAutoBarcodeChange}
        placeholder="Código de barras (búsqueda automática)"
        autoComplete="off"
        sx={{ mx: 'auto', width: '100%' }}
        ref={inputRef}
      />

      <TextField
        type="text"
        value={manualBarcode}
        onChange={handleManualBarcodeChange}
        placeholder="Ingrese el código de barras manualmente"
        autoComplete="off"
        sx={{ mx: 'auto', width: '100%', mt: 2 }}
      />

     <Button variant="contained" onClick={handleManualScan} sx={{ mx: 'auto', mt: 2, width: '100%' }}>Buscar manualmente</Button>


      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100vh',
          margin: '10% auto',
        }}
      >
        {loading ? <p>Cargando...</p> : <CartList />}
      </Box>
    </Container>
  );
};

export default ProductScanner;
