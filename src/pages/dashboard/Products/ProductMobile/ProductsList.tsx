import  { useEffect, useState } from "react";
import { Button, IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, Table, Drawer, Typography,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { db } from "../../../../firebase/firebaseConfig";

import {
  collection,
  doc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { Product} from '../../../../type/type';

import Box from "@mui/material/Box";
import ProductsForm from "./ProductsForm";
import CloseIcon from "@mui/icons-material/Close";




const ProductsList = () => {

  const [open, setOpen] = useState<boolean>(false);
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

  
  const deleteProduct = (id: string) => {
    deleteDoc(doc(db, "products", id));
    setIsChange(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product: Product | null) => {
    setProductSelected(product);
    setOpen(true);
  };




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
    marginRight: '2px',
    marginLeft: '0',
    fontSize: '24px',
  };
  
  const textStyles = {
    fontSize: '20px',
    color: customColors.secondary.main,
    marginLeft: '24px',
  };

  const [listOpen, setListOpen] = useState(false);

  const handleBtnClick = () => {
    setListOpen(!listOpen);
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
      Mis Productos
    </Button>

    <Drawer
      anchor="left"
      open={listOpen}
      onClose={() => setListOpen(false)}
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
        <Typography sx={textStyles}>Mis Productos</Typography>
        <IconButton
          aria-label="close"
          onClick={handleBtnClick}
          sx={closeButtonStyles}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: "411px", overflowX: "scroll" }}>
     
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              {/* <TableCell variant="head" align="center">Id</TableCell> */}
              <TableCell variant="head" align="justify">Título</TableCell>
              <TableCell variant="head" align="justify">Imagen</TableCell>
              <TableCell variant="head" align="justify">Precio</TableCell>
              <TableCell variant="head" align="justify">Stock</TableCell>
              {/* <TableCell variant="head" align="justify">Categoria</TableCell> */}
              <TableCell variant="head" align="justify">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {/* <TableCell component="th" scope="row" align="left">
                  {product.id}
                </TableCell> */}
                 <TableCell component="th" scope="row" align="center" style={{ width: '100%' }}>
                  {product.title}
                 </TableCell>
                 <TableCell component="th" scope="row" align="center">
                  <img
                    src={product.images && product.images[0] ? product.images[0] : ''}
                    alt=""
                    style={{ width: "100px", height: "80px", maxWidth: "100%" }}
                  />
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {product.price}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {product.quantities}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {product.category}
                </TableCell> 
                <TableCell component="th" scope="row" align="center">
                  <IconButton onClick={() => handleOpen(product)}>
                    <EditIcon color="primary" />
                  </IconButton>
                  <IconButton onClick={() => deleteProduct(product.id)}>
                    <DeleteForeverIcon color="primary" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{ position: 'relative' }}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            top: '5%',    
            right: '5%',   
            bottom: 'auto',  
          }}
        >
          <CloseIcon />
        </IconButton>

          <ProductsForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            products={products}
          />

        </Box>
      </Modal>

      </Drawer>
    </Box>
  );
};

export default ProductsList;
