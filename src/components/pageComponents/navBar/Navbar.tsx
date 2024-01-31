import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from '../../common/layout/Navbar/NavbarDesktop/Logo/Logo';
import LoginButton from '../../common/layout/Navbar/NavbarDesktop/LoginButton/LoginButton';


const Navbar: React.FC = () => {


  return (
    <AppBar position="static" sx={{ backgroundColor: '#fff' }}>
       <Toolbar sx={{ justifyContent: 'space-between', marginRight: '5%' }}>
        <Logo />
        <LoginButton />
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
