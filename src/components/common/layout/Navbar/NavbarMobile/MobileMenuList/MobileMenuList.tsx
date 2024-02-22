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
import AppsIcon from '@mui/icons-material/Apps';
import ShopIcon from "@mui/icons-material/Shop";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { Link, useNavigate } from "react-router-dom";
import { menuItems } from "../../../../../../router/navigation";
import { logout } from "../../../../../../firebase/firebaseConfig";
import { AuthContext } from "../../../../../../context/AuthContext";
import { useCategories } from '../../../../../../context/CategoriesContext'; 
import {customColors } from "../../../../../../styles/styles";

interface Category {
  id: string;
  name: string;
  subCategories?: string[];
}


interface MobileMenuListProps {
  container?: any;
  Top: string;
}

const MobileMenuList: React.FC<MobileMenuListProps> = ({ container, Top }) => {
  const { logoutContext, isLogged, user } = useContext(AuthContext)!;
  const { categories } = useCategories() || {};
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolCajero = import.meta.env.VITE_ROL_CASHIER;
  const rolCobrador = import.meta.env.VITE_ROL_COLLECTOR;
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const [showCategories, setShowCategories] = useState(false);
  const [showQuestions, setShowQuestions] =  useState(false);
  const [subCategoriesState, setSubCategoriesState] = useState<{ [key: string]: boolean }>({});
  
  const handleMenuToggle = () => {
    setIsMenuOpen((prevIsMenuOpen) => !prevIsMenuOpen);
      setShowCategories(false);
      setShowQuestions(false);
      setSubCategoriesState({});
  
  };
  
  const handleCategoriesToggle = () => {
    setShowCategories((prevShowCategories) => !prevShowCategories);

  };
  
  const handleSubcategoriesToggle = (category: Category) => {
    
    setSubCategoriesState(prevState => ({
      ...prevState,
      [category.id]: !prevState[category.id] 
    }));
  };
  

  const handleQuestionsToggle = () => {
    setShowQuestions((prevShowQuestions) => !prevShowQuestions);

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

            

                    {/* Categorias */}
                    <ListItemButton onClick={handleCategoriesToggle}>
                      <ListItemIcon sx={{ color: customColors.secondary.contrastText }}>
                        <AppsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary="Categorías"
                        primaryTypographyProps={{
                          sx: { color: customColors.secondary.contrastText },
                        }}
                      />
                      {showCategories ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </ListItemButton>

                    {showCategories && (
                      <List>
                      {categories && categories.map((category) => (
                        <div key={category.id}>
                          <ListItemButton onClick={() => handleSubcategoriesToggle(category)} sx={{ paddingLeft: '20%', display: 'flex', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flex: 'none' }}>
                              <ListItemText
                                primary={category.name}
                                primaryTypographyProps={{
                                  sx: { color: customColors.secondary.contrastText },
                                }}
                                style={{ flex: 'none' }}
                              />
                              <ListItemIcon sx={{ color: customColors.secondary.contrastText, marginLeft: 'auto' }}>
                                {subCategoriesState[category.id] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                              </ListItemIcon>
                            </div>
                          </ListItemButton>



                          {subCategoriesState[category.id] && category.subCategories && (
                                <List sx={{ paddingLeft: '40%' }}>
                                  <ListItem disablePadding>
                                    <Link
                                      to={`/${category.name}`}
                                      style={{ textDecoration: 'none', color: 'inherit' }}
                                      onClick={handleMenuToggle}
                                    >
                                      <ListItemText
                                        primary={`Ver todo en ${category.name}`}
                                        primaryTypographyProps={{
                                          sx: { color: customColors.secondary.contrastText },
                                        }}
                                      />
                                    </Link>
                                  </ListItem>
                                  {category.subCategories.map((subcategory: string, index: number) => (
                                    <ListItem key={index} disablePadding>
                                      <Link
                                        to={`/${category.name}/${subcategory}`}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                        onClick={handleMenuToggle}
                                      >
                                        <ListItemText
                                          primary={subcategory}
                                          primaryTypographyProps={{
                                            sx: { color: customColors.secondary.contrastText },
                                          }}
                                        />
                                      </Link>
                                    </ListItem>
                                  ))}
                                </List>
                              )}
                                  </div>
                                ))}
                              </List>
                              )}
                                       {/* Categorias */}

                                     

                                          {/* Preguntas Frecuentes */}
                                          
                                      {/* Preguntas Frecuentes */}
                        <ListItemButton onClick={handleQuestionsToggle}>
                          <ListItemIcon sx={{ color: customColors.secondary.contrastText }}>
                            <HelpOutlineIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary="Preguntas Frecuentes"
                            primaryTypographyProps={{
                              sx: { color: customColors.secondary.contrastText },
                            }}
                          />
                          {showQuestions ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItemButton>

                        {/* Contenido de Preguntas Frecuentes */}
                        {showQuestions && (
                          <List>
                            <Link
                              to="/como-comprar-por-la-web"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={handleMenuToggle}
                            >
                              <ListItemButton>
                                <ListItemText
                                  primary="¿Cómo comprar en la web?"
                                  primaryTypographyProps={{
                                    sx: { color: customColors.secondary.contrastText, fontWeight: 'bold',  paddingLeft: '10%'},
                                  }}
                                />
                             
                              </ListItemButton>
                            </Link>

                            <Link
                              to="/compras-de-forma-presencia"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={handleMenuToggle}
                            >
                              <ListItemButton>
                                <ListItemText
                                  primary="Compras presenciales en el local"
                                  primaryTypographyProps={{
                                    sx: { color: customColors.secondary.contrastText, fontWeight: 'bold', paddingLeft: '10%' },
                                  }}
                                />
                              </ListItemButton>
                            </Link>

                            <Link
                              to="/envio-y-seguimiento"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={handleMenuToggle}
                            >
                              <ListItemButton>
                                <ListItemText
                                  primary="Envíos y seguimiento"
                                  primaryTypographyProps={{
                                    sx: { color: customColors.secondary.contrastText, fontWeight: 'bold', paddingLeft: '10%'},
                                  }}
                                />
                              </ListItemButton>
                            </Link>

                            <Link
                              to="/terminos-y-condiciones"
                              style={{ textDecoration: 'none', color: 'inherit' }}
                              onClick={handleMenuToggle}
                            >
                              <ListItemButton>
                                <ListItemText
                                  primary="Términos y condiciones"
                                  primaryTypographyProps={{
                                    sx: { color: customColors.secondary.contrastText, fontWeight: 'bold', paddingLeft: '10%' },
                                  }}
                                />
                              </ListItemButton>
                            </Link>
                          </List>
                        )}

                                         {/* Preguntas Frecuentes  */}





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
