import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";
import { Product } from '../../type/type';
import { customColors} from '../../styles/styles';
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




  const containerStyles = { 
    padding: '2%',
  };
  
  const productStyles = { 
    border: "1px solid #ddd", 
    padding: '2%', 
    marginBottom: '2%', 
    display: "flex", 
    flexDirection: "column", 
    alignItems: "center", 
    textAlign: "center", 
    backgroundColor: customColors.secondary.main, 
    color: customColors.primary.main,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };
  
  const productTitleStyles = {
    fontSize: "1.3vw",
    fontWeight: "bold",
    margin: '2% 0',
    maxHeight: '3em', // Ajusta según sea necesario
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };
  
  const productPriceStyles = {
    fontSize: "1.3vw",
    color: customColors.primary.main,
    marginBottom: '3%',
  };
  


  const iconStyles = {
    fontSize: '1rem',
  };
  
  const productCartStyles = { 
    backgroundColor: customColors.primary.main, 
    color: customColors.secondary.main, 
    marginTop: '2%',
    padding: '8px 16px',
  };
  
  const productDetailStyles = { 
    backgroundColor: customColors.secondary.main, 
    color: customColors.primary.main, 
    border: '2px solid ' + customColors.primary.main, 
    borderRadius: '50%', 
    padding: '8px',
    marginTop: '2%',
  };
  
  const buttonContainerStyles = {
    display: 'flex',
    justifyContent: 'center', // Centra los elementos horizontalmente
    marginTop: '2%',
    "& > *": {
      marginRight: '8%', // Ajusta el margen entre los elementos
    },
  };
  
  



 
  
  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
  };

  return (
    <div>
      {isComponentReady && (
        <Grid container spacing={2} sx={containerStyles}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={4} lg={3} key={product.id}>
              <Card sx={productStyles}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.images[0]}
                  alt={product.title}
                  style={{
                    objectFit: "contain",
                    width: "100%",
                    marginBottom: '8px',
                    borderBottom: "1px solid #000",
                  }}
                  onLoad={handleImageLoad}
                />
                {selectedProduct === product ? (
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
