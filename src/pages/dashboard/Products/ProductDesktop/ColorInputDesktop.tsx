import React, { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Grid } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useColorsContext } from '../../../../context/ColorsContext'; 

interface ColorInputDesktopProps {
  initialColors?: { color: string; sizes: string[]; quantities: number[] }[];
  updateColors: (newColors: { color: string; sizes: string[]; quantities: number[] }[]) => void;
}

const ColorInputDesktop: React.FC<ColorInputDesktopProps> = ({ initialColors}) => {
  const { colors, updateColors } = useColorsContext()!;
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);


 useEffect(() => {
    // Update local state with initialColors when it changes (for editing)
    if (initialColors) {
      updateColors([...initialColors]);
    }
  }, [initialColors]);


  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddColor = () => {
    if (color) {
      const newColors = [
        ...colors,
        { color, sizes: [], quantities: [] },
      ];
      updateColors(newColors);
      setColor("");
    }
  };

  const handleAddSize = (colorIndex: number) => {
    if (size && quantity > 0) {
      const updatedColors = [...colors];
      updatedColors[colorIndex].sizes.push(size);
      updatedColors[colorIndex].quantities.push(quantity);
      updateColors(updatedColors);
      setSize("");
      setQuantity(1);
    }
  };

  const handleDeleteColor = (colorIndex: number) => {
    const updatedColors = [...colors];
    updatedColors.splice(colorIndex, 1);
    updateColors(updatedColors);
  };

  const handleDeleteSize = (colorIndex: number, sizeIndex: number) => {
    const updatedColors = [...colors];
    updatedColors[colorIndex].sizes.splice(sizeIndex, 1);
    updatedColors[colorIndex].quantities.splice(sizeIndex, 1);
    updateColors(updatedColors);
  };

  return (
    <div style={{ maxHeight: "600px", overflowY: "scroll" }}>
      {colors.map((colorData, index) => (
        <div key={index}>
          <List>
          <ListItem
            sx={{
              paddingLeft: 0,
              marginLeft: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              listStyle: 'none',
            }}
          >
            <ListItemText
              primary={`${colorData.color}`}
              style={{ display: 'flex', alignItems: 'center', listStyle: 'none', paddingLeft: 0, marginLeft: 0 }}
            />
            <Button size="small" onClick={() => handleDeleteColor(index)}  sx={{
              marginLeft: '0px',
              padding: 0, 
              '@media (min-width: 768px)': {
                marginRight: '880px',
              },
            }}>
              <DeleteForeverIcon />
            </Button>
          </ListItem>



            <ListItem style={{ paddingLeft: 0, marginLeft: 0, display: 'flex', alignItems: 'right', listStyle: 'none' }}>
              <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Talla"
                  value={size}
                  onChange={handleSizeChange}
                  sx={{ paddingLeft: 0, marginLeft: 0, listStyle: 'none' }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Cantidad"
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  sx={{ paddingLeft: 0, marginLeft: 0, listStyle: 'none' }}
                />
              </Grid>

                <Grid item xs={4}>
                <Button
                  size="small"
                  onClick={() => handleAddSize(index)}
                  style={{ borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', listStyle: 'none' }}
                >
                  <AddCircleOutlineIcon style={{ marginTop: '9px',  marginRight:"30" }} />
                </Button>
                </Grid>
              </Grid>
            </ListItem>
            
            <ListItem style={{ paddingLeft: 0 }}>
              <ul style={{ color: 'black', listStyle: 'none', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'right', paddingLeft: 0, marginLeft: 0 }}>
                {colorData.sizes && colorData.sizes.map((size, sizeIndex) => (
                  <li key={sizeIndex} style={{ color: 'black', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>{`Talle:${size}, Cantidad: ${colorData.quantities[sizeIndex]}`}</span>
                  <Button
                    size="small"
                    onClick={() => handleDeleteSize(index, sizeIndex)}
                    style={{ padding: 0, marginLeft: '25px', marginTop: '0px' }}
                  >
                    <DeleteForeverIcon />
                  </Button>
                </li>
                
                ))}
              </ul>
            </ListItem>


          </List>
        </div>
      ))}

        <TextField
          variant="outlined"
          label="Color"
          value={color}
          onChange={handleColorChange}
          fullWidth
          sx={{
            width: '75%',
            margin: 'auto',
            '@media (min-width: 768px)': {
              width: '38%',
              marginRight:"10px" 
            },
          }}
        />

        <Button
          variant="contained"
          color="primary"
          onClick={handleAddColor}
          startIcon={<AddCircleOutlineIcon />}
          sx={{
            width: '75%',
            margin: 'auto',
            marginTop: '8px',
            '@media (min-width: 768px)': {
              width: '20%', // Ajusta el ancho para pantallas de escritorio (puedes ajustar el valor según tus necesidades)
            },
          }}
        >
          Agregar Color
        </Button>
        
    </div>
  );
};

export default ColorInputDesktop;
