import  { useEffect, useState } from "react";
import ProductsForm from "./ProductMobile/ProductsForm";
import { Button, IconButton, Box, Typography, Drawer} from "@mui/material";
import {collection, onSnapshot} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import CloseIcon from "@mui/icons-material/Close";
import { Product} from '../../../type/type';


const ProductAddForm = () => {

    const [productSelected, setProductSelected] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isChange, setIsChange] = useState<boolean>(false);

   
  useEffect(() => {
    const productsCollection = collection(db, "products");
    const unsubscribe = onSnapshot(productsCollection, (snapshot) => {
      const newArr: Product[] = snapshot.docs.map((productDoc) => {
        const productData = productDoc.data();
  
        return {
          id: productDoc.id,
          title: productData.title || "",
          brand: productData.brand || "",
          description: productData.description || "",
          subCategory: productData.subCategory || "",
          category: productData.category || "",
          discount: productData.discount || 0,
          unitperpack: productData.unitperpack || 0,
          type: productData.type || "", 
          price: productData.price || 0, 
          quantities: productData.quantities || 0,
          barcode: productData.barcode || 0,
          contentPerUnit: productData.contentPerUnit || 0,
          isContentInGrams: productData.isContentInGrams || false,
          keywords: productData.keywords || "",
          salesCount: productData.salesCount || "",
          featured: productData.featured || false,
          images: productData.images || [],
          createdAt: productData.createdAt || "",
          online: productData.online || false,
          location: productData.location || "",
        };
      });
      setProducts(newArr);
    });
  
    return () => unsubscribe();
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
        width: '70vw', // 70% del ancho de la ventana
        margin: '0 auto', // Centra horizontalmente
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
           
          />
          
        </Box>
      </Drawer>

      </Box>
  );
};

export default ProductAddForm;