
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Box,
  Divider,
} from "@mui/material";
import Logo from "./Logo/Logo";
import SearchBar from "./SearchBar/SearchBar";
import MenuButton from "./MenuButton/MenuButton";
import LoginButton from "./LoginButton/LoginButton";
import { Outlet } from "react-router-dom";
import MobileCart from "../NavbarMobile/MobileCart/MobileCart";
import Notification from "../../../../../notification/Notification";
import WhatsAppLink from "../../../../../whatapp/WhatsAppLink";

const NavbarDesktop = () => {
  return (
    <>
      <CssBaseline />
      <AppBar position="fixed" color="secondary">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid container item lg={12} alignItems="center">
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <Logo />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <SearchBar />
              </Grid>
              <Grid item container xs={12} sm={2} md={2} lg={2} justifyContent="flex-end" spacing={5}>
                <Grid item>
                  <LoginButton />
                </Grid>
                <Grid item>
                  <MobileCart />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>

      {/* Espacio para el Divider y el MenuButton */}
      <Box sx={{ marginTop: '80px' }}> {/* Ajustar el marginTop según sea necesario */}
        <Grid container item lg={12} justifyContent="center">
          <Grid item lg={12}>
            <Divider sx={{ backgroundColor: 'black', height: '0.1px' }} />
          </Grid>
          <Grid item lg={12} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <MenuButton />
          </Grid>
        </Grid>
      </Box>

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
          marginTop: '0px', 
        }}
      >
        <Outlet />
        <Notification />
        <WhatsAppLink/>
      </Box>
    </>
  );
};

export default NavbarDesktop;
