import React, { useState } from "react";
import { Modal, Typography, Box, Button } from "@mui/material";
import { Product } from "../../../../type/type"; 

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  productSelected: Product | null;
  handleDeleteProduct: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ open, onClose, productSelected, handleDeleteProduct }) => {
  const maxTitleLength = 25;
  const [clickedProduct, setClickedProduct] = useState<string | null>(null);

  const handleTitleClick = (title: string) => {
    setClickedProduct((prevClickedProduct) =>
      prevClickedProduct === title ? null : title
    );
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
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
                cursor: 'pointer', // Cursor tipo "mano" al pasar el mouse
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
            {productSelected.images && productSelected.images[0] && (
              <img
                src={productSelected.images[0]}
                alt={productSelected.title}
                style={{ maxWidth: '100%', maxHeight: '150px', marginTop: '8px' }}
              />
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button variant="contained" color="secondary" onClick={onClose} sx={{ mr: 2 }}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleDeleteProduct}>Eliminar</Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;
