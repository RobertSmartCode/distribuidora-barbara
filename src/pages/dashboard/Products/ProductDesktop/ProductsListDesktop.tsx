import { useState } from "react";
import { IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Card, Typography, Grid,Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info"; 
import { Box } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import ProductsEditDesktop from "./ProductsEditDesktop";
import { useProductContext } from "../../../../context/ProductContext"; // Importar el contexto de productos
import { Product } from "../../../../type/type";
import SearchByName from "./SearchByName";
import SearchByBarCode from "./SearchByBarCode";
import SearchByCategories from "./SearchByCategories";
import DeleteConfirmationModal from "./DeleteConfirmationModal"; 
import ProductDetailsModal from "./ProductDetailsModal"; 

const ProductsListDesktop = () => {
  const { products, deleteProduct } = useProductContext(); // Usar el contexto de productos
  const [open, setOpen] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false); 
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false); 
  
  const maxTitleLength = 25;

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

  const handleDeleteConfirmationOpen = () => {
    setConfirmDeleteOpen(true);
  };

  const handleDeleteConfirmationClose = () => {
    setConfirmDeleteOpen(false);
  };

  const handleDeleteProduct = () => {
    deleteProduct(productSelected!.id); // Eliminar el producto seleccionado
    setConfirmDeleteOpen(false); // Cerrar el modal de confirmación
  };

  const handleDetailsModalOpen = (product: Product) => {
    setProductSelected(product);
    setDetailsModalOpen(true);
  };

  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
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

      {products.length === 0 ? ( // Verifica si el array de productos está vacío
        <Typography variant="body1" align="center">
          No se encontraron productos.
        </Typography>
      ) : (
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
                        onClick={() => handleTitleClick(product.description)}
                        sx={{
                          cursor: 'pointer',
                          display: 'block', // Muestra el texto como un bloque
                          maxWidth: '300px', // Ancho máximo para el contenedor padre
                          whiteSpace: 'normal', // Permite que el texto fluya y se ajuste automáticamente
                          wordBreak: 'break-all', // Rompe el texto en palabras si no hay suficiente espacio
                          textTransform: 'uppercase', // Convierte el texto a mayúsculas
                        }}
                      >
                        {clickedProduct === product.description
                          ? product.description
                          : product.description.length > maxTitleLength
                            ? product.description.substring(0, maxTitleLength) + "..."
                            : product.description
                      }
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
                      <IconButton onClick={() => {
                        setProductSelected(product); // Establecer el producto seleccionado antes de eliminar
                        handleDeleteConfirmationOpen(); // Abrir modal de confirmación
                      }}>
                        <DeleteForeverIcon color="error" />
                      </IconButton>
                      <Tooltip title="Ver detalles">
                        <IconButton onClick={() => handleDetailsModalOpen(product)}>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
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

          {/* Modal de confirmación de eliminación */}
          <DeleteConfirmationModal
              open={confirmDeleteOpen}
              onClose={handleDeleteConfirmationClose}
              productSelected={productSelected}
              handleDeleteProduct={handleDeleteProduct}
            />

          {/* Modal de detalles del producto */}
          <ProductDetailsModal
            open={detailsModalOpen}
            onClose={handleDetailsModalClose}
            productSelected={productSelected}
          />



        </Card>
      )}
    </Box>
  );
};

export default ProductsListDesktop;





