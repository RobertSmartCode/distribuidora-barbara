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


const SHIPPING_METHODS_STORAGE_KEY = "shippingMethods";

const CartCheckout = () => {

  const { cart, getTotalPrice, discountInfo, getSelectedShippingMethod  } = useContext(CartContext)! || {};
  const [productQuantities, setProductQuantities] = useState<{ [combinedKey: string]: number }>({});


  const [expanded, setExpanded] = useState(false);


  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Función para calcular el subtotal sin envío
  const subtotal = getTotalPrice ? getTotalPrice() : 0;


const storedShippingMethods = JSON.parse(localStorage.getItem(SHIPPING_METHODS_STORAGE_KEY) || "[]");
const selectedShippingMethod = storedShippingMethods.find((method: ShippingMethod) => method.selected) || null;
const shippingCost = (getSelectedShippingMethod() || selectedShippingMethod)?.price || 0;



  const discountPercentage = discountInfo?.discountPercentage ?? 0;
  const maxDiscountAmount = discountInfo?.maxDiscountAmount ?? 0;
  const discountAmount = (discountPercentage / 100) * (subtotal + shippingCost);
 
  let total = (subtotal + shippingCost) * (1 - (discountPercentage ?? 0) / 100);

  if (discountAmount < maxDiscountAmount) {
    total = (subtotal + shippingCost) * (1 - discountPercentage / 100);
  } else {
    total = subtotal + shippingCost - maxDiscountAmount;
  }


  useEffect(() => {
    // Inicializa los contadores para cada producto en el carrito
    const initialQuantities: { [combinedKey: string]: number } = {};
    cart.forEach((product) => {
      const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
      initialQuantities[combinedKey] = product.quantity;
    });
    setProductQuantities(initialQuantities);
  }, [cart]);

  const calculateFinalPrice = (product:Product) => {
    const originalPrice = product.unit_price || 0;
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
          <Typography variant="h6" style={{ fontWeight: 'bold', marginRight: '45px'  }}>
            ${total}
          </Typography>
        </Grid>
    </Grid>
    </Box>


        <Collapse in={expanded}>

          {cart?.length ?? 0 > 0 ? (
            <>
              {cart?.map((product) => (
                 <Grid item xs={12} key={`${product.id}-${product.selectedColor}-${product.selectedSize}`}>
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
                            {` ${product.title} (${product.selectedColor}, ${product.selectedSize})`} x {productQuantities[`${product.id}-${product.selectedColor}-${product.selectedSize}`]}
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                          >
                          </Stack>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'right', }}>
                          <Typography variant="body1" style={{ marginBottom: '30px', paddingRight: '15px' }}>
                          ${calculateFinalPrice(product)  * productQuantities[`${product.id}-${product.selectedColor}-${product.selectedSize}`]}
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
              {discountPercentage > 0 && (
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
                  {discountAmount < maxDiscountAmount ? 'Descuento (Cupón)' : 'Descuento Máximo (Cupón)'}
                </Typography>
                <Typography variant="body1" style={{ paddingRight: '30px' }}>
                  -${discountAmount < maxDiscountAmount ? discountAmount.toFixed(2) : maxDiscountAmount.toFixed(2)} {/* Muestra la cantidad descontada */}
                </Typography>
              </Grid>
            )}

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
                <Typography variant="body1" style={{ paddingRight: '30px', fontWeight: 'bold'  }}>
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
