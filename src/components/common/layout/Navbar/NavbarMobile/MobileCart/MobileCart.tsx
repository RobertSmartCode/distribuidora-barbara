import React, { useState, useContext, useEffect, } from 'react';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { CartContext } from '../../../../../../context/CartContext';
import { customColors  } from '../../../../../../styles/styles';
import CartItemList from './CartItemList'; 
import useMediaQuery from '@mui/material/useMediaQuery';

import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import Notification from '../../../../../../notification/Notification';


const MobileCart: React.FC = () => {

  const [cartOpen, setCartOpen] = useState(false);
  

  const { cart, getTotalQuantity, getTotalPrice } = useContext(CartContext)! ?? {};
  const navigate = useNavigate();
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    // Esto es solo un ejemplo, puedes usar algún evento para cambiar el estado
    const timeout = setTimeout(() => setShowTitle(!showTitle), 500);

    return () => clearTimeout(timeout);
  }, [showTitle]);



  const handleCartClick = () => {
    setCartOpen(!cartOpen);
  };

  const minimumOrderAmount = 150000; // Cambiar según tu requisito

  const isMinimumOrderReached = () => getTotalPrice() && getTotalPrice() >= minimumOrderAmount;

  const handleStartCheckout = () => {
    if (isMinimumOrderReached()) {
      navigate('/checkout');
    } else {
      console.error('Asegúrese de que el total del carrito sea superior a $150,000.');
    }
  };

  const cartContainerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
    backgroundColor: customColors.secondary.main,
    zIndex: 999,
  };

  const cartIconStyles = {
    color: customColors.primary.main,
    fontSize: isDesktop ? '46px' : '24px',
  };

  const itemCountStyles = {
    color: customColors.primary.main,
    fontSize: isDesktop ? "1.6rem" : "1.2rem",
    marginTop: "-10px",
  };

  const topBarStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row", 
    padding: "12px 8px",
    width: "100%",
    margin: "0 auto", 
    backgroundColor: customColors.primary.main,
    color: customColors.secondary.main,
  };

  const closeButtonStyles = {
    color: customColors.secondary.main,
    marginRight: '2px',
    marginLeft: '0',
    fontSize: '24px',
  };

  const searchTextStyles = {
    fontSize: '20px',
    color: customColors.secondary.main,
    marginLeft: '24px',
  };

  const cartTitleStyles = {
    fontSize: '1.5rem',
    margin: '16px auto', 
    textAlign: 'center',  
    color: "red",
    overflow: 'hidden',
  };

  

  const drawerPaperStyles = {
    boxSizing: "border-box",
    width: isDesktop ? "400px" : "100%",
    height: "100%",
    zIndex: 1300,
  };

  const buyButtonStyles = {
    backgroundColor: customColors.primary.main,
    color: customColors.secondary.contrastText,
    '&:hover, &:focus': {
      backgroundColor: customColors.secondary.main,
      color: customColors.primary.contrastText
    },
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "25px",
  };

  return (
    <Box sx={cartContainerStyles}>
      <IconButton
        aria-label="shopping cart"
        onClick={handleCartClick}
      >
        <ShoppingCartIcon sx={cartIconStyles} />
        <Typography sx={itemCountStyles}>
          {getTotalQuantity ? getTotalQuantity() : 0}
        </Typography>
      </IconButton>

      <Drawer
        anchor="right"
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": drawerPaperStyles,
        }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={searchTextStyles}>Carrito de Compras</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCartClick}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={cartIconStyles}>

        <Typography variant="h6" sx={{ ...cartTitleStyles, opacity: showTitle ? 1 : 0 }}>
          ENVÍOS GRATIS A CABA Y AMBA
        </Typography>

        <Notification/>

        
          {cart?.length ?? 0 > 0 ? (
            <>
              <CartItemList />

              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingLeft: '30px' }}>Total:</Typography>
                <Typography style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingRight: '50px' }}>
                  ${getTotalPrice ? getTotalPrice().toFixed(0) : '0.00'}
                </Typography>
              </Box>

              <Box
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {!isMinimumOrderReached() && (
                  <Typography style={{ fontSize: '1rem', color: 'red', marginTop: '20px', marginBottom: '30px' }}>
                    La compra mínima es de ${minimumOrderAmount.toFixed(2)}
                  </Typography>
                )}
                {isMinimumOrderReached() && (
                  <Link to="/checkout">
                    <Button
                      sx={{
                        ...buyButtonStyles,
                      }}
                      variant="contained"
                      size="medium"
                      onClick={handleStartCheckout}
                    >
                      Iniciar Compra
                    </Button>
                  </Link>
                )}
              </Box>
            </>
          ) : (
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body1">El carrito está vacío</Typography>
            </Box>
          )}
        </Box>
      </Drawer>

    </Box>
  );
};

export default MobileCart;
