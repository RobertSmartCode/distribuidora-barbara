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
  Divider,
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
import {CartItem, Product } from "../../../type/type"

const customColors = {
  primary: {
    main: "#000",
    contrastText: "#000",
  },
  secondary: {
    main: "#FFFFFF",
    contrastText: "#FFFFFF",
  },
};

const ItemDetail: React.FC = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const {  addToCart, checkStock, getStockForProduct } = useContext(CartContext)!;
  const [product, setProduct] = useState<any>(null);
  const [counter, setCounter] = useState<number>(1);


  const [selectedColor, setSelectedColor] = useState<string>("");
  
  const [selectedSize, setSelectedSize] = useState<string>("");

 const [availableSizes, setAvailableSizes] = useState<string[]>();

 const [availableColors, setAvailableColors] = useState<string[]>();

 const [showError, setShowError] = useState(false);

 const [exceededMaxInCart, setExceededMaxInCart] = useState(false);


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



useEffect(() => {
  if (product) {
    const initialAvailableSizes: string[] = product.colors
      ? product.colors
          .find((colorObject: { color: string }) => colorObject.color === colorsArray[0])
          ?.sizes || []
      : [];

    const initialAvailableColors: string[] = product.colors
      ? product.colors.map((colorObject: { color: string }) => colorObject.color) || []
      : [];

    setAvailableSizes(initialAvailableSizes);
    setAvailableColors(initialAvailableColors);

    // Si hay tallas disponibles, seleccionar la primera por defecto
    if (initialAvailableSizes.length > 0) {
      setSelectedSize(initialAvailableSizes[0]);
    }

    // Si hay colores disponibles, seleccionar el primero por defecto
    if (initialAvailableColors.length > 0) {
      setSelectedColor(initialAvailableColors[0]);
    }
  }
}, [product]);






const handleCounterChange = (value: any, product: Product, color: string, size: string) => {
  const maxInCart = getStockForProduct(product, color, size);

  // Actualizar el contador solo si hay suficiente stock y no se ha excedido el máximo en el carrito
  if (value >= 1 && value <= maxInCart) {
    setCounter(value);
    setExceededMaxInCart(false);  
  } 
  if ( value >= maxInCart) {
    setExceededMaxInCart(true);
    setTimeout(() => {
      setExceededMaxInCart(false);
    }, 1000); 
  }

};



  const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const color = event.target.value;
    setSelectedColor(color);
  
    // Filtrar las tallas disponibles para el color seleccionado
    const selectedColorObject = product?.colors.find((c: any) => c.color === color);
    const availableSizes = selectedColorObject?.sizes || [];
  
    // Actualizar las tallas disponibles
    setAvailableSizes(availableSizes);
  
    // Si hay tallas disponibles, seleccionar la primera por defecto
    if (availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    }
  };
  
  const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const size = event.target.value;
    setSelectedSize(size);
  };

  const colorsArray: string[] = product?.colors
  ? product.colors.map((colorObject: { color: string }) => colorObject.color)
  : [];


  const calculateFinalPrice = (product: Product): number => {
    const originalPrice = product?.unit_price || 0;
    const discountPercentage = product?.discount || 0;
    return originalPrice - (originalPrice * (discountPercentage / 100));
  };
  

  const handleAddToCart = () => {
  
    // Verifica si hay suficiente stock antes de agregar al carrito
     const hasEnoughStock = checkStock(product, selectedColor, selectedSize);
   
     if (hasEnoughStock) {
       const cartItem: CartItem = {
         ...product,
         quantity: counter,
         selectedColor: selectedColor,
         selectedSize: selectedSize,
       };
       addToCart(cartItem);
       setCounter(1);
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
      }}
    >
      <Card
        sx={{
          backgroundColor: customColors.secondary.main,
          color: customColors.primary.contrastText,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                position: "relative",
                padding: "10px",
                borderRadius: "25px",
                overflow: "hidden",
              }}
            >
              <Carousel
                showThumbs={false}
                dynamicHeight={true}
                emulateTouch={true}
              >
                {product?.images.map((image: string, index: number) => (
                  <div key={index}>
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
                    <img
                      src={image}
                      alt={`Imagen ${index + 1}`}
                      style={{
                        width: "100%",
                        maxHeight: "400px",
                        objectFit: "contain",
                        paddingBottom: "60px",
                      }}
                    />
                  </div>
                ))}
              </Carousel>
              <Divider
                sx={{
                  backgroundColor: customColors.primary.main,
                  position: "absolute",
                  bottom: "1",
                  left: "0",
                  right: "0",
                  width: "100%",
                }}
              />
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
                  ${product?.unit_price}
                </Typography>
                <Typography
                  variant="body1"
                  align="center"
                  style={{
                    color: customColors.primary.main,
                    fontSize: "24px"
                  }}
                >
                 ${calculateFinalPrice(product)}
                </Typography>
              </Typography>
  
              <PaymentMethodsInfo />
              <ShippingMethodsInfo />




              {product && (
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  {Array.isArray(availableColors) && availableColors.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <label htmlFor="colorSelect" style={{ fontSize: '18px', fontWeight: 'bold', color: customColors.primary.main, display: 'flex', alignItems: 'start' }}>
                        Colores:
                      </label>
                      <select
                        id="colorSelect"
                        value={selectedColor}
                        onChange={handleColorChange}
                        style={{
                          padding: '10px',
                          border:  `1px solid ${customColors.primary.main}`,
                          borderRadius: '4px',
                          fontSize: '16px',
                          backgroundColor: customColors.secondary.main,
                          color: customColors.primary.main,
                          width: '100%',
                          outline: 'none',
                        }}
                      >
                        {availableColors.map((color, index) => (
                          <option
                            style={{ padding: '8px' }}
                            key={index}
                            value={color}
                          >
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Mostrar tallas disponibles para el color seleccionado */}
                  {Array.isArray(availableSizes) && availableSizes.length > 0 && (
                    <div>
                      <label htmlFor="sizeSelect" style={{ fontSize: '18px', fontWeight: 'bold', color: customColors.primary.main, display: 'flex', alignItems: 'start'}}>
                        Tallas:
                      </label>
                      <select
                        id="sizeSelect"
                        value={selectedSize}
                        onChange={handleSizeChange}
                        style={{
                          padding: '10px',
                          border: `1px solid ${customColors.primary.main}`,
                          borderRadius: '4px',
                          fontSize: '16px',
                          backgroundColor: customColors.secondary.main,
                          color: customColors.primary.main,
                          width: '100%',
                          outline: 'none',
                        }}
                      >
                        {availableSizes.map((size, index) => (
                          <option
                            style={{ padding: '8px' }}
                            key={index}
                            value={size}
                          >
                            {size}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </Box>
)}
            </CardContent>
          </Grid>
        </Grid>
  

        <Grid item xs={12} sm={6}>
          <CardContent>
            <ProductDetailsInfo />
          </CardContent>
        </Grid>
  
        <CardActions>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            spacing={1}
          >
            <IconButton
              color="primary"
              onClick={() => handleCounterChange(counter - 1, product, selectedColor, selectedSize)}
              sx={{ color: customColors.primary.main }}
            >
              <RemoveIcon />
            </IconButton>
            <Typography variant="body2" sx={{ color: customColors.primary.main }}>
              {counter}
            </Typography>
            <IconButton
              color="primary"
              onClick={() => handleCounterChange(counter + 1, product, selectedColor, selectedSize)}
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
  
        {showError && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center', }}>
            <p>No hay suficiente stock para este producto.</p>
          </div>
        )}

        {  exceededMaxInCart && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center', }}>
          <p>Tienes el máximo disponible.</p>
        </div>
        )}

      </Card>
    </Box>
  );
  
  
  };
  
  export default ItemDetail;
  
