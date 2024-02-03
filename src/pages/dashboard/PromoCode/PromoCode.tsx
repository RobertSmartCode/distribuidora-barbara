import React, { useState } from 'react';
import { Button, Box, Drawer, Typography, IconButton } from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import PromoCodeForm from "./PromoCodeForm"
import PromoCodeList from "./PromoCodeList"




const PromoCode: React.FC = () => {
  
  const [open, setOpen] = useState<boolean>(false);

  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateCouponClick = () => {
    setShowForm(!showForm);
  };




  const handleBtnClick = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
    
  };

 
  const customColors = {
    primary: {
      main: "#000",
      contrastText: "#000",
    },
    secondary: {
      main: "#fff",
      contrastText: "#fff",
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

  const textStyles = {
    fontSize: "20px",
    color: customColors.secondary.main,
    marginLeft: "24px",
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleBtnClick}
        sx={{
          backgroundColor: customColors.primary.main,
          color: customColors.secondary.contrastText,
          width: '70vw', // 70% del ancho de la ventana
          margin: '0 auto', // Centra horizontalmente
        }}
      >
       Cupones y Ofertas
      </Button>

      <Drawer
        anchor="left"
        open={open}
        onClose={handleClose}
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
          <Typography variant="h6" sx={textStyles}>Configuración de Cupones</Typography>
          <IconButton
            aria-label="close"
            onClick={() => {
              handleClose();
              setShowForm(false); // Agrega esta línea para cerrar el formulario
            }}
            sx={closeButtonStyles}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <div style={{ margin: '0 auto', textAlign: 'center', marginTop:"20px", marginBottom:"20px" }}>
            <Button
            variant="contained"
            color="primary"
            onClick={handleCreateCouponClick}
             >
            {showForm ? 'Cerrar Formulario' : 'Crear Cupón'}
          </Button>
          {showForm && <PromoCodeForm />}
        </div>
       
        <PromoCodeList/>
      </Drawer>
    </Box>
  );
};

export default PromoCode;
