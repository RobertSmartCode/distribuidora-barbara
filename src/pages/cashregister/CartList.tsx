import React, { useContext, useState, useEffect } from 'react';
import { CashRegisterContext } from '../../context/CashRegisterContext';
import { Paper, List, ListItem, ListItemText, IconButton, Typography, Divider, Stack, ListItemAvatar, Avatar, Modal, Box, TextField, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';
import OrderForm from './OrderForm';

const CartList: React.FC = () => {
  const { cart, removeFromCart, getTotalAmount, updateQuantityByBarcode } = useContext(CashRegisterContext)!;
  const [productCounters, setProductCounters] = useState<{ [key: string]: number }>({});
  const [exceededMaxInCart, setExceededMaxInCart] = useState<{ [key: string]: boolean }>({});
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editedQuantity, setEditedQuantity] = useState<number>(0);
  const [editedProductBarcode, setEditedProductBarcode] = useState<string>("");

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

  const handleOpenEditModal = (productBarcode: string) => {
    setEditedQuantity(productCounters[productBarcode] || 0);
    setEditedProductBarcode(productBarcode);
    setEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
  };

  const handleEditQuantity = () => {
    const inventoryQuantity = cart.find(item => item.barcode.toString() === editedProductBarcode)?.quantities || 0;
    if (editedQuantity >= 1 && editedQuantity <= inventoryQuantity) {
      setProductCounters(prevQuantities => ({
        ...prevQuantities,
        [editedProductBarcode]: editedQuantity,
      }));
      updateQuantityByBarcode(editedProductBarcode, editedQuantity);
      handleCloseEditModal();
    } else {
      setExceededMaxInCart(prevExceeded => ({
        ...prevExceeded,
        [editedProductBarcode]: true,
      }));

      setTimeout(() => {
        setExceededMaxInCart(prevExceeded => ({
          ...prevExceeded,
          [editedProductBarcode]: false,
        }));
      }, 1000);
    }
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

                <IconButton color="primary" onClick={() => handleOpenEditModal(item.barcode.toString())}>
                  <EditIcon />
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

            {exceededMaxInCart[`${item.barcode}`] && (
              <ListItemText
                primary=""
                secondary="Tienes el máximo disponible."
                style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}
              />
            )}
            <Divider />
          </React.Fragment>
        ))}
      </List>
      <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
        Total: ${getTotalAmount().toFixed(2)}
      </Typography>
      
      <Modal open={editModalOpen} onClose={handleCloseEditModal}>
          <Box
            sx={{
              position: 'absolute',
              top: `calc(50% - 100px)`, // Ajusta la posición verticalmente
              left: `calc(50% - 150px)`, // Ajusta la posición horizontalmente
              width: 250,
              bgcolor: 'background.paper',
              p: 2,
              outline: 0, // Quita el contorno del modal
            }}
          >
            <TextField
              label="Editar"
              variant="outlined"
              type="number"
              value={editedQuantity}
              onChange={(e) => {
                setEditedQuantity(parseInt(e.target.value));
              }}
              sx={{ width: '100%' }} // Establece el ancho al 100%
            />

            {exceededMaxInCart[`${editedProductBarcode}`] && (
              <Typography variant="body2" color="red" sx={{ textAlign: 'center', mt: 1 }}>
                Tienes el máximo disponible.
              </Typography>
            )}

            <Box sx={{ textAlign: 'right', mt: 1 }}>
              <Button onClick={handleCloseEditModal}>Cancelar</Button> 
              <Button onClick={handleEditQuantity}>Confirmar</Button>
            </Box>
          </Box>
        </Modal>


      {/* Orden Form Component */}
      <OrderForm/>
    </Paper>
  );
};

export default CartList;
