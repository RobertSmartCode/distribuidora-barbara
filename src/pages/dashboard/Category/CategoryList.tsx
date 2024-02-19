import React, { useState } from "react";
import { List, ListItem, ListItemText, Button, Dialog, ListItemIcon, ListSubheader, Box, } from '@mui/material';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import EditIcon from "@mui/icons-material/Edit";

import { useCategories } from '../../../context/CategoriesContext';
import CategoryEdit from './CategoryEdit'; 


interface Category {
    id: string;
    name: string;
    subCategory: string[];
}

const CategoryList: React.FC = () => {
  const { categories, deleteCategory } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);

  const handleEditCategory = (category: Category) => {
    // Creamos una copia de la categoría para evitar mutaciones directas
    const selectedCategoryCopy: Category = {
        id: category.id,
        name: category.name,
        subCategory: [...category.subCategory] // Creamos una nueva matriz para las subcategorías
    };

    // Establecemos la categoría seleccionada usando la copia
    setSelectedCategory(selectedCategoryCopy);

    // Abrimos el diálogo de edición
    setOpenEditDialog(true);
};



  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };




  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  return (
    <>
        <Box sx={{ maxWidth: '600px', margin: 'auto' }}> 
              <List>
                  {categories?.map((category) => (
                      <React.Fragment key={category.id}>
                          <ListItem>
                              <ListItemText primary={`Rubro: ${category.name}`} />
                              <Button 
                                  size="small" 
                                  onClick={() => handleEditCategory({ id: category.id, name: category.name, subCategory: category.subCategories })}
                              >
                                  <EditIcon />
                              </Button>
                              <Button size="small" onClick={() => handleDeleteCategory(category.id)}>
                                  <DeleteForeverIcon />
                              </Button>
                          </ListItem>
                          {category.subCategories.length > 0 && (
                              <List>
                                  <ListSubheader sx={{ textAlign: 'left' }}>Categorías</ListSubheader>
                                  {category.subCategories.map((subCategory) => (
                                      <ListItem key={subCategory} sx={{ paddingLeft: '36px' }}>
                                          <ListItemIcon >
                                              <FiberManualRecordIcon />
                                          </ListItemIcon>
                                          <ListItemText primary={subCategory} />
                                      </ListItem>
                                  ))}
                              </List>
                          )}
                      </React.Fragment>
                  ))}
              </List>
          </Box>
    
      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
      
      <CategoryEdit
        selectedCategory={selectedCategory}
        onClose={handleCloseEditDialog}
        />

      </Dialog>
    </>
  );
  
};

export default CategoryList;

