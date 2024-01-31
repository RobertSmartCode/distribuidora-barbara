import React, { useState, useContext } from 'react';
import Card from '@mui/material/Card';
import { Button, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Product } from '../../../type/type';
import { CartContext } from "../../../context/CartContext";
import { CartItem } from "../../../type/type"


interface SelectionCardProps {
  isOpen: boolean;
  onClose: () => void;
  handleBuyClick: (product: Product) => void;
  product: Product;
  style?: React.CSSProperties;
}

const SelectionCard: React.FC<SelectionCardProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const { addToCart, checkStock } = useContext(CartContext)!;
  const [showError, setShowError] = useState(false);

 

  const handleAddToCart = () => {
    let quantityToAdd = 1;

    // Verifica si hay suficiente stock antes de agregar al carrito
    const hasEnoughStock = checkStock(product);

    if (hasEnoughStock) {
      const cartItem: CartItem = {
        ...product,
        quantity: quantityToAdd,
      };

      addToCart(cartItem);
      onClose()
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 1000);
    }
  };

  return (
    <Card
      sx={{
        position: 'absolute',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        maxWidth: '150px',
      }}
    >
      <Box sx={{ textAlign: 'center', marginTop: 2 }}>
        {showError ? (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <p>No hay stock.</p>
          </div>
        ) : (
          isOpen && product && (
            <div>
               <p>{`${product.type}`}</p>
              {/* Aquí puedes renderizar cualquier información adicional del producto */}
            </div>
          )
        )}

        <Button
          onClick={handleAddToCart}
          variant="contained"
          color="primary"
          size="small"
          style={{ marginBottom: '6px', fontSize: '10px', borderRadius: '20px' }}
        >
          Agregar al carrito
        </Button>

        <IconButton
          aria-label="Cerrar"
          onClick={onClose}
          sx={{
            backgroundColor: '#000', // Fondo negro
            borderRadius: '50%', // Borde redondo
            color: '#fff', // Color del icono (blanco en este caso)
            border: '1px solid #000', // Borde negro
            marginBottom: '5px',
            padding: '4px', // Ajusta el espacio interno
            width: '24px', // Ancho del botón
            height: '24px', // Altura del botón
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Card>
  );
};

export default SelectionCard;
