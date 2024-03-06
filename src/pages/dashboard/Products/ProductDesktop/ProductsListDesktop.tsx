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
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const ProductsListDesktop = () => {
  const { products, deleteProduct } = useProductContext(); // Usar el contexto de productos
  const [open, setOpen] = useState<boolean>(false);
  const [productSelected, setProductSelected] = useState<Product | null>(null);
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false); 
  const [detailsModalOpen, setDetailsModalOpen] = useState<boolean>(false); 
  const productsPerPage = 10; 
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  // Calcular el índice inicial y final de los productos a mostrar en la página actual
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Cambiar a la página siguiente
  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  // Cambiar a la página anterior
  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
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

      {currentProducts.length === 0 ? ( // Verifica si el array de productos está vacío
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
                {currentProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell component="th" scope="row" align="justify" style={{ width: 'auto', maxWidth: "100%" }}>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        onClick={() => handleTitleClick(product.description)}
                        sx={{
                          cursor: 'pointer',
                          display: 'block', 
                          maxWidth: '300px',
                          whiteSpace: 'normal', 
                          wordBreak: 'break-all', 
                          textTransform: 'uppercase', 
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
                        setProductSelected(product); 
                        handleDeleteConfirmationOpen(); 
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
          {/* Agregar controles de paginación */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
            <IconButton sx={{ fontSize: '32px', marginRight: '16px' }} onClick={prevPage} disabled={currentPage === 1}>
              <NavigateBeforeIcon />
            </IconButton>
            <Typography variant="body1" sx={{ marginRight: '16px' }}>
              Página {currentPage}
            </Typography>
            <IconButton sx={{ fontSize: '32px' }} onClick={nextPage} disabled={indexOfLastProduct >= products.length}>
              <NavigateNextIcon />
            </IconButton>
          </Box>
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
