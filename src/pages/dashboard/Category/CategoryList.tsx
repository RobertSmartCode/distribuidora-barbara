import React, { useState } from "react";
import { List, ListItem, ListItemText, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from '@mui/material';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import { useCategories } from '../../../context/CategoriesContext';
import CategoryEdit from './CategoryEdit'; 

const CategoryList: React.FC = () => {
  const { categories, editCategory, deleteCategory, editSubCategory, deleteSubCategory } = useCategories();
  const [editCategoryId, setEditCategoryId] = useState<string>('');
  const [editCategoryName, setEditCategoryName] = useState<string>('');
  const [editSubCategoryId, setEditSubCategoryId] = useState<string>('');
  const [editSubCategoryName, setEditSubCategoryName] = useState<string>('');
  const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);
  const [isEditingSubCategory, setIsEditingSubCategory] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<{ id: string; subCategories: string[] } | null>(null);


  const handleEditCategory = (categoryId: string, categoryName: string) => {
    setEditCategoryId(categoryId);
    setEditCategoryName(categoryName);
    setSelectedCategory({ id: categoryId, subCategories: [] });
    setIsEditingCategory(true);
  };

  const handleSaveEdit = () => {
    if (isEditingCategory) {
      editCategory(editCategoryId, editCategoryName);
    } else {
      editSubCategory(editCategoryId, editSubCategoryId, editSubCategoryName);
    }
    setIsEditingCategory(false);
    setIsEditingSubCategory(false);
    setEditCategoryId('');
    setEditCategoryName('');
    setEditSubCategoryId('');
    setEditSubCategoryName('');
  };

  const handleCancelEdit = () => {
    setIsEditingCategory(false);
    setIsEditingSubCategory(false);
    setEditCategoryId('');
    setEditCategoryName('');
    setEditSubCategoryId('');
    setEditSubCategoryName('');
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    deleteSubCategory(categoryId, subCategoryId);
  };

  const handleEditSubCategory = (categoryId: string, subCategoryId: string, subCategoryName: string) => {
    setEditCategoryId(categoryId);
    setEditSubCategoryId(subCategoryId);
    setEditSubCategoryName(subCategoryName);
    setIsEditingSubCategory(true);
  };


  return (
    <>
      <List>
        {categories?.map((category) => (
          <React.Fragment key={category.id}>
            <ListItem>
              <ListItemText primary={`Categoría: ${category.name}`} />
              <Button size="small" onClick={() => handleEditCategory(category.id, category.name)}>
                <EditIcon />
              </Button>
              <Button size="small" onClick={() => handleDeleteCategory(category.id)}>
                <DeleteForeverIcon />
              </Button>
            </ListItem>
            {category.subCategories.length > 0 && (
              <List>
                {category.subCategories.map((subCategory) => (
                  <ListItem key={subCategory}>
                    <ListItemText primary={subCategory} />
                    <Button size="small" onClick={() => handleEditSubCategory(category.id, subCategory, subCategory)}>
                      <EditIcon />
                    </Button>
                    <Button size="small" onClick={() => handleDeleteSubCategory(category.id, subCategory)}>
                      <DeleteForeverIcon />
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
      <Dialog open={isEditingCategory || isEditingSubCategory} onClose={handleCancelEdit}>
        <DialogTitle>{isEditingCategory ? 'Editar Categoría' : 'Editar Subcategoría'}</DialogTitle>
        <DialogContent>
          <TextField
            label={isEditingCategory ? 'Nombre de la Categoría' : 'Nombre de la Subcategoría'}
            value={isEditingCategory ? editCategoryName : editSubCategoryName}
            onChange={(e) => isEditingCategory ? setEditCategoryName(e.target.value) : setEditSubCategoryName(e.target.value)}
            fullWidth
          />
          {isEditingCategory && (
            <List>
              <Typography variant="subtitle1">Subcategorías:</Typography>
              {selectedCategory?.subCategories.map((subCategory) => (
                <ListItem key={subCategory}>
                  <ListItemText primary={subCategory} />
                  <Button size="small" onClick={() => handleEditSubCategory(selectedCategory.id, subCategory, subCategory)}>
                    <EditIcon />
                  </Button>
                  <Button size="small" onClick={() => handleDeleteSubCategory(selectedCategory.id, subCategory)}>
                    <DeleteForeverIcon />
                  </Button>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Guardar
          </Button>
          <Button onClick={handleCancelEdit} variant="outlined" color="primary">
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
  
};

export default CategoryList;
