import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../../firebase/firebaseConfig";
import { getDoc, collection, doc } from "firebase/firestore";
import {
  Button,
  Typography,
  CardContent,
  Card,
  CardActions,
  Box,
  Grid,
  Stack,
  Paper,
} from "@mui/material";
import { CartContext } from "../../../context/CartContext";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import PaymentMethodsInfo from "./PaymentMethodsInfo"; 
import ShippingMethodsInfo from "./ShippingMethodsInfo"; 
import ProductDetailsInfo from "./ProductDetailsInfo"; 
import {CartItem } from "../../../type/type"
import {customColors} from "../../../styles/styles"
import { Product } from '../../../type/type';
import Notification from '../../../notification/Notification';
import useMediaQuery from '@mui/material/useMediaQuery';

const ItemDetail: React.FC = () => {

  const { id } = useParams<{ id: string | undefined }>();
  const { addToCart,  checkStock, getStockForProduct } = useContext(CartContext)!;
  const [product, setProduct] = useState<any>(null);
  const [productCounters, setProductCounters] = useState<{ [key: string]: number }>({});
  const [exceededMaxInCart, setExceededMaxInCart] = useState<{ [key: string]: boolean }>({});
  const isMobile = useMediaQuery('(max-width: 600px)');
  const maxTitleLength = isMobile ? 10 : 22;
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const handleTitleClick = (title: string) => {
    setClickedProduct((prevClickedProduct) =>
      prevClickedProduct === title ? null : title
    );
  };
  const [showError, setShowError] = useState(false);
  const errorMessage = "Tienes el máximo disponible";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const refCollection = collection(db, "products");
        const refDoc = doc(refCollection, id);
        const docSnapshot = await getDoc(refDoc);
  
        if (docSnapshot.exists()) {
          const productData = docSnapshot.data();
          setProduct({ ...productData, id: docSnapshot.id });
  
          // Una vez que obtengas el producto, puedes usar su código de barras para inicializar productCounters
          if (productData && productData.barcode) {
            setProductCounters({
              [productData.barcode]: 1 // Inicializa productCounters con el código de barras del producto
            });
          } else {
            console.error("El producto no tiene un código de barras válido.");
          }
        } else {
          console.log("El producto no existe");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };
  
    fetchProduct();
  }, [id]);
  
  


  const handleCounterChange = (product: Product, value: number) => {
    const combinedKey = `${product.barcode}`;
    
    // Obtener la cantidad disponible en el inventario desde la base de datos
    const inventoryQuantity = getStockForProduct(product);
   
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
  

  const handleAddToCart = () => {
    // Verifica si hay suficiente stock antes de agregar al carrito
    const hasEnoughStock = checkStock(product);
    if (hasEnoughStock) {
      // Obtener la cantidad del contador o 1 si no existe
      const quantityToAdd = productCounters[product?.barcode || ""] || 1;
      
      const cartItem: CartItem = {
        ...product,
        quantity: quantityToAdd,
      };
  
      addToCart(cartItem);

      setProductCounters({
        [product?.barcode ]: 1 
      });

    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };
  

  const calculateFinalPrice = (price: string, discount: string): number => {
    // Parsear el precio y el descuento a números
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseInt(discount);
    
    // Verifica si el descuento es distinto de cero
    if (parsedDiscount !== 0) {
        // Calcula el precio final restando el descuento al precio original
        const discountedPrice = parsedPrice - (parsedPrice * parsedDiscount) / 100;
        // Redondea el precio final al entero más cercano
        return Math.round(discountedPrice);
    } else {
        // Si el descuento es cero, devuelve el precio original
        return parsedPrice;
    }
};

const productTitleStyles = { fontSize: "1rem", fontWeight: "bold" };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        borderRadius: "25px",
        
      }}
    >

      <Card>
       
        <Grid container spacing={2}>

          {/* Imagen del Producto y Descuento */}
           <Grid item xs={12} sm={6}>
            <Box
              sx={{
                position: "relative",
                padding: "10px",
                borderRadius: "25px",
                overflow: "hidden",
                width: "400px", 
                margin: "0 auto", 
              }}
            >
              <Carousel
                showThumbs={false}
                dynamicHeight={true}
                emulateTouch={true}
              >

              {product?.images.map((image: string, index: number) => (
                <div key={index}>

                   {/* Etiqueta de % Descuento  */}
                  {parseInt(product?.discount) !== 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: customColors.primary.main,
                        color: customColors.secondary.contrastText,
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="body2">
                        {`${product?.discount}% `}
                        <span style={{ fontSize: "14px" }}>OFF</span>
                      </Typography>
                    </Paper>
                  )}
                  {/* Foto de Producto */}
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    height="350"
                    style={{
                      width: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
             </Carousel>
            </Box>
           </Grid>

          {/* Contenido de texto: Título, Precio, Decuento */}

           <Grid item xs={12} sm={6}>

            <CardContent
              sx={{
                width: "100%", 
                maxWidth: "400px", 
                margin: "0 auto",
              }}
            >

             {/* Título */}
             {product && ( // Verificar si product no es null
  <Typography
    variant="h5"
    component="div"
    align="center"
    sx={{
      color: customColors.primary.main,
      margin: "0 auto",
      ...productTitleStyles,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
      ...(clickedProduct === product.title
        ? {
            whiteSpace: 'normal',
            maxWidth: '70%',
            margin: '0 auto',
          }
        : null),
    }}
    onClick={() => handleTitleClick(product.title)}
  >
    {clickedProduct === product.title
      ? product.title.toUpperCase()
      : product.title.length > maxTitleLength
      ? `${product.title.substring(0, maxTitleLength).toUpperCase()}...`
      : product.title.toUpperCase()}
  </Typography>
)}



                {/* Precio Original precio con descuento */}

              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ display: 'flex', justifyContent: 'center' }}
              >
                  {parseInt(product?.discount) !== 0 && (
                      <Typography
                        variant="body2"
                        style={{
                          textDecoration: "line-through",
                          display: "block",
                          textAlign: "center",
                          marginRight: "16px",
                          color: customColors.primary.main
                        }}
                      >
                        ${product?.price}
                      </Typography>
                    )}

                      <Typography
                          variant="body1"
                          align="center"
                          style={{
                            color: customColors.primary.main,
                            fontSize: "24px"
                          }}
                          >
                          ${calculateFinalPrice(product?.price || "0", product?.discount || "0")}
                      </Typography> 
              </Typography>

                          {/* Detalles del Producto */}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: '20px', // Ajusta el margen superior según sea necesario
              }}
              >
              <PaymentMethodsInfo/>
              <ShippingMethodsInfo/>
              <ProductDetailsInfo/>
            </Box>

          </CardContent>
        </Grid>
      </Grid>


         
            <CardActions>
              <Grid container spacing={2} justifyContent="center">
                {/* Primer bloque */}
                <Grid item xs={12} sm={6} md={6}>
                  <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={1}
                  >
                    {product && (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const newValue = productCounters[product.barcode] - 1;
                          handleCounterChange(product, newValue);
                        }}
                        sx={{ color: customColors.primary.main }}
                      >
                        <RemoveIcon />
                      </IconButton>
                    )}
                    <Typography variant="body2" sx={{ color: customColors.primary.main }}>
                      {productCounters[product?.barcode || ""] || 1}
                    </Typography>
                    {product && (
                      <IconButton
                        color="primary"
                        onClick={() => {
                          const newValue = productCounters[product.barcode] + 1;
                          handleCounterChange(product, newValue);
                        }}
                        sx={{ color: customColors.primary.main }}
                      >
                        <AddIcon />
                      </IconButton>
                    )}
                  </Stack>
                </Grid>
                {/* Segundo bloque */}
                <Grid item xs={12} sm={6} md={6}>
                  {product && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleAddToCart}
                      fullWidth
                      size="small"
                      disableRipple
                      sx={{
                        backgroundColor: customColors.primary.main,
                        color: customColors.secondary.contrastText,
                        '&:hover, &:focus': {
                          backgroundColor: customColors.secondary.main,
                          color: customColors.primary.contrastText,
                        },
                      }}
                    >
                      Agregar al carrito
                    </Button>
                  )}
                </Grid>
              </Grid>
             
          </CardActions>
              {/* Agregar aquí el bloque para mostrar el mensaje de error */}
              <Grid item xs={12}>
                  {showError && (
                    <Typography variant="body1" style={{ marginTop: '5px', marginBottom: '15px', color: 'red', textAlign: 'center' }}>
                      {errorMessage}
                    </Typography>
                  )}
                </Grid>
                {/* Fin del bloque para mostrar el mensaje de error */}

                {product && exceededMaxInCart[product.barcode] && (
                  <CardContent style={{ color: 'red', marginTop: '10px', textAlign: 'center', marginBottom: '15px' }}>
                    <Typography variant="body1">Tienes el máximo disponible.</Typography>
                  </CardContent>
                )}



      </Card>
      <Notification />
    </Box>
  );
  
  
  };
  
  export default ItemDetail;
  