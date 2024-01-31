import React, { useContext } from 'react';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { Card, CardContent, List, ListItem, ListItemText, IconButton, Typography, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderForm from './OrderForm';

const CartList: React.FC = () => {
  const { cart, removeFromCart, getTotalAmount } = useContext(CashRegisterContext)!;

  if (cart.length === 0) {
    // No renderizar nada si el carrito está vacío
    return null;
  }

  const handleRemoveClick = (barcode: string) => {
    removeFromCart(barcode);
  };

  return (
    <Card sx={{ width: '100%', margin: 'auto', mt: 3, marginBottom: 1 }}>
      <CardContent>
        <List>
          {cart.map((item) => (
            <React.Fragment key={item.barcode}>
              <ListItem>
                <ListItemText
                  primary={`${item.title}`}
                  secondary={`Cantidad: ${item.quantity} | Precio: $${item.price * item.quantity}`}
                />
                <IconButton
                  color="error"
                  aria-label="Eliminar"
                  onClick={() => handleRemoveClick(String(item.barcode))}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
        <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
        Total: ${getTotalAmount().toFixed(2)}
        </Typography>

        <OrderForm/>
      </CardContent>
    </Card>
  );
};

export default CartList;
