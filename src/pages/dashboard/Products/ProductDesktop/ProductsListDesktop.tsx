import  { useEffect, useState } from "react";
import {IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Card, Typography,} from "@mui/material";
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
import CloseIcon from "@mui/icons-material/Close";
import ProductsEditDesktop from "./ProductsEditDesktop";
import useMediaQuery from '@mui/material/useMediaQuery';



const ProductsListDesktop = () => {
 
  const [open, setOpen] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const isMobile = useMediaQuery('(max-width: 600px)');
  const maxTitleLength = isMobile ? 15 : 40;
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const handleTitleClick = (title: string) => {
    setClickedProduct((prevClickedProduct) =>
      prevClickedProduct === title ? null : title
    );
  };


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
          salesCount: productData.salesCount || 0,
          featured: productData.featured || false,
          images: productData.images || [],
          createdAt: productData.createdAt || "",
          online: productData.online || false,
          location: productData.location || "",
          stockAccumulation: productData.stockAccumulation || 0,
          quantityHistory: [
            ...(productData.quantityHistory || []),
          ]

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

  return (


    <Box  >
        <Card
          sx={{
            width: '80%',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: 'auto', // Centra el Card dentro del Box
          }}
        >
      <TableContainer  >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              
              <TableCell variant="head" align="center">Descripción</TableCell>
              <TableCell variant="head" align="justify">Precio</TableCell>
              <TableCell variant="head" align="justify">Imagen</TableCell>
              <TableCell variant="head" align="justify">Categoria</TableCell> 
              <TableCell variant="head" align="justify">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" align="justify" style={{ width: 'auto', maxWidth: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      whiteSpace: clickedProduct === product.description ? 'normal' : 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer', // Agregar esta línea para cambiar el cursor al pasar el mouse
                    }}
                    onClick={() => handleTitleClick(product.description)}
                  >
                    {clickedProduct === product.description
                      ? product.description
                      : product.description.length > maxTitleLength
                      ? `${product.description.substring(0, maxTitleLength)}...`
                      : product.description}
                  </Typography>
                </TableCell>

               


                 <TableCell component="th" scope="row" align="justify" style={{ width: 'auto' , maxWidth: "100%" }}>
                  {product.price}
                 </TableCell>
                 <TableCell component="th" scope="row" align="justify">
                  <img
                    src={product.images && product.images[0] ? product.images[0] : ''}
                    alt=""
                    style={{ width: "auto", height: "80px", maxWidth: "100%" }}
                  />
                </TableCell>
             
                 <TableCell component="th" scope="row" align="justify">
                  {product.category}
                </TableCell> 
                <TableCell component="th" scope="row" align="justify">
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
          sx={{ position: 'absolute', top: '10%', right: '12%' }}
        >
          <CloseIcon />
        </IconButton>


          <ProductsEditDesktop
            productSelected={productSelected}
            setProductSelected={setProductSelected}
            handleClose={handleClose}
          />

        </Box>
      </Modal>
      </Card>
    </Box>
  );
};

export default ProductsListDesktop;
