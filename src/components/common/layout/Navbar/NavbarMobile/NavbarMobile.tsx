import { useRef, useEffect, useState } from "react";
import MobileMenuList from "./MobileMenuList/MobileMenuList";
import MobileLogo from "./MobileLogo/MobileLogo";
import SearchBar from "./SearchBar/SearchBar";
import MobileCart from './MobileCart/MobileCart';
import {customColors} from "../../../../../styles/styles"
import { Outlet } from "react-router-dom";
import Notification from "../../../../../notification/Notification";
import WhatsAppLink from "../../../../../whatapp/WhatsAppLink";

import {
  Toolbar,
  CssBaseline,
  AppBar,
  Box,
} from "@mui/material";


const NavbarMobile = (props:any) => {
  const { window } = props;
  const [appBarHeight, setAppBarHeight] = useState<number | null>(null);
  const appBarRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    // Obtener la altura de la AppBar una vez que esté renderizada
    if (appBarRef.current) {
      
      setAppBarHeight(appBarRef.current.clientHeight);
    }
  }, []);

  const Top = `${appBarHeight || 0}px`
  const container = window !== undefined ? () => window().document.body : undefined;


  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        ref={appBarRef}
        sx={{
          width: "100%",
          zIndex: 3,
          backgroundColor: customColors.secondary.main,
        }}
      >
        <Toolbar
          sx={{
            gap: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {/* Elementos a la izquierda */}
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* Logo de la Empresa */}
            <MobileLogo />
            {/* Campo de búsqueda */}
            <SearchBar />
          </div>

          {/* Elementos a la derecha */}
          <div style={{ display: "flex", alignItems: "center" }}>

            {/* Menú de hamburguesa */}

            <MobileMenuList
             container={container}
             Top={Top}
             />

            {/* Icono del carrito */}
            
            <MobileCart />

          </div>
        </Toolbar>

      </AppBar>

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
        <Notification />
        <WhatsAppLink/>
      </Box>
    </Box>
  );
 
};

export default NavbarMobile;


