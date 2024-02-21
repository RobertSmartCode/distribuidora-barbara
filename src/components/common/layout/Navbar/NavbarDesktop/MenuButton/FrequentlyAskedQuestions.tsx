import React, { useState, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import { Grid, Typography } from '@mui/material';

const FrequentlyAskedQuestions = () => {
 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuPositionX, setMenuPositionX] = useState<{ left: number | null, right: number | null, top: number | null }>({
    left: null,
    right: null,
    top: null
  });
  const h3Ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const h3Element = h3Ref.current;
    if (h3Element) {
      const rect = h3Element.getBoundingClientRect();
      setMenuPositionX({
        left: rect.left,
        right: rect.right,
        top: rect.top
      });
    }
  }, [h3Ref.current]); 
  
  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (
        menuPositionX.left !== null &&
        menuPositionX.right !== null &&
        menuPositionX.top !== null &&
        (
          event.clientY < menuPositionX.top || // Se verifica si Y está por encima de rect.bottom
          (event.clientX < menuPositionX.left || event.clientX > menuPositionX.right)
        )
      ) {
        handleMenuClose();
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [menuPositionX]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLHeadingElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleMenuMouseLeave = (event: React.MouseEvent<HTMLHeadingElement>) => {
    event.stopPropagation();
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };


  return (
    <div onMouseEnter={handleMenuOpen}>
      <h3 style={{ cursor: 'pointer' }} ref={h3Ref}>Preguntas</h3>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          onMouseLeave: handleMenuMouseLeave,
          sx: {
            width: '100%',
            maxWidth: '100%',
            backgroundColor: '#f0f0f0',
            marginLeft: '1%',
            elevation: 0
          }
        }}
      >
        <Grid container spacing={2} justifyContent="center">
          <Grid item>
            <Typography variant="body1">
              <Link to="/como-comprar-por-la-web" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                CÓMO COMPRAR EN LA WEB
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link to="/compras-de-forma-presencia" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                COMPRAS PRESENCIALES EN EL LOCAL
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link to="/envio-y-seguimiento" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                ENVIOS Y SEGUIMIENTO
              </Link>
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              <Link to="/terminos-y-condiciones" style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}>
                TERMINOS Y CONDICIONES
              </Link>
            </Typography>
          </Grid>
        </Grid>
      </Menu>
    </div>
  );
}

export default FrequentlyAskedQuestions;
