
import {
  AppBar,
  Toolbar,
  CssBaseline,
  Grid,
  Box,
  useMediaQuery
 
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
  const isMediumScreen = useMediaQuery('(max-width:960px)'); // Para pantallas medianas
  const marginTopValue = isMediumScreen ? '32%' : '8%';

  return (
    <>
      <AppBar position="static" color="secondary"  sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999 }}>
      <Toolbar>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3} lg={3}>
            <Logo />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={6} >
            <SearchBar />
          </Grid>
          <Grid item container xs={12} sm={12} md={12} lg={3} justifyContent="flex-end" spacing={5}>
            <Grid item>
              <LoginButton />
            </Grid>
            <Grid item>
              <MobileCart />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>

        
        {/* Estilos en el contenedor de MenuButton */}
        <Box sx={{ height: '30px',
         backgroundColor: '#f0f0f0',
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          elevation: 0
          }}>
          <MenuButton />
        </Box>    
      </AppBar>


      {/* Contenido principal */}
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: "100%",
          minHeight: "100vh",
          px: 2,
          marginTop: marginTopValue,
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



