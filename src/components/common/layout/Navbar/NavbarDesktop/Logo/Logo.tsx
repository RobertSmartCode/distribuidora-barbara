import React from 'react';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

const MobileLogo: React.FC = () => {
  const alt = 'Logo Desktop';
  const width = '200px'; // Ancho opcional para el logo móvil
  const height = 'auto'; // Altura opcional para el logo móvil
  const logoUrl = import.meta.env.VITE_LOGO_DESKTOP

  return (
    <Box marginLeft="60px" marginRight="0px" marginTop="0px">
      <Link to="/" style={{ color: "whitesmoke", textDecoration: "none" }}>
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

