import React, { useState, useEffect, useContext } from 'react';
import Card from '@mui/material/Card';
import { Button, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Product } from '../../../type/type';
import { CartContext } from "../../../context/CartContext";
import {CartItem } from "../../../type/type"


const customColors = {
  primary: {
    main: "#000",
    contrastText: "#000",
  },
  secondary: {
    main: "#FFFFFF",
    contrastText: "#FFFFFF",
  },
};

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

  const [selectedColor, setSelectedColor] = useState<string>("");
  
  const [selectedSize, setSelectedSize] = useState<string>("");

 const [availableSizes, setAvailableSizes] = useState<string[]>();

 const [availableColors, setAvailableColors] = useState<string[]>();
 
 const [showError, setShowError] = useState(false);


 useEffect(() => {
  if (product) {
    const initialAvailableSizes: string[] = product.colors
      ? product.colors
          .find((colorObject: { color: string }) => colorObject.color === colorsArray[0])
          ?.sizes || []
      : [];

    const initialAvailableColors: string[] = product.colors
      ? product.colors.map((colorObject: { color: string }) => colorObject.color) || []
      : [];

    setAvailableSizes(initialAvailableSizes);
    setAvailableColors(initialAvailableColors);

    // Si hay tallas disponibles, seleccionar la primera por defecto
    if (initialAvailableSizes.length > 0) {
      setSelectedSize(initialAvailableSizes[0]);
    }

    // Si hay colores disponibles, seleccionar el primero por defecto
    if (initialAvailableColors.length > 0) {
      setSelectedColor(initialAvailableColors[0]);
    }
  }
}, [product]);



const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const color = event.target.value;
  setSelectedColor(color);
  // Filtrar las tallas disponibles para el color seleccionado
  const selectedColorObject = product?.colors.find((c: any) => c.color === color);
  const availableSizes = selectedColorObject?.sizes || [];

  // Actualizar las tallas disponibles
  setAvailableSizes(availableSizes);

  // Si hay tallas disponibles, seleccionar la primera por defecto
  if (availableSizes.length > 0) {
    setSelectedSize(availableSizes[0]);
  }
};

const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
  const size = event.target.value;
  setSelectedSize(size);
};



const colorsArray: string[] = product?.colors
  ? product.colors.map((colorObject: { color: string }) => colorObject.color)
  : [];


const handleAddToCart = () => {
  
 // Verifica si hay suficiente stock antes de agregar al carrito
  const hasEnoughStock = checkStock(product, selectedColor, selectedSize);

  if (hasEnoughStock) {
    const cartItem: CartItem = {
      ...product,
      quantity: 1,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
    };
    addToCart(cartItem);
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
            {Array.isArray(availableColors) && availableColors.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <label htmlFor="sizeSelect" style={{ fontSize: '12px', fontWeight: 'bold', color: customColors.primary.main }}>
                    Color
                  </label>
                </div>
                <select
                  id="colorSelect"
                  value={selectedColor}
                  onChange={handleColorChange}
                  style={{
                    padding: '10px',
                    border: `1px solid ${customColors.primary.main}`,
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: customColors.secondary.main,
                    color: customColors.primary.main,
                    width: '90%',
                    outline: 'none',
                  }}
                >
                  {product.colors.map((color, index) => (
                    <option style={{ padding: '8px' }} key={index} value={color.color}>
                      {color.color}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {Array.isArray(availableSizes) && availableSizes.length > 0 && (
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <label htmlFor="sizeSelect" style={{ fontSize: '12px', fontWeight: 'bold', color: customColors.primary.main }}>
                    Talle
                  </label>
                </div>

                <select
                  id="sizeSelect"
                  value={selectedSize}
                  onChange={handleSizeChange}
                  style={{
                    padding: '10px',
                    border: `1px solid ${customColors.primary.main}`,
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: customColors.secondary.main,
                    color: customColors.primary.main,
                    width: '90%',
                    outline: 'none',
                   
                  }}
                >
                  {availableSizes.map((size, index) => (
                    <option style={{ padding: '8px' }} key={index} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )
      )}


      <Button
        onClick={() => {
          handleAddToCart();
        }}
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
