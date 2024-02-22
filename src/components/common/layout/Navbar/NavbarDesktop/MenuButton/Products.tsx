import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../../../../context/CategoriesContext';
import Menu from '@mui/material/Menu';
import { Grid, Typography } from '@mui/material';

const Products = () => {
  const { categories } = useCategories() || {};

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuTopPositionRef = useRef<number>(0);
  const menuBottomPositionRef = useRef<number>(0);
  const menuLeftPositionRef = useRef<number>(0);
  const menuRightPositionRef = useRef<number>(0);
  const h3Ref = useRef<HTMLHeadingElement>(null);
  const h3TopPositionRef = useRef<number>(0);
  const h3BottomPositionRef = useRef<number>(0);
  const h3LeftPositionRef = useRef<number>(0);
  const h3RightPositionRef = useRef<number>(0);

  useLayoutEffect(() => {
    const h3Element = h3Ref.current;
    if (h3Element) {
      const rect = h3Element.getBoundingClientRect();
      const { top, bottom, left, right } = rect;
      
      // Calcular las posiciones del h3
      h3TopPositionRef.current = top;
      h3BottomPositionRef.current = bottom;
      h3LeftPositionRef.current = left;
      h3RightPositionRef.current = right;
    }
  }, [h3Ref.current]);

  useLayoutEffect(() => {
    const menuElement = h3Ref.current;
    if (menuElement) {
      const rect = menuElement.getBoundingClientRect();
      const { top, bottom, left, right } = rect;
      
      // Calcular las posiciones del menú
      menuTopPositionRef.current = top;
      menuBottomPositionRef.current = bottom;
      menuLeftPositionRef.current = left;
      menuRightPositionRef.current = right;
    }
  }, [h3Ref.current]);
  

  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const mouseY = event.clientY;
      const mouseX = event.clientX;
  
      // Condición 1: Si X está entre h3RightPositionRef.current y menuRightPositionRef.current
      // y Y está por encima de h3BottomPositionRef.current, cerrar el menú
      if (
        mouseX >= h3RightPositionRef.current &&
        mouseX <= menuRightPositionRef.current &&
        mouseY < h3BottomPositionRef.current
      ) {
        handleMenuClose();
      }
  
      // Condición 2: Si X está entre menuLeftPositionRef.current y h3LeftPositionRef.current
      // y Y está por encima de h3BottomPositionRef.current, cerrar el menú
      if (
        mouseX >= menuLeftPositionRef.current &&
        mouseX <= h3LeftPositionRef.current &&
        mouseY < h3BottomPositionRef.current
      ) {
        handleMenuClose();
      }
  
      // Condición 3: Si Y está por encima de menuTopPositionRef.current, cerrar el menú
      if (menuTopPositionRef.current > mouseY) {
        handleMenuClose();
      }
    };
  
    document.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [
    menuTopPositionRef.current,
    menuBottomPositionRef.current,
    menuLeftPositionRef.current,
    menuRightPositionRef.current,
    h3TopPositionRef.current,
    h3BottomPositionRef.current,
    h3LeftPositionRef.current,
    h3RightPositionRef.current
  ]);
  
  
  
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

  if (!categories) {
    return null;
  }

  return (
    <div onMouseEnter={handleMenuOpen}>
      <h3 style={{ cursor: 'pointer' }} ref={h3Ref} >Productos</h3>

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
          {categories.map(category => (
            <Grid item xs={1} key={category.id}>
              <Typography variant="h6" gutterBottom align="center">
                <Link
                  to={`/${category.name}`}
                  style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                  onClick={handleMenuClose}
                >
                  {category.name}
                </Link>
              </Typography>
              <Grid container spacing={1} justifyContent="center">
                {category.subCategories && category.subCategories.map(subcategory => (
                  <Grid item xs={12} key={subcategory} style={{ textAlign: 'center' }}>
                    <Link
                      to={`/${category.name}/${subcategory}`}
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      onClick={handleMenuClose}
                    >
                      {subcategory}
                    </Link>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Menu>
    </div>
  );
}

export default Products;
