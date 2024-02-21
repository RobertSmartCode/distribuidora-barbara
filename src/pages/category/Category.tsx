import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia, Paper } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from '../../type/type';
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";
import useMediaQuery from '@mui/material/useMediaQuery';
import {customColors} from "../../styles/styles"
import { useParams } from 'react-router-dom';
import Footer from "../../components/common/layout/Navbar/Footer/Footer";

const Category: React.FC = () => {
  const { category, subcategory } = useParams();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const maxTitleLength = isMobile ? 15 : 29;
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

 
  const [isComponentReady, setIsComponentReady] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedImageCount((prevCount) => prevCount + 1);
  };

  const generateSlug = (title:string) => {
    return title
      .toLowerCase() // Convertir a minúsculas
      .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '-') // Reemplazar espacios con guiones
      .trim(); // Eliminar espacios en blanco al inicio y al final
  };
  

  useEffect(() => {
    if (loadedImageCount >= allProducts.length) {
      setIsComponentReady(true);
    }
  }, [loadedImageCount, allProducts]);



  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      let productsQuery = query(productsCollection);
  
      // Obtenemos las categoría y subcategoría de los parámetros de la URL
  
  
      // Si hay una categoría proporcionada en los parámetros de la URL, filtramos por esa categoría
      if (category) {
        productsQuery = query(productsCollection, where("category", "==", category));
      }
  
      // Si hay una subcategoría proporcionada en los parámetros de la URL, filtramos por esa subcategoría
      if (subcategory) {
        productsQuery = query(productsCollection, where("subCategory", "==", subcategory));
      }
  
      try {
        const querySnapshot = await getDocs(productsQuery);
        const productsData = querySnapshot.docs
          .map((doc) => ({ ...doc.data(), id: doc.id } as Product))
          .filter((product) => product.online === true);
  
        setAllProducts(productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };
  
    fetchProducts();
}, [category, subcategory]);
  

  const containerStyles = { padding: '8px' };
  const productStyles = { border: "1px solid gray", padding: '8px', marginBottom: '8px', display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", backgroundColor: '#fff', color: '#000' };
  const productTitleStyles = { fontSize: "1rem", fontWeight: "bold" };
  const productDetailStyles = { backgroundColor: '#fff', color: '#000', border: '2px solid #000', borderRadius: '50%', padding: '8px' };
  const iconStyles = { fontSize: '1rem' };
  const productCartStyles = { backgroundColor: '#000', color: '#fff' };
  const buttonContainerStyles = {
    display: "flex",
    justifyContent: "center", 
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
  <>
    {isComponentReady && (
      <Grid container spacing={2} sx={containerStyles}>
        {/* Productos más vendidos */}
        {products.length === 0 ? (
         
        
         <Typography
            variant="h5"
            align="center"
            sx={{
              fontWeight: 'bold',
              color: '#f44336',
              marginTop: '20px',
              margin: 'auto'
            }}
          >
            ¡Ups! Parece que este producto no está disponible por el momento.
          </Typography>
          

        ) : (
          products.map((product) => (
            <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
              <Card sx={productStyles}>
                <Box sx={{ position: "relative" }}>
                  {/* Etiqueta de % Descuento */}
                  { parseInt(String(product?.discount)) !== 0 && (
                    <Paper
                      elevation={0}
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: isMobile ? 0 : "calc(-15%)",
                        backgroundColor: customColors.primary.main,
                        color: customColors.secondary.contrastText,
                        width: isMobile ? "32px" : "48px", 
                        height: isMobile ? "32px" : "48px", 
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2, 
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: isMobile ? "10px" : "inherit" }}>
                        {`${product?.discount}% `}
                        <span style={{ fontSize: isMobile ? "8px" : "14px" }}>OFF</span>
                      </Typography>
                    </Paper>
                  )}

                  {/* Imagen del producto */}
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
                      ? product.description
                      : product.description.length > maxTitleLength
                      ? `${product.description.substring(0, maxTitleLength)}...`
                      : product.description}
                  </Typography>

                  {/* Precio del producto */}
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    sx={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {parseInt(String(product?.discount))!== 0 && (
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
                      to={`/itemDetail/${product.id}`}
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
          ))
        )}
      </Grid>
    )}
    <Footer /> 
  </>
);

};

export default Category;



