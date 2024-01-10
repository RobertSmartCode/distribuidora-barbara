import {
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Box,
  Divider,
} from "@mui/material";
// import PromotionBar from "./PromotionBar/PromotionBar";
import Logo from "./Logo/Logo";
import SearchBar from "./SearchBar/SearchBar";
import MenuButton from "./MenuButton/MenuButton";
import LoginButton from "./LoginButton/LoginButton";
import { Outlet } from "react-router-dom";
import MobileCart from "../NavbarMobile/MobileCart/MobileCart";

const NavbarDesktop = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            {/* Parte superior (25% del espacio) */}
            {/* <Grid item xs={12}>
              <PromotionBar />
            </Grid> */}

            <Grid container item lg={12} alignItems="center">
              {/* Logo a la izquierda */}
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <Logo />
              </Grid>

             
              {/* Barra de búsqueda en el centro */}
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {/* Puedes usar el componente SearchBar y ajustar sus estilos según tus necesidades */}
              <SearchBar />
            </Grid>

            {/* Login y Carrito de Compra */}
            <Grid item container xs={12} sm={2} md={2} lg={2} justifyContent="flex-end" spacing={5}>
              <Grid item>
                {/* Ajusta estilos según tus necesidades */}
                <LoginButton />
              </Grid>
              <Grid item>
                {/* Ajusta estilos según tus necesidades */}
                <MobileCart />
              </Grid>
            </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Parte inferior categorías y tienda (25% del espacio) */}
      <Grid container item lg={12} justifyContent="center">
        <Grid item lg={12}>
          <Divider sx={{ backgroundColor: 'black', height: '0.1px' }} />
        </Grid>
        <Grid item lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
          <MenuButton />
        </Grid>
      </Grid>

      {/* Contenedor component="main" para <Outlet /> */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </>
  );
};

export default NavbarDesktop;
