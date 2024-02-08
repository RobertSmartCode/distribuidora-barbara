import React, { useState, useEffect, useContext } from 'react';
import { Box, Snackbar } from '@mui/material';
import { CartContext } from '../context/CartContext';

const Notification: React.FC = () => {
  const [showNotification, setShowNotification] = useState(false);
  const { getTotalQuantity } = useContext(CartContext)! ?? {};

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (getTotalQuantity && getTotalQuantity() > 0) {
      setShowNotification(true);
      timer = setTimeout(() => {
        setShowNotification(false);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [getTotalQuantity]); // Ejecutar el efecto cuando cambie el valor de getTotalQuantity

  return (
    <Box sx={{ position: 'fixed', bottom: 20, left: 20, zIndex: 9999 }}>
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={() => setShowNotification(false)}
        message={`¡Tu carrito tiene ${getTotalQuantity ? getTotalQuantity() : 0} artículos!`} 
        sx={{ bottom: 20, left: 20, width: 'fit-content', maxWidth: 'calc(100% - 40px)', textAlign: 'center' }} // Ajusta el fondo al texto
      />
    </Box>
  );
};

export default Notification;
