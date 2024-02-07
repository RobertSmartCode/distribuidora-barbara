import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia, Paper } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from '../../type/type';
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";
import useMediaQuery from '@mui/material/useMediaQuery';
import {customColors} from "../../styles/styles"


const Shop: React.FC = () => {

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
  
  
  
 
  const [isComponentReady, setIsComponentReady] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);

  const handleImageLoad = () => {
    setLoadedImageCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (loadedImageCount >= allProducts.length) {
      setIsComponentReady(true);
    }
  }, [loadedImageCount, allProducts]);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsQuery = query(productsCollection);
  
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
  }, []);
  

  const containerStyles = { padding: '8px' };
  const productStyles = { border: "1px solid gray", padding: '8px', marginBottom: '8px', display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", backgroundColor: '#fff', color: '#000' };
  const productTitleStyles = { fontSize: "1rem", fontWeight: "bold" };
  const productPriceStyles = { fontSize: "1.2rem", color: '#000', marginBottom: '24px' };
  const productDetailStyles = { backgroundColor: '#fff', color: '#000', border: '2px solid #000', borderRadius: '50%', padding: '8px' };
  const iconStyles = { fontSize: '1rem' };
  const productCartStyles = { backgroundColor: '#000', color: '#fff' };
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

 
  return (

    <>
      {isComponentReady && (
   
        <Grid container spacing={2} sx={containerStyles}>
        
      
              {/* Productos más vendidos */}
              {products.map((product) => (
                <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
                  <Card sx={productStyles}>
                  
                     <Box sx={{ position: "relative" }}>
                          {/* Etiqueta de % Descuento */}
                          {product?.discount && parseInt(String(product?.discount)) !== 0 && (
                            <Paper
                              elevation={0}
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: isMobile ? -32 : -72, 
                                backgroundColor: customColors.primary.main,
                                color: customColors.secondary.contrastText,
                                width: isMobile ? "32px" : "48px", 
                                height: isMobile ? "32px" : "48px", 
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1, // Asegura que la etiqueta esté sobre la imagen
                              }}
                            >
                              <Typography variant="body2" sx={{ fontSize: isMobile ? "10px" : "inherit" }}>
                                {`${product?.discount}% `}
                                <span style={{ fontSize: isMobile ? "8px" : "14px" }}>OFF</span>
                              </Typography>

                            </Paper>
                          )}

                             {/* Imagen del producto */}
                          <CardMedia
                            component="img"
                            height="140"
                            image={product.images[0]}
                            alt={product.title}
                            style={{
                              objectFit: "contain",
                              width: "100%",
                              marginBottom: "8px",
                              zIndex: 0, 
                            }}
                            onLoad={handleImageLoad}
                          />
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








                      <Typography variant="subtitle2" color="textSecondary" sx={productPriceStyles}>
                        Precio: ${product.price}
                      </Typography>
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
              ))}
            </Grid>
          )}
    </>
  );
};

export default Shop;



