import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Logo from '../../components/common/layout/Navbar/NavbarDesktop/Logo/Logo';
import LoginButton from '../../components/common/layout/Navbar/NavbarDesktop/LoginButton/LoginButton';
import ProductScanner from '../../pages/cashregister/ProductScanner';

const CashRegister: React.FC = () => {
  return (
<AppBar position="static" sx={{ backgroundColor: '#fff' }}>
  <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Logo />
    </div>
    <div style={{ width: '60%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%' }}>
      <ProductScanner />
    </div>
    <div style={{ width: '20%', display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '5%' }}>
      <LoginButton />
    </div>
  </Toolbar>
</AppBar>

  );
};

export default CashRegister;

