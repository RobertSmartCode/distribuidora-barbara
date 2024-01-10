import SecurityIcon from "@mui/icons-material/Security";
import { Box, Grid, Typography } from "@mui/material";

const customColors = {
  primary: {
    main: " #8CB369",
    contrastText: " #8CB369",
  },
  secondary: {
    main: "#fff",
    contrastText: "#fff",
  },
};

const BannerSecure: React.FC = () => {
  return (
    <Grid container>
  <Grid item xs={12} lg={12} >
    <Box
       sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center", // Centrar verticalmente
        backgroundColor: customColors.primary.main,
        color: customColors.secondary.main,
        margin: "auto",
        width: "100%", // Ocupar todo el ancho horizontal
        padding: "10px", // Ajustar el espacio interno según sea necesario
      }}
    >
      <Typography sx={{   marginRight: "20px", fontSize: "12px"}}>
        Compra Segura
      </Typography>
      <SecurityIcon
        sx={{
          fontSize: "36px", // Tamaño del icono
          marginRight: "20px", // Espaciado derecho del icono
        }}
      />
      <Typography sx={{  fontSize: "12px" }}>100% Protegida</Typography>
    </Box>
    </Grid>
    </Grid>
  );
};

export default BannerSecure;
