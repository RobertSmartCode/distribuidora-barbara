import React, { useContext, useState, useEffect } from 'react';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { Paper, List, ListItem, ListItemText, IconButton, Typography, Divider, Stack, ListItemAvatar, Avatar } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import OrderForm from './OrderForm';

const CartList: React.FC = () => {
  const { cart, removeFromCart, getTotalAmount, updateQuantityByBarcode } = useContext(CashRegisterContext)!;
  const [productCounters, setProductCounters] = useState<{ [key: string]: number }>({});
  const [exceededMaxInCart, setExceededMaxInCart] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    // Inicializa los contadores y el estado de exceder el máximo para cada producto en el carrito
    const initialCounters: { [key: string]: number } = {};
    const initialExceededMax: { [key: string]: boolean } = {};

    cart.forEach((product) => {
      const combinedKey = `${product.barcode}`;
      initialCounters[product.barcode.toString()] = product.quantity;
      initialExceededMax[combinedKey] = false;
    });

    setProductCounters(initialCounters);
    setExceededMaxInCart(initialExceededMax);
  }, [cart]);

  const handleCounterChange = (productBarcode: string, newValue: number) => {
    const inventoryQuantity = cart.find(item => item.barcode.toString() === productBarcode)?.quantities || 0;

    if (newValue >= 1 && newValue <= inventoryQuantity) {
      setProductCounters(prevQuantities => ({
        ...prevQuantities,
        [productBarcode]: newValue,
      }));

      setExceededMaxInCart(prevExceeded => ({
        ...prevExceeded,
        [productBarcode]: newValue >= inventoryQuantity,
      }));

      updateQuantityByBarcode(productBarcode, newValue);
    } else {
      setExceededMaxInCart(prevExceeded => ({
        ...prevExceeded,
        [productBarcode]: newValue > 1,
      }));

      setTimeout(() => {
        setExceededMaxInCart(prevExceeded => ({
          ...prevExceeded,
          [productBarcode]: false,
        }));
      }, 1000);
    }
  };

  const handleIncrement = (productBarcode: string) => {
    const newValue = (productCounters[productBarcode] || 0) + 1;
    handleCounterChange(productBarcode, newValue);
  };

  const handleDecrement = (productBarcode: string) => {
    const newValue = Math.max(1, (productCounters[productBarcode] || 0) - 1);
    handleCounterChange(productBarcode, newValue);
  };

  const handleRemoveClick = (barcode: string) => {
    removeFromCart(barcode);
  };

  return (
    <Paper sx={{ width: '100%', height: '100%', margin: 'auto', mt: 3, marginBottom: 1, overflowY: 'auto' }}>
      <List>
        {cart.map((item) => (
          <React.Fragment key={item.barcode}>
            <ListItem>
              <ListItemAvatar>
                <Avatar alt={item.title} src={item.images[0]} />
              </ListItemAvatar>
              <ListItemText
                primary={`${item.title}`}
                secondary={`Cantidad: ${item.quantity} | Precio: $${item.price * item.quantity}`}
              />
              <Stack direction="row" justifyContent="center" alignItems="center" spacing={1}>
                <IconButton color="primary" onClick={() => handleDecrement(item.barcode.toString())}>
                  <RemoveIcon />
                </IconButton>
                <Typography variant="body2">
                  {productCounters[item.barcode.toString()] || item.quantity}
                </Typography>
                <IconButton color="primary" onClick={() => handleIncrement(item.barcode.toString())}>
                  <AddIcon />
                </IconButton>
              </Stack>
              <IconButton
                color="error"
                aria-label="Eliminar"
                onClick={() => handleRemoveClick(String(item.barcode))}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
            <Divider />
            {exceededMaxInCart[`${item.barcode}`] && (
              <ListItemText
                primary=""
                secondary="Tienes el máximo disponible."
                style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}
              />
            )}
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
        Total: ${getTotalAmount().toFixed(2)}
      </Typography>
      {/* Orden Form Component */}
      <OrderForm/>
    </Paper>
  );
};

export default CartList;




