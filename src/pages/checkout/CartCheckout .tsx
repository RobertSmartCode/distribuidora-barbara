import { useContext, useState, useEffect } from 'react';
import {
  Typography,
  Stack,
  Grid,
  Card,
  CardContent,
  IconButton,
  Collapse,
  Box
  // Importa el componente Button de MUI
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CartContext } from '../../context/CartContext';
import { Product, ShippingMethod } from '../../type/type';
import { useShippingMethods } from '../../context/ShippingMethodsContext';

const SHIPPING_METHODS_STORAGE_KEY = "shippingMethods";

const CartCheckout = () => {

  const { cart, getTotalPrice} = useContext(CartContext)! || {};
  const [productQuantities, setProductQuantities] = useState<{ [combinedKey: string]: number }>({});
  const { getSelectedShippingMethod } = useShippingMethods()!;

  const [expanded, setExpanded] = useState(false);


  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Función para calcular el subtotal sin envío
  const subtotal = getTotalPrice ? getTotalPrice() : 0;


const storedShippingMethods = JSON.parse(localStorage.getItem(SHIPPING_METHODS_STORAGE_KEY) || "[]");
const selectedShippingMethod = storedShippingMethods.find((method: ShippingMethod) => method.selected) || null;
const shippingCost = (getSelectedShippingMethod() || selectedShippingMethod)?.price || 0;


const total = (subtotal + shippingCost) 
 
 

useEffect(() => {
  console.log("Cart updated:", cart);
  const initialQuantities: { [combinedKey: string]: number } = {};
  cart.forEach((product) => {
    const combinedKey = `${product.barcode}`;
    initialQuantities[combinedKey] = product.quantity;
  });
  setProductQuantities(initialQuantities);
}, [cart]);



  const calculateFinalPrice = (product:Product) => {
    const originalPrice = product.price || 0;
    const discountPercentage = product.discount || 0;
    return originalPrice - (originalPrice * (discountPercentage / 100));
  };
  



  return (
    <Card style={{ marginTop: '-10px' }}>
      <CardContent>
        <Box onClick={handleClick} style={{ cursor: 'pointer' }}>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <IconButton
                onClick={handleClick}
                aria-expanded={expanded}
                aria-label="Ver detalles de mi compra"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Grid>
            <Grid item xs={7}>
              <Typography variant="body1" style={{ paddingLeft: '5px' }}>
                {expanded ? 'Ocultar detalles de mi compra' : 'Ver detalles de mi compra'}
              </Typography>
            </Grid>
            <Grid item xs={2} style={{ textAlign: 'right' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '45px' }}>
                ${total}
              </Typography>
            </Grid>
          </Grid>
        </Box>
  
        <Collapse in={expanded}>
          {cart?.length ?? 0 > 0 ? (
            <>
              {cart?.map((product) => (
                <Grid item xs={12} key={`${product.barcode}`}>
                  <Card>
                    <CardContent style={{ display: 'flex', alignItems: 'center' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={4}>
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            style={{
                              width: '80%',
                              maxHeight: '100px',
                              objectFit: 'contain',
                            }}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Typography
                            variant="body2"
                            style={{ textAlign: 'center', marginBottom: '30px' }}
                          >
                            {` ${product.title} `} x {productQuantities[`${product.barcode}`]}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                          >
                            {/* Aquí puedes agregar elementos adicionales si es necesario */}
                          </Stack>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'right' }}>
                          <Typography variant="body1" style={{ marginBottom: '30px', paddingRight: '15px' }}>
                            ${calculateFinalPrice(product) * productQuantities[`${product.barcode}`]}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Typography variant="body2" style={{ paddingLeft: '20px' }}>
                  Sub Total (Sin Envío)
                </Typography>
                <Typography variant="body1" style={{ paddingRight: '30px' }}>
                  ${subtotal}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Typography variant="body2" style={{ paddingLeft: '20px' }}>
                  Costo de envío
                </Typography>
                <Typography variant="body1" style={{ paddingRight: '30px' }}>
                  ${shippingCost}
                </Typography>
              </Grid>
              
         
              <Grid
                item
                xs={12}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Typography variant="body1" style={{ paddingLeft: '20px', fontWeight: 'bold' }}>
                  Total
                </Typography>
                <Typography variant="body1" style={{ paddingRight: '30px', fontWeight: 'bold' }}>
                  ${total}
                </Typography>
              </Grid>
            </>
          ) : (
            <Typography>El carrito está vacío</Typography>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
  
};

export default CartCheckout;
