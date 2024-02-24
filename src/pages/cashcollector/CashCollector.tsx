// CashCollector.tsx
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Navbar from '../../components/pageComponents/navBar/Navbar';
import OrderList from './OrderList';
import CashClosing from './CashClosing';

const CashCollector: React.FC = () => {


  return (
    <>
      <Navbar />
      <CssBaseline />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          width: '100%',
          minHeight: '100vh',
          px: 2,
        }}
      >
        <Toolbar />
        
        <OrderList />
        <CashClosing/>
      </Box>
    </>
  );
};

export default CashCollector;

