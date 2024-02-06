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


const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const { getQuantityByBarcode, addToCart, getTotalQuantity,  checkStock } = useContext(CartContext)!;
  const [product, setProduct] = useState<any>(null);
  const [counter, setCounter] = useState<number>(1);
 
  const [showError, setShowError] = useState(false);
  const errorMessage = "Ha ocurrido un error al agregar el producto al carrito. Por favor, intenta nuevamente.";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const refCollection = collection(db, "products");
        const refDoc = doc(refCollection, id);
        const docSnapshot = await getDoc(refDoc);

        if (docSnapshot.exists()) {
          const productData = docSnapshot.data();
          setProduct({ ...productData, id: docSnapshot.id });
        } else {
          console.log("El producto no existe");
        }
      } catch (error) {
        console.error("Error al obtener el producto:", error);
      }
    };

    fetchProduct();
  }, [id]);
  

  const handleCounterChange = (value: number) => {
    if (value >= 1 && value <= product?.stock) {
      setCounter(value);
    }
  };

  

  const handleAddToCart = () => {
    let quantityToAdd = 1;

    // Verifica si hay suficiente stock antes de agregar al carrito
    const hasEnoughStock = checkStock(product);

    if (hasEnoughStock) {
      const cartItem: CartItem = {
        ...product,
        quantity: quantityToAdd,
      };

      addToCart(cartItem);

    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };


  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
        position: "relative",
        borderRadius: "25px",
        
      }}
    >
      <Card>

        <Grid container spacing={2}>

          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                position: "relative",
                padding: "10px",
                borderRadius: "25px",
                overflow: "hidden",
                maxWidth:"500px",
                maxHeight:"500px"
              }}
            >
            <Carousel
              showThumbs={false}
              dynamicHeight={true}
              emulateTouch={true}
            >
              {product?.images.map((image: string, index: number) => (
                <div key={index}>
                                  
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
                  <img
                    src={image}
                    alt={`Imagen ${index + 1}`}
                    style={{
                      width: "100%",
                      height: "100%", // Ajusta la altura para que llene el contenedor
                      objectFit: "contain",
                    }}
                  />
                </div>
              ))}
            </Carousel>
             
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <CardContent>
              <Typography
                variant="h5"
                component="div"
                align="center"
                sx={{
                  color: customColors.primary.main,
                }}
              >
                {product?.title}
              </Typography>
  
              <Typography
                variant="subtitle1"
                color="textSecondary"
                sx={{ display: 'flex', alignItems: 'center' }}
              >
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
                <Typography
                  variant="body1"
                  align="center"
                  style={{
                    color: customColors.primary.main,
                    fontSize: "24px"
                  }}
                >
                 ${product?.price}
                </Typography>
              </Typography>
  
              <PaymentMethodsInfo />
              <ShippingMethodsInfo />

            </CardContent>
          </Grid>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <CardContent>
            <ProductDetailsInfo />
          </CardContent>
        </Grid>
          {/* Agregar aquí el bloque para mostrar el mensaje de error */}
          <Grid item xs={12}>
          {showError && (
            <Typography variant="body1" color="error" align="center">
              {errorMessage}
            </Typography>
          )}
        </Grid>
        {/* Fin del bloque para mostrar el mensaje de error */}
  
        <CardActions>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <IconButton
              color="primary"
              onClick={() => handleCounterChange(counter - 1)}
              sx={{ color: customColors.primary.main }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: customColors.primary.main }}>
              {counter}
            </Typography>
            <IconButton
              color="primary"
              onClick={() => handleCounterChange(counter + 1)}
              sx={{ color: customColors.primary.main }}
            >
              <AddIcon />
            </IconButton>
          </Stack>
  
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
        </CardActions>
  
        {typeof id !== 'undefined' && getQuantityByBarcode(Number(id)) && (
          <Typography variant="h6">
            Ya tienes {getTotalQuantity()} en el carrito
          </Typography>
        )}
        {typeof id !== 'undefined' && product?.stock === getQuantityByBarcode(Number(id)) && (
          <Typography variant="h6">
            Ya tienes el máximo en el carrito
          </Typography>
        )}
      </Card>
    </Box>
  );
  
  
  };
  
  export default ItemDetail;
  