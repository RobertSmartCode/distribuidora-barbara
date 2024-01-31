import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../../../../context/AuthContext';
import { customColors  } from '../../../../../../styles/styles';
import { logout } from '../../../../../../firebase/firebaseConfig';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShopIcon from '@mui/icons-material/Shop';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box } from '@mui/material';




const LoginButton: React.FC = () => {
  const { logoutContext, isLogged, user } = useContext(AuthContext)!;
  const rolAdmin = import.meta.env.VITE_ROL_ADMIN;
  const rolCajero = import.meta.env.VITE_ROL_CASHIER;
  const rolCobrador = import.meta.env.VITE_ROL_COLLECTOR;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    logoutContext();
    navigate('/login');
    handleClose();
  };



  return (
    <Box>
      <IconButton
        color="primary"
        aria-label="toggle menu"
        edge="start"
        onClick={handleClick}
      >
        <PersonIcon sx={{ fontSize: 46 }} />
      </IconButton>
      <Menu
        id="login-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {isLogged ? (
          user.rol === rolAdmin ? (
            <MenuItem key="dashboard" onClick={() => navigate('/dashboard')}>
              <DashboardIcon sx={{ color: customColors.primary.contrastText }} />
              Dashboard
            </MenuItem>
          ) : user.rol === rolCajero ? (
            <MenuItem key="cashier" onClick={() => navigate('/cashier')}>
              {/* Agrega las opciones específicas para cajeros aquí */}
              <DashboardIcon sx={{ color: customColors.primary.contrastText }} />
              Caja
            </MenuItem>
          ) : user.rol === rolCobrador ? (
            <MenuItem key="cashier" onClick={() => navigate('/collector')}>
              {/* Agrega las opciones específicas para cajeros aquí */}
              <DashboardIcon sx={{ color: customColors.primary.contrastText }} />
              Cobrar
            </MenuItem>
          ) :(
            <MenuItem key="user-orders" onClick={() => navigate('/user-orders')}>
              <ShopIcon sx={{ color: customColors.primary.contrastText }} />
              Mis compras
            </MenuItem>
          )
        ) : (
          [
            <MenuItem key="login" component={Link} to="/login" onClick={handleClose}>
              Iniciar Sesión
            </MenuItem>,
            <MenuItem key="register" component={Link} to="/register" onClick={handleClose}>
              Crear Cuenta
            </MenuItem>
          ]
        )}
        {isLogged && (
          <MenuItem key="logout" onClick={handleLogout}>
            <LogoutIcon sx={{ color: customColors.primary.contrastText }} />
            Cerrar sesión
          </MenuItem>
        )}
      </Menu>
    </Box>
  );
};

export default LoginButton;
