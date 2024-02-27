import React, { useEffect, useState } from 'react';
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Drawer from "@mui/material/Drawer";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Toolbar, Typography } from "@mui/material";

import Search from "./Search"; 
import { useNavigate } from 'react-router-dom';
import { useSearchContext } from "../../../../../../context/SearchContext"; 




const SearchBar: React.FC = () => {


  const {updateSearchKeyword } = useSearchContext()!;
  const [inputValue, setInputValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };


  useEffect(() => {
    
    updateSearchKeyword(inputValue);
  }, [inputValue, updateSearchKeyword]);



  
  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
    navigate('/search');
  };


  const handleCloseClick = () => {
    setInputValue(""); 
    toggleSearch();
  };

  // Colores personalizados
  const customColors = {
    primary: {
      main: '#000',
      contrastText: '#000',
    },
    secondary: {
      main: '#FFFFFF',
      contrastText: '#FFFFFF',
    },
  };

  // Constantes para los estilos
  const containerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
    backgroundColor: customColors.secondary.main,
    
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
    fontSize: "20px",
  };

  const inputStyles = {
    border: `1px solid ${customColors.primary.main}`, // Usando el color personalizado
    background: customColors.secondary.main, // Usando el color personalizado
    padding: "3px",
    borderRadius: "4px 0 0 4px ",
  }

  const buttonStyles = {
    backgroundColor: customColors.primary.main, // Usando el color personalizado
    borderRadius: "0 4px 4px 0",
  };

  
  const iconStyles = {
    color: customColors.secondary.main
  };

  return (
    <Box sx={containerStyles}>

        <IconButton
          sx={{ color: customColors.primary.main }}
          aria-label="search"
          onClick={toggleSearch}
          >
          <SearchIcon />
        </IconButton>

        {isSearchOpen && (
  <Toolbar>
    
      <Drawer
        anchor="right"
        open={isSearchOpen}
        onClose={handleCloseClick}
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
          <Typography sx={searchTextStyles}>Buscar</Typography>
          <IconButton
            aria-label="close"
            onClick={handleCloseClick}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: "16px",
            width: "80%", 
            margin: "0 auto",
          }}
        >
          <InputBase
            placeholder="¿Qué estás buscando?"
            fullWidth
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={inputStyles}
          />
          <IconButton
            aria-label="search"
            onClick={handleSearchClick}
            style={buttonStyles}
          >
            <SearchIcon style={iconStyles} />
          </IconButton>

        </Box>
        <Search toggleSearch={toggleSearch} />

      </Drawer>
      </Toolbar>
)}
      
    </Box>
  );
};

export default SearchBar;
