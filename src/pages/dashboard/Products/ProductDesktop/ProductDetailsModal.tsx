import React from "react";
import { Modal, Typography, Box, Button } from "@mui/material";
import { Product } from "../../../../type/type"; // Asegúrate de importar el tipo correcto aquí

interface ProductDetailsModalProps {
  open: boolean;
  onClose: () => void;
  productSelected: Product | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({ open, onClose, productSelected }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
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
              {productSelected.quantityHistory && productSelected.quantityHistory.map((historyItem, index) => (
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
          <Button variant="contained" color="primary" onClick={onClose}>Cerrar</Button>
        </Box>
      </Box>
    </Modal>
  );
};



export default ProductDetailsModal;
