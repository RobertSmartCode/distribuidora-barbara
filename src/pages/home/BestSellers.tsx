// BestSellers.tsx
import React, {useEffect, useState} from "react";
import { db } from "../../firebase/firebaseConfig";
import { getDocs, collection } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box, CardMedia } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Product} from "../../type/type"
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";
import useMediaQuery from '@mui/material/useMediaQuery';





const BestSellers: React.FC = () => {


const [products, setProducts] = useState<Product[]>([]);
const [isComponentReady, setIsComponentReady] = useState(false);
const [loadedImageCount, setLoadedImageCount] = useState(0);
const isMobile = useMediaQuery('(max-width: 600px)');
const maxTitleLength = isMobile ? 15 : 29;
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
const [clickedProduct, setClickedProduct] = useState<string | null>(null);
const handleTitleClick = (title: string) => {
  setClickedProduct((prevClickedProduct) =>
    prevClickedProduct === title ? null : title
  );
};





const handleImageLoad = () => {
  // Incrementa el contador de imágenes cargadas
  setLoadedImageCount((prevCount) => {
    const newCount = prevCount + 1;
    return newCount;
  });
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
        let newArray: Product[] = res.docs.map((product) => {
          return { ...product.data(), id: product.id } as Product;
        });

        // Ordenar los productos por salesCount
        newArray.sort((a, b) => parseInt(b.salesCount, 10) - parseInt(a.salesCount, 10));

        setProducts(newArray);
      })
      .catch((err) => console.log(err));
  }, []);
  

  // Colores personalizados
  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',
      contrastText: '#fff',
    },
  };

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

  const productPriceStyles = {
    fontSize: "1.2rem",
    color: customColors.primary.main,
    marginBottom: '16px',
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
          <CardMedia
            component="img"
            height="140"
            image={product.images[0]}
            alt={product.title}
            style={{ objectFit: "contain", width: "100%", 
            marginBottom: '8px',
            }}
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

            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{
                ...productTitleStyles,
                whiteSpace: clickedProduct === product.description ? 'normal' : 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                cursor: 'pointer', // Agregar esta línea para cambiar el cursor al pasar el mouse
                overflowWrap: 'break-word', // Agregar esta línea para permitir el salto de línea en palabras largas
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
    </div>
  );
  

};

export default BestSellers;


