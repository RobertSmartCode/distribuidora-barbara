import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useFilterContext } from "../../context/FilterContext";
import Sort from "./Sort"; 
import useMediaQuery from '@mui/material/useMediaQuery';
import PriceRangeFilter from "./PriceRangeFilter";

const Filter: React.FC = () => {

  const isMobile = useMediaQuery('(max-width:600px)');
  // Lista de colores y tallas

  const colorOptions = ["Azul", "Rojo", "Fuccia", "Nude"];
  const sizeOptions = ["10", "12", "14", "16", "18"];


  const { filter, updateFilter } = useFilterContext()!;
  const [colors, setColors] = useState<{ [key: string]: boolean }>(() => {
    const initialColors: { [key: string]: boolean } = {};
    colorOptions.forEach((color) => {
      initialColors[color] = filter.colors[color] ?? false;
    });
    return initialColors;
  });


  const [sizes, setSizes] = useState<{ [key: string]: boolean }>(() => {
    const initialSizes: { [key: string]: boolean } = {};
    sizeOptions.forEach((size) => {
      initialSizes[size] = filter.sizes[size] ?? false;
    });
    return initialSizes;
  });


  const [tempPriceRange, setTempPriceRange] = useState({
    from: filter.priceRange.from,
    to: filter.priceRange.to,
  });

  useEffect(() => {
    setColors((prevColors) => ({
      ...prevColors,
      ...filter.colors,
    }));
    setSizes((prevSizes) => ({
      ...prevSizes,
      ...filter.sizes,
    }));
  }, [filter.colors, filter.sizes, filter.priceRange]);

  const handleColorChange = (color: string) => {
    updateFilter({ colors: { ...colors, [color]: !colors[color] } });
  };

  const handleSizeChange = (size: string) => {
    updateFilter({ sizes: { ...sizes, [size]: !sizes[size] } });
  };




  const handlePriceChange = (field: string, value: string) => {
    // Actualiza el estado temporal sin cambiar directamente el filtro
    setTempPriceRange((prevPriceRange) => ({
      ...prevPriceRange,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    // Aplica los cambios en el filtro solo al hacer clic en "Aplicar"
    updateFilter({
      priceRange: { ...tempPriceRange },
    });
  };


  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#fff',
      contrastText: '#fff',
    },
  };

  return (
    <div>
      <Sort />


      {isMobile ? (
        // Móvil
        
        <div style={{ marginBottom: "16px", marginTop: "16px", marginLeft: "8px", display: "flex", flexDirection: "row", alignItems: "center" }}>
       
        <h4 style={{ marginRight: "4px" }}>Precio:</h4>
        <TextField
          label="Desde"
          variant="outlined"
          size="small"
          style={{ width: "80px", marginRight: "8px" }}
          value={tempPriceRange.from}
          onChange={(e) => handlePriceChange("from", e.target.value)}
        />
        <TextField
          label="Hasta"
          variant="outlined"
          size="small"
          style={{ width: "80px", marginRight: "8px" }}
          value={tempPriceRange.to}
          onChange={(e) => handlePriceChange("to", e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApplyFilters}
          style={{
            backgroundColor: customColors.primary.main,
            color: customColors.secondary.main,
            fontSize: '12px',  // Tamaño de letra más pequeño
            borderRadius: '12px',  // Bordes redondos
            padding: '8px 16px',  // Ajuste de relleno
          }}
        >
          Aplicar
        </Button>
      </div>
      ) : (
        // Escritorio
        
        <div style={{ marginBottom: "16px", marginTop: "16px", marginLeft: "8px", display: "flex", flexDirection: "column", alignItems: "start" }}>
        <PriceRangeFilter/>
        <h4 style={{ marginBottom: "4px" }}>Precio:</h4>
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginBottom: "10px" }}>
          <TextField
            label="Desde"
            variant="outlined"
            size="small"
            style={{ width: "80px", marginRight: "8px" }}
            value={tempPriceRange.from}
            onChange={(e) => handlePriceChange("from", e.target.value)}
          />
          <TextField
            label="Hasta"
            variant="outlined"
            size="small"
            style={{ width: "80px", marginRight: "8px" }}
            value={tempPriceRange.to}
            onChange={(e) => handlePriceChange("to", e.target.value)}
          />
        </div>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={handleApplyFilters}
          style={{
            backgroundColor: customColors.primary.main,
            color: customColors.secondary.main,
            fontSize: '12px',
            borderRadius: '12px',
            padding: '8px 16px',
          }}
        >
          Aplicar
        </Button>
      </div>

      )}




    
 
      <h4>Colores</h4>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {colorOptions.map((color) => (
          <label
            key={color}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Checkbox
              checked={colors[color]}
              onChange={() => handleColorChange(color)}
            />
            {color}
          </label>
        ))}
      </div>
      <div>
        <h4>Tallas</h4>
        {sizeOptions.map((size) => (
          <div key={size}>
            <label>
              <Checkbox
                checked={sizes[size]}
                onChange={() => handleSizeChange(size)}
              />
              {size}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
