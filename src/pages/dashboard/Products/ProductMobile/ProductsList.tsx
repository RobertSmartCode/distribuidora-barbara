import  { useEffect, useState } from "react";
import { Button, IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, Table, Drawer, Typography,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { db } from "../../../../firebase/firebaseConfig";
import { useColorsContext } from '../../../../context/ColorsContext'; 
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
  const { updateColors } = useColorsContext()!;
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
                  {product.unit_price}
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                  {product.stock}
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
            sx={{ position: 'absolute', top: '20px', right: '20px' }}
          >
            <CloseIcon />
          </IconButton>

          <ProductsForm
            handleClose={handleClose}
            setIsChange={setIsChange}
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            products={products}
            updateColors={updateColors} 
          />

        </Box>
      </Modal>

      </Drawer>
    </Box>
  );
};

export default ProductsList;
