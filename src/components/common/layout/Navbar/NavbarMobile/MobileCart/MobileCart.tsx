import React, { useState, useContext } from 'react';
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
import ShippingMethods from './ShippingMethods/ShippingMethods';
import { useShippingMethods } from '../../../../../../context/ShippingMethodsContext';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 



const MobileCart: React.FC = () => {
 
  
  
  const [cartOpen, setCartOpen] = useState(false);
  const { cart, getTotalQuantity} = useContext(CartContext)! ?? {};
  const { getSelectedShippingMethod } = useShippingMethods()!;
  const navigate = useNavigate();  // Utiliza useNavigate
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleCartClick = () => {
    setCartOpen(!cartOpen);
  };
  
// Obtener el subtotal sin envío



  const cartContainerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
    backgroundColor: customColors.secondary.main,
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
    marginBottom: '16px',
    color: customColors.secondary.main,
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

  const handleStartCheckout = () => {
    if (getSelectedShippingMethod()) {
      navigate('/checkout');  // Utiliza navigate
    } else {
      console.error('Seleccione un método de envío para continuar.');
    }
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
          <Typography variant="h6" sx={cartTitleStyles}>
            Carrito de compras
          </Typography>

          {cart?.length ?? 0 > 0 ? (
            <>
              <CartItemList />
              <ShippingMethods />
              <Box style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingLeft: '30px' }}>Total:</Typography>
                <Typography style={{ fontSize: '1.2rem', fontWeight: 'bold', paddingRight: '50px' }}>${}</Typography>
              </Box>
              <Box
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                onClick={handleStartCheckout}
              >
                {!getSelectedShippingMethod() && (
                  <Typography style={{ fontSize: '1rem', color: 'red', marginTop: '20px', marginBottom: '30px' }}>
                    Seleccione un método de envío para continuar.
                  </Typography>
                )}
                {getSelectedShippingMethod() && (
                  <Link to="/checkout">
                    <Button
                      sx={{ ...buyButtonStyles, backgroundColor: !getSelectedShippingMethod() ? '#ccc' : buyButtonStyles.backgroundColor }}
                      variant="contained"
                      size="medium"
                      disabled={!getSelectedShippingMethod()}
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
