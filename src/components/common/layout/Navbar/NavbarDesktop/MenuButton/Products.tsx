import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../../../../../context/CategoriesContext';
import Menu from '@mui/material/Menu';
import { Grid, Typography } from '@mui/material';

const Products = () => {
  const { categories } = useCategories();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = (event: React.MouseEvent<HTMLHeadingElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleDrawerClose = () => {
    setAnchorEl(null);
  };

  if (!categories) {
    return null;
  }

  return (
    <>
      {/* Contenido de productos */}
      <h3 style={{ cursor: 'pointer' }} onClick={handleDrawerOpen}>Productos</h3>
      
      {/* Menú desplegable de categorías */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDrawerClose}
        PaperProps={{
          sx: {
            width: '100%',
            maxWidth: '100%',
            maxHeight:"100%",
            backgroundColor: '#f0f0f0',
            marginLeft:"1%",
            elevation: 0
          }
        }}
      >
        <Grid container spacing={2} justifyContent="center" >
          {categories.map(category => (
            <Grid item xs={1} key={category.id}>
              <Typography variant="h6" gutterBottom align="center">
                <Link
                  to={`/${category.name}`}
                  style={{ textDecoration: 'none', color: 'inherit', fontWeight: 'bold' }}
                  onClick={handleDrawerClose} // Aquí cerramos el menú al hacer clic en la categoría
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
                      onClick={handleDrawerClose} // Aquí cerramos el menú al hacer clic en la subcategoría
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
    </>
  );
}

export default Products;
