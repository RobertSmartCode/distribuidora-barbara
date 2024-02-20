import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../../../../context/CategoriesContext';
import Menu from '@mui/material/Menu';
import { Box, Grid, Typography } from '@mui/material';

const Products = () => {
  const { categories } = useCategories();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLHeadingElement>) => {
    setAnchorEl(event.currentTarget);
    event.stopPropagation();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuLeave = () => {
    setAnchorEl(null);
  };

  if (!categories) {
    return null;
  }

  return (
    <>
      <Box onMouseLeave={handleMenuLeave}>
        <h3 style={{ cursor: 'pointer' }} onMouseEnter={handleMenuOpen}>Productos</h3>
        
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              width: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              backgroundColor: '#f0f0f0',
              marginLeft: '1%',
              elevation: 0
            }
          }}
          autoFocus={false}
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
      </Box>
    </>
  );
}

export default Products;
