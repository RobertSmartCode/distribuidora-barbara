
import { Box, Typography, Link } from "@mui/material";

const customColors = {
  primary: {
    main: "#000",
    contrastText: "#000",
  },
  secondary: {
    main: "#fff",
    contrastText: "#fff",
  },
 }

const Banner = () => {
  return (
    <Link href="/shop" style={{ textDecoration: "none" }}>
      <Box
        sx={{
          backgroundColor: customColors.primary.main, // Color de fondo primario
          color: customColors.secondary.main, // Color de letras secundario
          textAlign: "center",
          padding: "20px",
        }}
      >
        <Typography variant="h4">Barbara</Typography>
        <Typography variant="subtitle1">¡Excelencia en Cada Entrega!</Typography>
      </Box>
    </Link>
  );
};

export default Banner;
