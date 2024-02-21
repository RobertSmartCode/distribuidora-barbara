import React, { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../../../../context/CategoriesContext';
import Menu from '@mui/material/Menu';
import { Grid, Typography } from '@mui/material';

const Products = () => {
  const { categories } = useCategories() || {};

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuTopPositionRef = useRef<number>(0);
  const h3Ref = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const h3Element = h3Ref.current;
    if (h3Element) {
      const rect = h3Element.getBoundingClientRect();
      menuTopPositionRef.current = rect.top;
    }
  }, [h3Ref.current]); 
  
  useLayoutEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (menuTopPositionRef.current > event.clientY) {
        console.log("Cerrar Menú")
        handleMenuClose();
      } else {
        console.log("No Cerrar Menú")
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
  
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [menuTopPositionRef.current]);
  
  
  

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
      <h3 style={{ cursor: 'pointer' }} ref={h3Ref}>Productos</h3>
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
