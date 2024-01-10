import  { useEffect, useState } from "react";
import ProductsForm from "./ProductsForm";
import { Button, IconButton, Box, Typography, Drawer} from "@mui/material";
import {
    collection,
    getDocs,
  } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import { useColorsContext } from '../../../context/ColorsContext'; 

import { Product} from '../../../type/type';


const ProductAddForm = () => {
    const { updateColors } = useColorsContext()!;
    const [productSelected, setProductSelected] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);

    useEffect(() => {
        setIsChange(false);
        const productsCollection = collection(db, "products");
        getDocs(productsCollection).then((res) => {
          const newArr: Product[] = res.docs.map((productDoc) => {
            const productData = productDoc.data();
            return {
              id: productDoc.id,
              title: productData.title || "", 
              description: productData.description || "",
              unit_price: productData.unit_price || 0,
              stock: productData.stock || 0,
              category: productData.category || "",
              images: productData.images || [],
              sizes: productData.sizes || [],
              colors: productData.colors || [],
              salesCount: productData.salesCount || "",
              featured: productData.featured || false,
              createdAt: productData.createdAt || "",
              keywords: productData.keywords || [],
              discount: productData.discount || 0,
              sku: productData.sku || "",
              elasticity: productData.elasticity || "", 
              thickness: productData.thickness || "", 
              breathability: productData.breathability || "", 
              season: productData.season || "",
              material: productData.material || "", 
              details: productData.details || "", 
              selectedColor: productData.selectedColor  || "", 
              selectedSize: productData.selectedSize || "", 
            };
          });
          setProducts(newArr);
        });
      }, [isChange]);

      const handleClose = () => {
        setFormOpen(false);
      };
    
    
const [formOpen, setFormOpen] = useState(false);

const handleBtnClick = () => {
  setFormOpen(!formOpen);
};

const customColors = {
  primary: {
    main: "#000",
    contrastText: "#000",
  },
  secondary: {
    main: "#fff",
    contrastText: "#fff",
  },
};

const topBarStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexDirection: "row",
  padding: "12px 8px",
  width: "100%",
  margin: "0 auto",
  backgroundColor: customColors.primary.main,
  color: customColors.secondary.main,
};

const closeButtonStyles = {
  color: customColors.secondary.main,
  marginRight: "2px",
  marginLeft: "0",
  fontSize: "24px",
};

const textStyles = {
  fontSize: "20px",
  color: customColors.secondary.main,
  marginLeft: "24px",
};

return (
  <Box>
    <Button
      variant="contained"
      onClick={handleBtnClick}
      sx={{
        backgroundColor: customColors.primary.main,
        color: customColors.secondary.contrastText,
      }}
    >
      Agregar Producto
    </Button>

     <Drawer
        anchor="left"
        open={formOpen}
        onClose={() => setFormOpen(false)}
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "100%",
            
            height: "100%", 
            zIndex: 1300,
          },
        }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={textStyles}>Agregar Producto</Typography>
          <IconButton
            aria-label="close"
            onClick={handleBtnClick}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        {/* Aplica scroll solo al contenido del formulario */}
        <Box sx={{ overflowY: 'scroll', height: '100%' }}>
        <ProductsForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            products={products}
            updateColors={updateColors} 
          />
        </Box>
      </Drawer>

      </Box>
  );
};

export default ProductAddForm;