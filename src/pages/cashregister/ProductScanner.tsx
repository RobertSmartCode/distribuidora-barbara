import React, { useState, useContext } from 'react';
import { getProductById  } from '../../firebase/firebaseOperations'; // Ajusta la ruta según tu estructura de archivos
import CircularProgress from '@mui/material/CircularProgress';


import { CashRegisterContext } from '../../context/CashRegisterContext'; // Ajusta la ruta según tu estructura de archivos
import { Box, Button, Container, TextField } from '@mui/material';

const ProductScanner: React.FC = () => {
  const [barcode, setBarcode] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const { addToCart } = useContext(CashRegisterContext)!;

  const handleBarcodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(event.target.value);
  };

  const handleScanProduct = async () => {
    try {
      setLoading(true);
      const products = await getProductById(barcode);

      if (products.length > 0) {
        // Agregar automáticamente el primer producto encontrado al carrito
        addToCart({
          id: products[0].id, // Supongamos que la propiedad id está presente en el resultado de la base de datos
          name: products[0].name,
          price: products[0].price,
          quantity: 1, // Puedes ajustar la cantidad según tus necesidades
        });

        console.log('Producto encontrado y agregado al carrito:', products[0]);
      } else {
        console.log('Producto no encontrado');
        // Muestra un mensaje al usuario indicando que el producto no se encontró
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

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <TextField
          type="text"
          value={barcode}
          onChange={handleBarcodeChange}
          placeholder="Código de barras"
          sx={{ mb: 2 }}
        />
        <Button onClick={handleScanProduct} disabled={loading} variant="contained">
          {loading ? <CircularProgress size={20} /> : 'Agregar al carrito'}
        </Button>
      </Box>
    </Container>
  );
  
};

export default ProductScanner;


