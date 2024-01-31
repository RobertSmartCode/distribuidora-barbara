import React, { useContext, useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  SwipeableDrawer,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShopIcon from "@mui/icons-material/Shop";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import { Link, useNavigate } from "react-router-dom";
import { menuItems } from "../../../../../../router/navigation";
import { logout } from "../../../../../../firebase/firebaseConfig";
import { AuthContext } from "../../../../../../context/AuthContext";
import {customColors } from "../../../../../../styles/styles";



interface MobileMenuListProps {
  container?: any;
  Top: string;
}

const MobileMenuList: React.FC<MobileMenuListProps> = ({ container, Top }) => {
  const { logoutContext, isLogged, user } = useContext(AuthContext)!;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolCajero = import.meta.env.VITE_ROL_CASHIER;
  const rolCobrador = import.meta.env.VITE_ROL_COLLECTOR;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutContext();
    navigate("/login");
  };

  return (
    <>
      <IconButton
        color="secondary"
        aria-label="toggle menu"
        edge="start"
        onClick={handleMenuToggle}
      >
        {isMenuOpen ? (
          <CloseIcon sx={{ color: customColors.primary.main }} />
        ) : (
          <MenuIcon sx={{ color: customColors.primary.main }} />
        )}
      </IconButton>

      {isMenuOpen && (
        <SwipeableDrawer
          anchor="left"
          open={isMenuOpen}
          onClose={handleMenuToggle}
          onOpen={() => {}}
          container={container}
          sx={{
            display: { xs: "block" },
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: 411,
              top: Top,
              backgroundColor: customColors.primary.main,
              height: "100%",
              zIndex: 1300,
            },
          }}
        >
          <List>
            {menuItems.map(({ id, path, title, Icon }) => (
              <Link key={id} to={path} onClick={handleMenuToggle}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon sx={{ color: customColors.secondary.contrastText }}>
                      <SvgIcon>
                        <Icon />
                      </SvgIcon>
                    </ListItemIcon>
                    <ListItemText
                      primary={title}
                      primaryTypographyProps={{
                        sx: { color: customColors.secondary.contrastText },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            ))}

            {!isLogged ? (
              <>
                <Link key="login" to="/login" onClick={handleMenuToggle}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <LoginIcon sx={{ color: customColors.secondary.contrastText }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Iniciar sesión"}
                        primaryTypographyProps={{
                          sx: { color: customColors.secondary.contrastText },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>

                <Link key="register" to="/register" onClick={handleMenuToggle}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <LoginIcon sx={{ color: customColors.secondary.contrastText }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Crear Cuenta"}
                        primaryTypographyProps={{
                          sx: { color: customColors.secondary.contrastText },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>
              </>
            ) : null}

            {isLogged && user.rol === rolAdmin && (
              <Link to="/dashboard" onClick={handleMenuToggle}>
                <ListItem disablePadding>
                  <ListItemButton>
                    <ListItemIcon>
                      <DashboardIcon sx={{ color: customColors.secondary.contrastText }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={"Dashboard"}
                      primaryTypographyProps={{
                        sx: { color: customColors.secondary.contrastText },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </Link>
            )}

            {isLogged && user.rol !== rolAdmin && (
              <>
                <Link to="/user-orders" onClick={handleMenuToggle}>
                  <ListItem disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <ShopIcon sx={{ color: customColors.secondary.contrastText }} />
                      </ListItemIcon>
                      <ListItemText
                        primary={"Mis compras"}
                        primaryTypographyProps={{
                          sx: { color: customColors.secondary.contrastText },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                </Link>

                {user.rol === rolCajero && (
                  <Link to="/cashier" onClick={handleMenuToggle}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DashboardIcon sx={{ color: customColors.secondary.contrastText }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={"Caja"}
                          primaryTypographyProps={{
                            sx: { color: customColors.secondary.contrastText },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                )}

                {user.rol === rolCobrador && (
                  <Link to="/collector" onClick={handleMenuToggle}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <DashboardIcon sx={{ color: customColors.secondary.contrastText }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={"Cobrar"}
                          primaryTypographyProps={{
                            sx: { color: customColors.secondary.contrastText },
                          }}
                        />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                )}
              </>
            )}

            {isLogged && (
              <ListItem disablePadding onClick={handleLogout}>
                <ListItemButton>
                  <ListItemIcon>
                    <LogoutIcon sx={{ color: customColors.secondary.contrastText }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={"Cerrar sesión"}
                    primaryTypographyProps={{
                      sx: { color: customColors.secondary.contrastText },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </SwipeableDrawer>
      )}
    </>
  );
};

export default MobileMenuList;
