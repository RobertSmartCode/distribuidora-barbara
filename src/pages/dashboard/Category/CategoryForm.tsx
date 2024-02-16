import {useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Grid, Box, Snackbar } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';
import { categorySchema, subcategorySchema } from '../../../schema/productSchema';
import { ErrorMessageCustomizable  } from '../../../messages/ErrorMessage';
import { v4 as uuidv4 } from 'uuid';
import * as Yup from "yup";

interface Category {
    id: string;
    name: string;
    subCategory: string[];
}

const CategoryForm = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

    const clearErrors = () => {
    setErrors({});

    };

    // Función para manejar el tiempo de duración de los errores
    const setErrorTimeoutAndClear = () => {
    if (errorTimeout) {
        clearTimeout(errorTimeout);
    }

    const timeout = setTimeout(clearErrors, 10000); // 5000 milisegundos (5 segundos)
    setErrorTimeout(timeout);
    };

    
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");


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
    try {
      await categorySchema.validate({ category: newCategory }, { abortEarly: false });
      const categoryId = uuidv4(); 
      setCategories(prevCategories => [...prevCategories, { id: categoryId, name: newCategory, subCategory: [] }]);
      setNewCategory('');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
        console.error("Errores de validación:", validationErrors);
        setErrors(validationErrors);
        setErrorTimeoutAndClear();
        setSnackbarMessage("Por favor, corrige los errores en el formulario.");
        setSnackbarOpen(true);
      } else {
        console.error("Error al agregar la categoría:", error);
        // Aquí puedes manejar otros tipos de errores, por ejemplo, mostrar un mensaje de error
      }
    }
  };



  const handleAddNewSubcategory = async (categoryId: string) => {
    try {
      await subcategorySchema.validate({ subCategory: newSubcategory }, { abortEarly: false });
      setCategories(prevCategories => prevCategories.map(category =>
        category.id === categoryId ? { ...category, subCategory: [...category.subCategory, newSubcategory] } : category
      ));
      setNewSubcategory('');
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
        console.error("Errores de validación:", validationErrors);
        setErrors(validationErrors);
        setErrorTimeoutAndClear();
        setSnackbarMessage("Por favor, corrige los errores en el formulario.");
        setSnackbarOpen(true);
      } else {
        console.error("Error al agregar la subcategoría:", error);
        // Aquí puedes manejar otros tipos de errores, por ejemplo, mostrar un mensaje de error
      }
    }
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
          {categories.length === 0 ? (
           <div style={{ width: '100%', maxWidth:"200px", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
           <TextField
             variant="outlined"
             label="Categoría"
             name="category"
             value={newCategory}
             onChange={handleNewCategoryChange}
             style={{ width: '100%', marginBottom: '10px' }}
           />
            <ErrorMessageCustomizable 
                 messages={
                   errors.category
                     ? Array.isArray(errors.category)
                       ? errors.category
                       : [errors.category]
                     : []
                 }
               />
     
           <Button
             variant="contained"
             color="primary"
             onClick={handleAddNewCategory}
             startIcon={<AddCircleOutlineIcon />}
             style={{ width: '100%', maxWidth:"200px" }}
           >
             Agregar
           </Button>
         </div>
          ) : (
            <div>
                 {categories.map((category) => (
                    <div key={category.id}>
                    <List>
                    <ListItem>
                        <ListItemText  primary={`Categoría: ${category.name}`} />
                        <Button size="small" onClick={() => handleDeleteNewCategory(category.id)}>
                        <DeleteForeverIcon />
                        </Button>
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
            
                        <ListItem>
                        <Grid container spacing={2}>
                            <Grid item xs={9}> {/* Cambiado de xs={4} a xs={9} */}
                            <TextField
                                label="Subcategoría"
                                value={newSubcategory}
                                name="subCategory"
                                onChange={handleNewSubcategoryChange}
                                fullWidth  
                            />
                             <ErrorMessageCustomizable 
                                    messages={
                                    errors.subCategory
                                        ? Array.isArray(errors.subCategory)
                                        ? errors.subCategory
                                        : [errors.subCategory]
                                        : []
                                    }
                                />
                            </Grid>

                            <Grid item xs={3} style={{ display: 'flex', alignItems: 'center' }}>
                            <Button size="large" onClick={() => handleAddNewSubcategory(category.id)}>
                                <AddCircleOutlineIcon />
                            </Button>
                            </Grid>

                        </Grid>
                        </ListItem>

                    </List>
                    </div>
                    ))}
                <Button
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
                startIcon={<AddCircleOutlineIcon />}
              >
                Agregar Categoría
              </Button>
            </div>
          )}

                <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={4000}
                  onClose={() => setSnackbarOpen(false)}
                  message={snackbarMessage}
                  sx={{
                    margin: "auto"
                  }}
                />
      
         
        </Box>
      );
      
      
  
};

export default CategoryForm;
