import React, { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";


import CloseIcon from "@mui/icons-material/Close";
import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import Filter from "./Filter";

import { Grid } from "@mui/material";

import { useFilterContext } from "../../context/FilterContext";
import { useSortContext } from "../../context/SortContext";


const FilterProduct: React.FC = () => {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const { filter } = useFilterContext()!;
  const { sort } = useSortContext()!;

  useEffect(() => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [filter, sort]);


  const toggleDrawer = (open: boolean) => () => {
    setIsDrawerOpen(open);
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
  const topBarStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row", 
    padding: "12px 8px",
    width: "100%",
    margin: "0 auto", 
    backgroundColor: customColors.primary.main,
    color: customColors.secondary.main,
  };

  const closeButtonStyles = {
    color: customColors.secondary.main,
    marginRight: '2px',
    marginLeft: '0',
    fontSize: '24px',
  };


  const searchTextStyles = {
    fontSize: '20px',
    color: customColors.secondary.main,
    marginLeft: '24px',
  };




  return (
    <div style={{ textAlign: 'center' }}>
      {/* Agrega controles para otros filtros (color, categoría, precio, etc.) */}

      <button 
        onClick={toggleDrawer(true)}
        style={{ 
          backgroundColor: customColors.secondary.main,
          color: customColors.primary.main,
          padding: '8px 16px',
          border: `1px solid ${customColors.primary.main}`,
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          marginLeft: '8px',
        }}
      >
        Filtrar
        <TuneIcon style={{ marginLeft: '4px' }} />
      </button>




      <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={toggleDrawer(false)}
      sx={{
        display: { xs: "block" },
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: "100%",
          height: "100%",
          zIndex: 1300,
        },
      }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={searchTextStyles}>Filtros</Typography>
          <IconButton
            aria-label="close"
            onClick={toggleDrawer(false)}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={2} style={{ marginTop: "10px" }}>
          {/* Filtro Responsivo: En pantallas grandes (lg), ocupa la mitad del ancho, en pantallas pequeñas (xs) ocupa todo el ancho */}
          <Grid item xs={12} lg={6}>
            {/* Componente de opciones de clasificación */}
            
          </Grid>
          {/* Agrega aquí otros componentes o elementos según tus necesidades */}
        </Grid>
        <Filter/>
      </Drawer>
    </div>
  );
};

export default FilterProduct;
