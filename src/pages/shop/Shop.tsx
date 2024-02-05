import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Product } from '../../type/type';
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";

const Shop: React.FC = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
 
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
        const productsData = querySnapshot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Product)
        );

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

    <div>
       {isComponentReady && (
   
    <Grid container spacing={2} sx={containerStyles}>
    
  
      {/* Productos más vendidos */}
      {products.map((product) => (
        <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
          <Card sx={productStyles}>
          <CardMedia
            component="img"
            height="140"
            image={product.images[0]}
            alt={product.title}
            style={{ objectFit: "contain", width: "100%", 
            marginBottom: '8px',
            borderBottom: "1px solid #000", }}
            onLoad={handleImageLoad} 
            />
             {selectedProduct === product ?  (
                  <SelectionCard
                    isOpen={true}
                    onClose={() => setSelectedProduct(null)}
                    handleBuyClick={handleBuyClick}
                    product={product}
                   
                  />
                ) : null}
            <CardContent>
              <Typography variant="subtitle1" gutterBottom sx={productTitleStyles}>
                {product.title}
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
    </div>
  );
};

export default Shop;
