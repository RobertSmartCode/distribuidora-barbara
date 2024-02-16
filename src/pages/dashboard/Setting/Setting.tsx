import {useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Grid, Box } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

interface Category {
    id: string;
    name: string;
    subCategory: string[];
}

const Category = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');



    const handleNewCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCategory(e.target.value);
    };

    const handleNewSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSubcategory(e.target.value);
    };

    const handleAddCategory = async () => {
      try {
          const collectionRef = collection(db, "categories");
          await Promise.all(categories.map(async (category) => {
              const newCategoryDocRef = await addDoc(collectionRef, { name: category.name, subCategory: category.subCategory });
              console.log('Category added successfully with ID: ', newCategoryDocRef.id);
          }));
          console.log("Todas las categorías agregadas con éxito a la base de datos");
          setCategories([]);
      } catch (error) {
          console.error('Error adding category: ', error);
      }
  };
  
  const handleAddNewCategory = async () => {
    const categoryId = uuidv4(); // Generar un ID único
    setCategories(prevCategories => [...prevCategories, { id: categoryId, name: newCategory, subCategory: [] }]);
    setNewCategory('');
};

    const handleAddNewSubcategory = async (categoryId: string) => {
        setCategories(prevCategories => prevCategories.map(category =>
            category.id === categoryId ? { ...category, subCategory: [...category.subCategory, newSubcategory] } : category
        ));
        setNewSubcategory('');
    };

    const handleDeleteNewCategory = async (categoryId: string) => {
        setCategories(prevCategories => prevCategories.filter(category => category.id !== categoryId));
    };

    const handleDeleteNewSubcategory = async (categoryId: string, subcategoryId: string) => {
        setCategories(prevCategories => prevCategories.map(category =>
            category.id === categoryId ? { ...category, subCategory: category.subCategory.filter(subcat => subcat !== subcategoryId) } : category
        ));
    };
    return (
      <Box  sx={{
        width: '80%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: 'auto', // Centra el Card dentro del Box
      }}>
          {categories.map((category) => (
              <div key={category.id}>
                  <List>
                      <ListItem>
                          <ListItemText primary={category.name} />
                          <Button size="small" onClick={() => handleDeleteNewCategory(category.id)}>
                              <DeleteForeverIcon />
                          </Button>
                      </ListItem>
  
                      <ListItem>
                          <Grid container spacing={2}>
                              <Grid item xs={4}>
                                  <TextField
                                      label="Subcategory"
                                      value={newSubcategory}
                                      onChange={handleNewSubcategoryChange}
                                  />
                              </Grid>
  
                              <Grid item xs={4}>
                                  <Button size="small" onClick={() => handleAddNewSubcategory(category.id)}>
                                      <AddCircleOutlineIcon />
                                  </Button>
                              </Grid>
                          </Grid>
                      </ListItem>
  
                      <ListItem>
                          <ul>
                              {category.subCategory.map((subcategory, index) => (
                                  <li key={index}>
                                      {subcategory}
                                      <Button size="small" onClick={() => handleDeleteNewSubcategory(category.id, subcategory)}>
                                          <DeleteForeverIcon />
                                      </Button>
                                  </li>
                              ))}
                          </ul>
                      </ListItem>
                  </List>
              </div>
          ))}
  
          <TextField
              variant="outlined"
              label="Category"
              value={newCategory}
              onChange={handleNewCategoryChange}
          />
  
          <Button
              variant="contained"
              color="primary"
              onClick={handleAddNewCategory}
              startIcon={<AddCircleOutlineIcon />}
          >
              Add Category Locally
          </Button>
  
          <Button
              variant="contained"
              color="primary"
              onClick={handleAddCategory}
              startIcon={<AddCircleOutlineIcon />}
          >
              Add Category to Database
          </Button>
      </Box>
  );
  
};

export default Category;
