import React, { useState } from 'react';
import { Button, Box } from '@mui/material';
import CategoryForm from "./CategoryForm"
import CategoryList from './CategoryList';


const CategoryDesktop: React.FC = () => {
  const [showForm, setShowForm] = useState<boolean>(false);

  const handleCreateCategoryClick = () => {
    setShowForm(!showForm);
  };

  return (
    <Box style={{ textAlign: 'center' }}>
      <div style={{ margin: '0 auto', textAlign: 'center', marginTop: "20px", marginBottom: "20px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleCreateCategoryClick}
        >
          {showForm ? 'Cerrar Formulario' : 'Crear Categoría'}
        </Button>
        {showForm && <CategoryForm />}
      </div>

     <CategoryList/>
    </Box>
  );
};

export default CategoryDesktop;
