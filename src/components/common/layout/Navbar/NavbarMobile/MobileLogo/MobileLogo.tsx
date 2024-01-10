import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const MobileLogo: React.FC = () => {
  const alt = 'Logo móvil'; 
  const width = '50px'; // Ancho opcional para el logo móvil
  const height = 'auto'; // Altura opcional para el logo móvil
  const logoUrl = import.meta.env.VITE_LOGO_MOBILE

  return (
    <Box marginLeft="0px" marginRight="0px">
    <Link to="/" style={{ color: "whitesmoke", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", margin: "0px 0px 0px 0px", padding: "0px" }}>
      <img
        src={logoUrl}
        alt={alt}
        style={{
          width,
          height,
        }}
      />
    </Link>
    </Box>
  );
};

export default MobileLogo;
