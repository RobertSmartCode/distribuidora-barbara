import  { useContext, useState, useEffect } from 'react';
import {
  Typography,
  IconButton,
  Stack,
  Grid,
  Card,
  CardContent,
  CardActions,
  
} from '@mui/material';
import { CartContext } from '../../../../../../context/CartContext';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Product } from '../../../../../../type/type';



const CartItemList = () => {


  const { cart, deleteByBarcode, updateQuantityByBarcode } = useContext(CartContext)! || {};
  const [productCounters, setProductCounters] = useState<{ [key: string]: number }>({});
  const [exceededMaxInCart, setExceededMaxInCart] = useState<{ [key: string]: boolean }>({});

  
  // Función para calcular el subtotal sin envío
  const calculateSubtotal = () => {
    let subtotal = 0;
    cart.forEach((product) => {
      const price = product.price;
      const discount = product.discount;
      const discountedPrice = discount !== 0 ? price - (price * discount) / 100 : price;
      subtotal += discountedPrice * productCounters[product.barcode];
    });
    return subtotal;
  };
  
  const calculateFinalPrice = (price: string, discount: string): number => {
    // Parsear el precio y el descuento a números
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseInt(discount);
    
    // Verifica si el descuento es distinto de cero
    if (parsedDiscount !== 0) {
        // Calcula el precio final restando el descuento al precio original
        const discountedPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;
        // Redondea el precio final a dos decimales
        return Math.round(discountedPrice * 100) / 100;
    } else {
        // Si el descuento es cero, devuelve el precio original
        return parsedPrice;
    }
};


  useEffect(() => {
    // Inicializa los contadores y el estado de exceder el máximo para cada producto en el carrito
    const initialCounters: { [key: string]: number } = {};
    const initialExceededMax: { [key: string]: boolean } = {};

    cart.forEach((product) => {
      const combinedKey = `${product.barcode}`;
      initialCounters[product.barcode] = product.quantity;
      initialExceededMax[combinedKey] = false;
    });

    setProductCounters(initialCounters);
    setExceededMaxInCart(initialExceededMax);
  }, [cart]);

  const handleCounterChange = (product: Product, value: number) => {
    const combinedKey = `${product.barcode}`;
    
    // Obtener la cantidad disponible en el inventario desde la base de datos
    const inventoryQuantity = product?.quantities || 0;
  
    // Verificar si el cambio propuesto está dentro del límite de stock disponible
    if (value >= 1 && value <= inventoryQuantity) {
      // Actualizar la cantidad en el carrito solo si el cambio es válido
      setProductCounters((prevQuantities) => ({
        ...prevQuantities,
        [combinedKey]: value,
      }));
  
      // Actualizar el estado de exceder el máximo solo para este producto
      setExceededMaxInCart((prevExceeded) => ({
        ...prevExceeded,
        [combinedKey]: value >= inventoryQuantity,
      }));
  
      // Llama al método `updateQuantityByBarcode` del contexto para actualizar la cantidad en el carrito
      updateQuantityByBarcode(product.barcode, value);
    } else {
      // Si el valor no está en el rango válido, activar el estado de exceder el máximo
      setExceededMaxInCart((prevExceeded) => ({
        ...prevExceeded,
        [combinedKey]: value > 1, // Cambiado a value > 1 para no mostrar el mensaje cuando es 1
      }));
  
      // Reiniciar el estado de exceder el máximo después de un tiempo
      setTimeout(() => {
        setExceededMaxInCart((prevExceeded) => ({
          ...prevExceeded,
          [combinedKey]: false,
        }));
      }, 1000);
    }
  };
  
  
  return (
    <Card >
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h6" style={{ textAlign: 'center' }}>Productos en el Carrito</Typography>
          </Grid>
          {cart?.length ?? 0 > 0 ? (
            <>
              {cart?.map((product) => (
                <Grid item xs={12} key={product.id}>
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
                            {product.title} ({product.type})
                          </Typography>
                          <Stack
                            direction="row"
                            justifyContent="center"
                            alignItems="center"
                            spacing={1}
                          >
                            <IconButton
                              color="primary"
                              onClick={() => {
                                const newValue = productCounters[product.barcode] - 1;
                                handleCounterChange(product, newValue);
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography variant="body2">
                              {productCounters[product.barcode]}
                            </Typography>
                            <IconButton
                              color="primary"
                              onClick={() => {
                                const newValue = productCounters[product.barcode] + 1;
                                handleCounterChange(product, newValue);
                              }}
                            >
                              <AddIcon />
                            </IconButton>
                          </Stack>
                        </Grid>
                        <Grid item xs={4} style={{ textAlign: 'right', }}>


                        <Typography variant="body1" style={{ marginBottom: '30px', paddingRight: '15px' }}>
                            ${(calculateFinalPrice(product.price.toString(), product.discount.toString()) * productCounters[product.barcode]).toFixed(0) }
                        </Typography>



                          <CardActions>
                            <IconButton
                              color="primary"
                              onClick={() => deleteByBarcode && deleteByBarcode(product.barcode)}
                              style={{ paddingLeft: '40px' }}
                            >
                              <DeleteForeverIcon />
                            </IconButton>
                          </CardActions>
                        </Grid>
                      </Grid>
                    </CardContent>
                    {exceededMaxInCart[`${product.barcode}`] && (
                      <CardContent style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                        <Typography variant="body1">Tienes el máximo disponible.</Typography>
                      </CardContent>
                    )}
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
                  ${calculateSubtotal().toFixed(0) }
                </Typography>
              </Grid>
            </>
          ) : (
            <Typography>El carrito está vacío</Typography>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
  
  
};

export default CartItemList;