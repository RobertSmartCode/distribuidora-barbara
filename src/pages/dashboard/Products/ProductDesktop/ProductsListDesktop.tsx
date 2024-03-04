import  {useState } from "react";
import { IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Card, Typography, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import ProductsEditDesktop from "./ProductsEditDesktop";
import { useProductContext } from "../../../../context/ProductContext"; // Importar el contexto de productos
import { Product } from "../../../../type/type";
import SearchByName from "./SearchByName";
import SearchByBarCode from "./SearchByBarCode";
import SearchByCategories from "./SearchByCategories";


const ProductsListDesktop = () => {
  const { products, deleteProduct } = useProductContext(); // Usar el contexto de productos
  const [open, setOpen] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const maxTitleLength = 40;

  const handleTitleClick = (title: string) => {
    setClickedProduct((prevClickedProduct) =>
      prevClickedProduct === title ? null : title
    );
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = (product: Product | null) => {
    setProductSelected(product);
    setOpen(true);
  };

 

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12} sm={4}>
          <SearchByName />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SearchByBarCode />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SearchByCategories />
        </Grid>
      </Grid>
  
      <Box mt={2} />
  
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
        <TableContainer>
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
                <TableRow key={product.id}>
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
                  <TableCell align="justify">{product.price}</TableCell>
                  <TableCell align="justify">
                    <img
                      src={product.images && product.images[0] ? product.images[0] : ''}
                      alt=""
                      style={{ width: "auto", height: "80px", maxWidth: "100%" }}
                    />
                  </TableCell>
                  <TableCell align="justify">{product.category}</TableCell>
                  <TableCell align="justify">
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
