import React, { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, query, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, Button, IconButton, Box } from "@mui/material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import FilterProduct from "./FilterProducts"; 
import { useFilterContext } from "../../context/FilterContext";
import { useSortContext } from "../../context/SortContext";

import AppliedFilters from "./AppliedFilters"; 
import { Product } from '../../type/type';
import { useTheme, useMediaQuery } from '@mui/material';
import Filter from "./Filter";
import SelectionCard from "../../components/pageComponents/SelectionCard/SelectionCard";

const Shop: React.FC = () => {
 
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const { filter } = useFilterContext()!;
  const { sort } = useSortContext()!;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  

  const [isComponentReady, setIsComponentReady] = useState(false);
  const [loadedImageCount, setLoadedImageCount] = useState(0);


  const handleImageLoad = () => {
    // Incrementa el contador de imágenes cargadas
    setLoadedImageCount((prevCount) => {
      const newCount = prevCount + 1;
      return newCount;
    });
  };
  useEffect(() => {

 
    if (loadedImageCount >= allProducts.length) {
      // Actualiza el estado para permitir el renderizado
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
          (doc) => ({
            ...doc.data(),
            id: doc.id,
          } as Product)
        );

        setAllProducts(productsData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFiltersAndSort = () => {
      let filteredProducts = [...allProducts];

      if (filter.colors) {
        const selectedColors = Object.keys(filter.colors).filter(
          (color) => filter.colors[color]
        );
        if (selectedColors.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            selectedColors.includes(product.colors[0].color)
          );
        }
      }

      if (filter.sizes) {
        const selectedSizes = Object.keys(filter.sizes).filter(
          (size) => filter.sizes[size]
        );
        if (selectedSizes.length > 0) {
          filteredProducts = filteredProducts.filter((product) =>
            selectedSizes.some((size) => product.sizes.includes(size))
          );
        }
      }

       // Nuevo bloque para filtrar por rango de precios
    if (filter.priceRange.from && filter.priceRange.to) {
      filteredProducts = filteredProducts.filter((product) => {
        const price = product.unit_price;
        return price >= parseInt(filter.priceRange.from) && price <= parseInt(filter.priceRange.to);
      });
    }

      // Aplica la clasificación según la opción seleccionada
      if (sort.sortBy === "lowToHigh") {
        filteredProducts.sort((a, b) => a.unit_price - b.unit_price);
      } else if (sort.sortBy === "highToLow") {
        filteredProducts.sort((a, b) => b.unit_price - a.unit_price);
      } else if (sort.sortBy === "oldToNew") {
        filteredProducts.sort(
          (a, b) => {
            const dateA = new Date(a.createdAt.replace(/ de /g, ' ')).getTime();
            const dateB = new Date(b.createdAt.replace(/ de /g, ' ')).getTime();
            return dateA - dateB;
          }
        );
      } else if (sort.sortBy === "newToOld") {
        filteredProducts.sort(
          (a, b) => {
            const dateA = new Date(a.createdAt.replace(/ de /g, ' ')).getTime();
            const dateB = new Date(b.createdAt.replace(/ de /g, ' ')).getTime();
            return dateB - dateA;
          }
        );
      }

      setProducts(filteredProducts);
    };

    applyFiltersAndSort();
  }, [filter, sort, allProducts]);

  // Restablece los productos cuando se quita un filtro
  useEffect(() => {
    if (!filter.colors && !filter.sizes) {
      setProducts(allProducts);
    }
  }, [filter, allProducts]);




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

  const containerStyles = {
    padding: '8px',
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

  const productImageStyles = {
    width: "100%", 
    marginBottom: '8px',
    borderBottom: "1px solid #000",
  };
  
  const productTitleStyles = {
    fontSize: "1rem",
    fontWeight: "bold",
  };

  const productPriceStyles = {
    fontSize: "1.2rem",
    color: customColors.primary.main,
    marginBottom: '24px',
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
        {/* Fila con Filter */}
        <Grid item xs={12} md={isMobile ? 3 : 2} lg={isMobile ? 3 : 2}>
          {isMobile ? (
            <Grid container spacing={2} justifyContent="left" sx={{ marginLeft: 1 }}>
              <FilterProduct />
            </Grid>
          ) : (
            <Filter />
          )}
          {isMobile && (
            <Grid container spacing={2} justifyContent="left" sx={{ margin: 1, marginTop: 1 }}>
              <AppliedFilters />
            </Grid>
          )}
        </Grid>
  
        {/* Productos */}
        <Grid item container xs={12} md={isMobile ? 9 : 10} lg={isMobile ? 9 : 10} spacing={1}>
          {products.map((product) => (
            <Grid item xs={6} sm={4} md={3} lg={3} key={product.id}>
              <Card sx={productStyles}>
                <img
                src={product.images[0]}
                alt={product.title}
                style={productImageStyles}
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
                    Precio: ${product.unit_price}
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
      </Grid>
       )}
    </div>
  );
  
  
};

export default Shop;