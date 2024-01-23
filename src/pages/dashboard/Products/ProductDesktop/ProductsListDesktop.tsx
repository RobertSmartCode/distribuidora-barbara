import  { useEffect, useState } from "react";
import {IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Card,} from "@mui/material";
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




const ProductsListDesktop = () => {
 
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
          category: productData.category || "",
          discount: productData.discount || 0,
          unitperpack: productData.unitperpack || 0,
          productVariants: productData.productVariants || [],
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
              <TableCell variant="head" align="center">Id</TableCell>
              <TableCell variant="head" align="justify">Título</TableCell>
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
                <TableCell component="th" scope="row" align="left">
                  {product.id}
                </TableCell> 
                 <TableCell component="th" scope="row" align="justify" style={{ width: 'auto' , maxWidth: "100%" }}>
                  {product.title}
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
