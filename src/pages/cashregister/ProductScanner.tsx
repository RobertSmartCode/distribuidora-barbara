import React, { useState, useEffect, useContext, useRef } from 'react';
import { getProductByBarCode } from '../../firebase/firebaseOperations';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { Box, Container, TextField } from '@mui/material';
import CartList from './CartList';
import { Product } from '../../type/type';
import cashRegisterSound from './barcodeScanBeep.mp3';

export interface CartItem extends Product {
  quantity?: number;
}

const ProductScanner: React.FC = () => {
  const inputRef = useRef(null);
  const [barcode, setBarcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToCart } = useContext(CashRegisterContext)!;

  const handleBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(event.target.value);
  };

  const playBarcodeScanBeep = () => {
    const audio = new Audio(cashRegisterSound);
    audio.play();
  };

  useEffect(() => {
    const scanProduct = async () => {
      try {
        setLoading(true);
        const products = await getProductByBarCode(barcode);

        if (products.length > 0) {
          // Agregar automáticamente el primer producto encontrado al carrito
          if ('id' in products[0]) {
            addToCart({
              ...products[0] as Product,
              quantity: 1,
            });

            // Reproducir el sonido al agregar al carrito
            playBarcodeScanBeep();
          }

          console.log('Producto encontrado y agregado al carrito:', products[0]);
        } else {
          console.log('Producto no encontrado');
        }

        // Lógica adicional, como limpiar el campo de entrada después de escanear
        setBarcode('');
      } catch (error) {
        console.error('Error al escanear el producto:', error);
        // Muestra un mensaje de error al usuario
      } finally {
        setLoading(false);
      }
    };

    // Verificar si hay un código de barras y realizar la acción de escanear
    if (barcode) {
      scanProduct();
    }
  }, [barcode, addToCart]);

  return (
    <Container maxWidth="xs">
      <TextField
        type="text"
        value={barcode}
        onChange={handleBarcodeChange}
        placeholder="Código de barras"
        autoComplete="off"
        sx={{ mx: 'auto', width: '100%' }} 
        ref={inputRef}
        />

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
