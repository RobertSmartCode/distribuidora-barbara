import React, { useEffect, useState } from 'react';
import { TextField, Button, List, ListItem, ListItemText, Grid, Box, Snackbar, Dialog, DialogContent, DialogActions, Container } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { collection, doc, updateDoc } from 'firebase/firestore';
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


interface CategoryEditProps {
    selectedCategory: Category | null;
    onClose: () => void;
}

const CategoryEdit: React.FC<CategoryEditProps> = ({ selectedCategory, onClose }) => {
 
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [newSubcategory, setNewSubcategory] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedItem, setEditedItem] = useState<Category>({ id: '', name: '', subCategory: [] });
    const [editedSubcategory, setEditedSubcategory] = useState<{ name: string; index: number }>({ name: '', index: 0 });

    const [isEditingCategory, setIsEditingCategory] = useState<boolean>(false);


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
                const categoryDocRef = doc(collectionRef, category.id);

                await updateDoc(categoryDocRef, {
                    name: category.name,
                    subCategory: category.subCategory
                });

                console.log('Category updated successfully with ID: ', category.id);
                onClose()
            }));

            console.log("Todas las categorías actualizadas con éxito en la base de datos");
            setCategories([]);
        } catch (error) {
            console.error('Error updating categories: ', error);
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
            }
        }
    };

    useEffect(() => {
        if (selectedCategory) {
            setCategories([selectedCategory]);
        } else {
            setCategories([]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        console.log("Categoría:", categories)
    }, [selectedCategory]);

    const handleEditCategory = (editedCategory: Category) => {
        setIsEditModalOpen(true);
        setEditedItem(editedCategory);
        setIsEditingCategory(true); 
        setEditedSubcategory({ name: '', index: 0 }); // Reiniciar el estado de la subcategoría
    };
    
    const handleEditSubcategory = (editedSubcategory: string, index: number) => {
        setIsEditModalOpen(true);
        setEditedSubcategory({ name: editedSubcategory, index }); // Actualizar el estado de la subcategoría con el nombre y el índice
        setIsEditingCategory(false); 
    };
    const handleDeleteSubcategory = (categoryId: string, subcategoryIndex: number) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === categoryId
                    ? {
                        ...category,
                        subCategory: category.subCategory.filter((_, index) => index !== subcategoryIndex)
                    }
                    : category
            )
        );
    };
    
    
    const handleSave = () => {
        setIsEditModalOpen(false);
    
        if (isEditingCategory) {
            // Si se está editando una categoría, actualiza la categoría en el estado categories
            const updatedCategories = categories.map(category =>
                category.id === editedItem.id ? editedItem : category
            );
            console.log("Updated categories after editing category:", updatedCategories);
            setCategories(updatedCategories);
        } else {
            const updatedCategories = categories.map(category => {
                // Verifica si estamos editando una subcategoría y si la categoría actual es la que estamos editando
                if (!isEditingCategory ) {
                    // Mapeamos sobre las subcategorías y cambiamos solo la subcategoría en el índice correspondiente
                    const updatedSubCategory = category.subCategory.map((subcat, index) =>
                        index === editedSubcategory.index ? editedSubcategory.name : subcat
                    );
                    console.log("Updated subcategories:", updatedSubCategory);
                    // Retorna la categoría actualizada con la subcategoría modificada
                    return {
                        ...category,
                        subCategory: updatedSubCategory
                    };
                }
                // Retorna las demás categorías sin cambios
                return category;
            });
            console.log("Updated categories after editing subcategory:", updatedCategories);
            setCategories(updatedCategories);
            
        }
    };
    

      
    return (
        <Box
            sx={{
                width: '100%',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto', // Centra el Card dentro del Box
            }}
        >
            {/* Contenido de la categoría */}
            {categories.length === 0 ? (
                <div style={{ width: '100%', maxWidth: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                        style={{ width: '100%', maxWidth: '200px' }}
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
                                    <ListItemText primary={`Rubro: ${category.name}`} />
                                    <Button size="small" onClick={() => handleEditCategory(category)}>
                                        <EditIcon />
                                    </Button>
                                </ListItem>

                                <ListItem>
                                <ul>
                                {category.subCategory.map((subcategory, index) => (
                                    <li key={`${category.id}-${index}`}>
                                        {subcategory}
                                        <Button size="small" onClick={() => handleEditSubcategory(subcategory, index)}>
                                            <EditIcon />
                                        </Button>
                                        <Button size="small" onClick={() => handleDeleteSubcategory(category.id, index)}>
                                            <DeleteIcon />
                                        </Button>
                                    </li>
                                ))}
                            </ul>


                                </ListItem>

                                <ListItem>
                                    <Grid container spacing={2}>
                                        <Grid item xs={9}>
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
                    <div style={{ textAlign: 'center' }}>
                        <Button variant="contained" color="primary" onClick={handleAddCategory}>
                            Actualizar Categoría
                        </Button>
                    </div>

                </div>
            )}

            {/* Modal de edición */}
            <Dialog
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                
                maxWidth={isEditingCategory ? "sm" : "md"} 
            >
                <form onSubmit={handleSave}>
                    <DialogContent>
                        <Container maxWidth="sm">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                <TextField
                                    label="Nombre"
                                    value={isEditingCategory ? editedItem.name : editedSubcategory.name}
                                    onChange={(e) => {
                                        if (isEditingCategory) {
                                            setEditedItem({ ...editedItem, name: e.target.value });
                                        } else {
                                            setEditedSubcategory({ ...editedSubcategory, name: e.target.value });
                                        }
                                    }}
                                    fullWidth
                                    required
                                />


                                </Grid>
                                
                                {/* Agrega campos para otras propiedades si es necesario */}
                            </Grid>
                        </Container>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsEditModalOpen(false)} color="primary">
                            Cancelar
                        </Button>
                        <Button type="button" color="primary" onClick={handleSave}>
                            Guardar Cambios
                        </Button>

                    </DialogActions>
                </form>
                <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={() => setSnackbarOpen(false)} message={snackbarMessage} />
            </Dialog>

            {/* Snackbar para mostrar mensajes de error o éxito */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                sx={{
                    margin: 'auto',
                }}
            />

            {/* Botón de cancelar para cerrar el modal */}
            <Button variant="outlined" color="primary" onClick={onClose} style={{ marginTop: '20px' }}>
                Cancelar
            </Button>
        </Box>
    );
};

export default CategoryEdit;
