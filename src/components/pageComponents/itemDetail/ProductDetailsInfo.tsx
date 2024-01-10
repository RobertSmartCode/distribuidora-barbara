import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import InfoIcon from "@mui/icons-material/Info";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography } from "@mui/material";
import useMediaQuery from '@mui/material/useMediaQuery';
import ProductDetailsShow from "./ProductDetailsShow";

const ProductDetailsInfo: React.FC = () => {

  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const handleCloseDrawer = () => {
    setIsOpen(false);
  };

  // Colores personalizados
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
    marginRight: "2px",
    marginLeft: "0",
    fontSize: "24px",
  };

  const detailsTextStyles = {
    fontSize: "20px",
  };

  return (
    <Box>
      <Box display="flex" alignItems="center">
        <Typography
         variant="subtitle1"
          onClick={toggleDrawer}
          sx={{
            cursor: 'pointer',
          }}
          >
          Detalles del Producto
        </Typography>
        <InfoIcon 
        onClick={toggleDrawer}
        sx={{
          cursor: 'pointer',
        }}
        />
      </Box>

        <Drawer
        anchor="left"
        open={isOpen}
        onClose={handleCloseDrawer}
        sx={{
          display: { xs: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: isMobile ? "100%" : 350, // Ajusta el ancho según sea necesario
            height: "100%",
            zIndex: 1300,
          },
        }}
      >
        <Box sx={topBarStyles}>
          <Typography sx={detailsTextStyles}>Detalles del Producto</Typography>
          <CloseIcon
            aria-label="close"
            onClick={handleCloseDrawer}
            sx={closeButtonStyles}
          />
        </Box>
        <ProductDetailsShow/>
      </Drawer>
    </Box>
  );
};

export default ProductDetailsInfo;
