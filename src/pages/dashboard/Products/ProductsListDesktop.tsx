import  { useEffect, useState } from "react";
import {IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, Paper, TableRow, Table,} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { db } from "../../../firebase/firebaseConfig";
import { useColorsContext } from '../../../context/ColorsContext'; 
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { Product} from '../../../type/type';

import Box from "@mui/material/Box";
import ProductsForm from "./ProductsForm";
import CloseIcon from "@mui/icons-material/Close";




const ProductsListDesktop = () => {
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
          salesCount: productData.salesCount || 0,
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


  return (


    <Box sx={{ marginLeft:"0px"}} >
      <TableContainer component={Paper} sx={{ maxWidth: "90%"}}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell variant="head" align="center">Id</TableCell>
              <TableCell variant="head" align="justify">Título</TableCell>
              <TableCell variant="head" align="justify">Imagen</TableCell>
              <TableCell variant="head" align="justify">Precio</TableCell>
              <TableCell variant="head" align="justify">Stock</TableCell>
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
                  {product.unit_price}
                </TableCell>
                <TableCell component="th" scope="row" align="justify">
                  {product.stock}
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
    </Box>
  );
};

export default ProductsListDesktop;
