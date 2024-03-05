import { useState } from "react";
import { IconButton, Modal, TableBody, TableCell, TableContainer, TableHead, TableRow, Table, Card, Typography, Grid, Button, Tooltip } from "@mui/material";
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

const ProductsListDesktop = () => {
  const { products, deleteProduct } = useProductContext(); // Usar el contexto de productos
  const [open, setOpen] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false); // Estado para controlar la apertura del modal de confirmación
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false); // Estado para controlar la apertura del modal de detalles del producto
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
          <Modal
            open={confirmDeleteOpen}
            onClose={handleDeleteConfirmationClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
          >
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4 }}>
              <Typography id="modal-title" variant="h6" component="h2" align="center">
                ¿Estás seguro que deseas eliminar el producto?
              </Typography>
              {productSelected && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{
                      display: 'block',
                      maxWidth: '500px',
                      whiteSpace: 'normal',
                      wordBreak: 'break-all',
                      textTransform: 'uppercase',
                    }}
                    onClick={() => handleTitleClick(productSelected.description)}
                  >
                    {clickedProduct === productSelected.description
                      ? productSelected.description
                      : productSelected.description.length > maxTitleLength
                        ? productSelected.description.substring(0, maxTitleLength) + "..."
                        : productSelected.description
                    }
                  </Typography>
                  <img src={productSelected.images && productSelected.images[0]} alt="Product" style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '8px' }} />
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button variant="contained" color="secondary" onClick={handleDeleteConfirmationClose} sx={{ mr: 2 }}>Cancelar</Button>
                <Button variant="contained" color="error" onClick={handleDeleteProduct}>Eliminar</Button>
              </Box>
            </Box>
          </Modal>

          {/* Modal de detalles del producto */}
          <Modal
              open={detailsModalOpen}
              onClose={handleDetailsModalClose}
              aria-labelledby="details-modal-title"
              aria-describedby="details-modal-description"
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  bgcolor: 'background.paper',
                  p: 4,
                  maxHeight: '80vh', 
                  overflowY: 'auto', 
                }}
              >
                <Typography id="details-modal-title" variant="h6" component="h2" align="center">
                  Detalles del Producto
                </Typography>
                {productSelected && (
                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Cantidad Disponible: {productSelected.quantities}</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Ventas: {productSelected.salesCount}</Typography>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Historial del Producto:</Typography>
                  <ul>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>Fecha de Creación: {productSelected.createdAt}</Typography>
                    {productSelected && productSelected.quantityHistory && productSelected.quantityHistory.map((historyItem, index) => (
                      <li key={index}>
                        <Typography variant="body2">Fecha: {historyItem.date}</Typography>
                        <Typography variant="body2" sx={{ color: historyItem.quantityAdded >= 0 ? 'inherit' : 'red' }}>
                          {historyItem.quantityAdded >= 0 ? `Cantidad Agregada: ${historyItem.quantityAdded}` : `Stock Faltante: ${-historyItem.quantityAdded}`}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Box>
                
                
                )}
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Button variant="contained" color="primary" onClick={handleDetailsModalClose}>Cerrar</Button>
                </Box>
              </Box>
            </Modal>



        </Card>
      )}
    </Box>
  );
};

export default ProductsListDesktop;
