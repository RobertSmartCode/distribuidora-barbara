import React, { useState } from 'react';
import { TextField, MenuItem, Grid, Button } from '@mui/material';
import { useCategories } from '../../../../context/CategoriesContext';

const SearchByCategories: React.FC = () => {
  const { categories, setSelectedCategory, setSelectedSubcategory } = useCategories();
  const [selectedCategory, setSelectedCategoryLocal] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategoryLocal] = useState<string>('');

  const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (categories) {
      const selectedCategoryObj = categories.find(category => category.name === value);
      if (selectedCategoryObj) {
        setSelectedCategory(selectedCategoryObj);
        setSelectedCategoryLocal(value);
        setSelectedSubcategory('');
        setSelectedSubcategoryLocal('');
      }
    }
  };

  const handleSubcategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedSubcategory(value);
    setSelectedSubcategoryLocal(value);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedCategoryLocal('');
    setSelectedSubcategory('');
    setSelectedSubcategoryLocal('');
  };

  return (
    <Grid container spacing={2} alignItems="center" justifyContent="center">
      <Grid item xs={12} sm={12}>
        <TextField
          select
          variant="outlined"
          value={selectedCategory}
          label="Categoría"
          name="category"
          onChange={handleCategoryChange}
          fullWidth
          sx={{ mx: 'auto', width: '80%', display: 'block' }}
        >
          {categories && categories.map((category) => (
            <MenuItem key={category.id} value={category.name}>
              {category.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {selectedCategory && (
        <Grid item xs={12} sm={12}>
          <TextField
            select
            variant="outlined"
            value={selectedSubcategory}
            label="Subcategoría"
            name="subCategory"
            onChange={handleSubcategoryChange}
            fullWidth
            sx={{ mx: 'auto', width: '80%', display: 'block' }}
          >
            {categories &&
              categories
                .find((category) => category.name === selectedCategory)
                ?.subCategories.map((subCategory: string) => (
                  <MenuItem key={subCategory} value={subCategory}>
                    {subCategory}
                  </MenuItem>
                ))}
          </TextField>
        </Grid>
      )}
      <Grid item xs={12} sm={12} style={{ textAlign: 'center' }}>
        <Button variant="outlined" onClick={handleReset}>Restablecer Categorias</Button>
      </Grid>
    </Grid>
  );
};

export default SearchByCategories;
