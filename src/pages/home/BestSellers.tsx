// BestSellers.tsx
import React, {useEffect, useState} from "react";
import { db } from "../../firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia, Paper } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Product} from "../../type/type"
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";
import useMediaQuery from '@mui/material/useMediaQuery';
import {customColors} from "../../styles/styles"




const BestSellers: React.FC = () => {


const [products, setProducts] = useState<Product[]>([]);
const [isComponentReady, setIsComponentReady] = useState(false);
const [loadedImageCount, setLoadedImageCount] = useState(0);
const isMobile = useMediaQuery('(max-width: 600px)');
const maxTitleLength = isMobile ? 10 : 22;
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [clickedProduct, setClickedProduct] = useState<string | null>(null);
const handleTitleClick = (title: string) => {
  setClickedProduct((prevClickedProduct) =>
    prevClickedProduct === title ? null : title
  );
};
const [hoveredProduct, setHoveredProduct] = useState<Product | null>(null);
const handleMouseEnter = (barcode: number) => {
  const product = products.find((p) => p.barcode === barcode);
  if (product) {
    setHoveredProduct(product);
  }
};
const handleMouseLeave = () => {
  setHoveredProduct(null);
};




const handleImageLoad = () => {
  // Incrementa el contador de imágenes cargadas
  setLoadedImageCount((prevCount) => {
    const newCount = prevCount + 1;
    return newCount;
  });
};

const generateSlug = (title:string) => {
  return title
    .toLowerCase() // Convertir a minúsculas
    .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .trim(); // Eliminar espacios en blanco al inicio y al final
};



useEffect(() => {


  if (loadedImageCount >= products.length) {
    // Actualiza el estado para permitir el renderizado
    setIsComponentReady(true);
  }
}, [loadedImageCount, products]);

useEffect(() => {
  let refCollection = collection(db, "products");
  getDocs(refCollection)
    .then((res) => {
      let newArray: Product[] = res.docs
        .map((product) => ({ ...product.data(), id: product.id } as Product))
        .filter((product) => product.online === true); // Filtrar los productos cuya propiedad "online" sea true

      // Ordenar los productos por salesCount
      newArray.sort((a, b) => parseInt(b.salesCount, 10) - parseInt(a.salesCount, 10));

      setProducts(newArray);
    })
    .catch((err) => console.log(err));
}, []);




  // Estilos con enfoque sx
  const containerStyles = {
    padding: '8px',
    marginTop:"20px"
  };

  const productStyles = {
    border: "1px solid gray",
    padding: '8px',
    marginBottom: '8px',
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: customColors.secondary.main,
    color: customColors.primary.main,
  };


  

  const productTitleStyles = {
    fontSize: "1rem",
    fontWeight: "bold",
  };



  const productDetailStyles = {
    backgroundColor: customColors.secondary.main,
    color: customColors.primary.main,
    border: `2px solid ${customColors.primary.main}`,
    borderRadius: '50%',
    padding: '8px',
  };

  const iconStyles = {
    fontSize: '1rem',
  };

  const productCartStyles = {
    backgroundColor:customColors.primary.main,
    color:customColors.secondary.main,
  };

  const buttonContainerStyles = {
    display: "flex",
    justifyContent: "center", // Centra los elementos horizontalmente
    gap: '8px',
    marginTop: '16px',
    marginLeft: '32px',
    marginRight: '32px',
    marginBottom: '0px',
  };
  
  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
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

  return (

    <div>
       {isComponentReady && (
   
    <Grid container spacing={2} sx={containerStyles}>
      {/* Título responsivo */}
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h4">Lo más vendido</Typography>
      </Grid>
  
      {/* Productos más vendidos */}
      {products.map((product) => (
        <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
          <Card sx={productStyles}>
                                                {/* Etiqueta de % Descuento */}
                                                <Box sx={{ position: "relative" }}>
                          {/* Paper para la etiqueta de descuento */}
                          {parseInt(String(product?.discount)) !== 0 && (
                            <Paper
                              elevation={0}
                              sx={{
                                position: "absolute",
                                top: "0", // Ajusta la posición vertical
                                left: isMobile ? "-70px" : "-140px",
                                backgroundColor: customColors.primary.main,
                                color: customColors.secondary.contrastText,
                                width: isMobile ? "36px" : "48px",
                                height: isMobile ? "36px" : "48px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 100, // Ajusta el índice z para que el Paper esté sobre el Card
                              }}
                            >
                              {/* Contenido del Paper */}
                              <Typography variant="body2" sx={{ fontSize: isMobile ? "8px" : "inherit" }}>
                                {`${product?.discount}% `}
                                <span style={{ fontSize: isMobile ? "10px" : "14px" }}>OFF</span>
                              </Typography>
                            </Paper>
                          )}
                          </Box>
                                 {/* Paper para la etiqueta de descuento */}


                                 {/* Imagen del producto */}

                      <Box sx={{ position: "relative" }}>
                         
                             <Link to={`/itemDetail/${generateSlug(product.title)}/${product.id}`}>
                              <Box
                                onMouseEnter={() => handleMouseEnter(product.barcode)}
                                onMouseLeave={handleMouseLeave}
                              >
                                <CardMedia
                                  component="img"
                                  height="140"
                                  image={product.images[0]}
                                  alt={product.title}
                                  onLoad={handleImageLoad}
                                  style={{
                                    objectFit: "contain",
                                    width: "100%",
                                    marginBottom: "8px",
                                    zIndex: 0,
                                    transition: "transform 0.3s ease-in-out",
                                    transform: hoveredProduct === product ? "scale(1.1)" : "scale(1)",
                                  }}
                                />
                              </Box>
                            </Link>                                                  
                        </Box>

                    {selectedProduct === product ?  (
                          <SelectionCard
                            isOpen={true}
                            onClose={() => setSelectedProduct(null)}
                            handleBuyClick={handleBuyClick}
                            product={product}
                          
                          />
                        ) : null}
                  <CardContent>

                      {/* Imagen del producto */}



                              {/* Descripción del Producto */}

                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                sx={{
                                  ...productTitleStyles,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  cursor: 'pointer',
                                  ...(clickedProduct === product.description
                                    ? {
                                        whiteSpace: 'normal',
                                        maxWidth: '70%',
                                        margin: '0 auto',
                                      }
                                    : null),
                                }}
                                onClick={() => handleTitleClick(product.description)}
                              >
                                {clickedProduct === product.description
                                  ? product.description.toUpperCase()
                                  : product.description.length > maxTitleLength
                                  ? `${product.description.substring(0, maxTitleLength).toUpperCase()}...`
                                  : product.description.toUpperCase()}
                              </Typography>
                          {/* Descripción del Producto */}
  

                        {/* Precio del producto */}


                        <Typography
                          variant="subtitle1"
                          color="textSecondary"
                          sx={{ display: 'flex', justifyContent: 'center' }}
                        >
                          {parseInt(String(product?.discount)) !== 0 && (
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
                                  ${calculateFinalPrice(product?.price.toString() || "0", product?.discount.toString()  || "0")}

                              </Typography> 
                          </Typography>

                          {/* Fin del precio */}



              <Box sx={buttonContainerStyles}>
                <Button
                  onClick={() => handleBuyClick(product)} 
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={productCartStyles}
                >
                  Comprar
                </Button>
                <IconButton
                  component={Link}
                  to={`/itemDetail/${generateSlug(product.title)}/${product.id}`}
                  aria-label="Ver"
                  color="secondary"
                  size="small"
                  sx={productDetailStyles}
                >
                  <VisibilityIcon sx={iconStyles} />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
      )}
    </div>
  );
  

};

export default BestSellers;


