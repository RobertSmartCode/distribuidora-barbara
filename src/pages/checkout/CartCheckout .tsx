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
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CartContext } from '../../context/CartContext';
import { Product } from '../../type/type';

const CartCheckout = () => {
  const { cart } = useContext(CartContext)! || {};
  const [productCounters, setProductCounters] = useState<{ [key: string]: number }>({});
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  // Función de utilidad para parsear un valor como número
  const parseNumber = (value: string | number): number => {
    if (typeof value === 'string') {
      return parseFloat(value);
    }
    return value;
  };

// Función para calcular el subtotal sin envío
const calculateSubtotal = () => {
  let subtotal = 0;
  cart.forEach((product) => {
    const price = parseNumber(product.price);
    const discount = parseNumber(product.discount);
    const discountedPrice = discount !== 0 ? price - (price * discount) / 100 : price;
    subtotal += discountedPrice * productCounters[product.barcode];
  });
  return Math.round(subtotal);
};

// Función para calcular el precio final de un producto
const calculateFinalPrice = (product: Product): number => {
  const price = parseNumber(product.price);
  const discount = parseNumber(product.discount);
  if (discount !== 0) {
    const discountedPrice = price - (price * discount) / 100;
    return Math.round(discountedPrice);
  } else {
    return price;
  }
};

  // Estado inicial de los contadores de productos
  useEffect(() => {
    const initialQuantities: { [combinedKey: string]: number } = {};
    cart.forEach((product) => {
      const combinedKey = `${product.barcode}`;
      initialQuantities[combinedKey] = product.quantity;
    });
    setProductCounters(initialQuantities);
  }, [cart]);

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
                ${calculateSubtotal()}
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
                            {` ${product.title}(${product.type}) `} x {productCounters[product.barcode]}
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
                            ${calculateFinalPrice(product) * productCounters[product.barcode]}
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
                  Sub Total
                </Typography>
                <Typography variant="body1" style={{ paddingRight: '30px' }}>
                  ${calculateSubtotal()}
                </Typography>
              </Grid>
              {/* Otros elementos adicionales de la sección de detalles del carrito */}
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
