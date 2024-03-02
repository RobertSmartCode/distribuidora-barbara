import React, { useState, useEffect } from 'react';
import { ProductsEditDesktopProps } from '../../../../type/type';
import { Box, CssBaseline, Toolbar, Card, Typography, Modal, Paper } from '@mui/material';
import * as Yup from "yup";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, doc, updateDoc, CollectionReference} from "firebase/firestore";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  SelectChangeEvent,
} from "@mui/material";



import { Product,  Image } from '../../../../type/type';
import { getFormattedDate } from '../../../../utils/dateUtils';
import { ErrorMessage } from '../../../../messages/ErrorMessage';
import { productSchema } from '../../../../schema/productSchema';
import { useSelectedItemsContext } from '../../../../context/SelectedItems';


import ImageManager from '../ImageManager';
import { useImagesContext } from "../../../../context/ImagesContext";
import { useCategories } from '../../../../context/CategoriesContext';




const ProductsEditDesktop: React.FC<ProductsEditDesktopProps> = ({ productSelected, setProductSelected, handleClose }) => {
 

  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading] = useState<boolean>(false);
  const {  updateSelectedItems } = useSelectedItemsContext()!;
  const [openModal, setOpenModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");



  useEffect(() => {
    if (productSelected) {
      setIsModalOpen(true);
      setSelectedCategory(productSelected.category || '');
      setSelectedSubcategory(productSelected.subCategory || ''); 

    }
  }, [productSelected]);
  


  

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



const { images, updateImages} = useImagesContext()!;


const [selectedImages, setSelectedImages] = useState<Image[]>([]);



  useEffect(() => {
    if (productSelected) {
    
      // Convierte las URLs en objetos Image y actualiza el estado
    const imageObjects: Image[] = productSelected.images.map((url) => ({ url }));
    setSelectedImages(imageObjects);
      
    }
  }, [productSelected]);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

// Función para manejar la eliminación de imágenes existentes

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  const updatedProduct = productSelected
    ? { ...productSelected, [name]: value }
    : null;

  if (productSelected) {
    setProductSelected(updatedProduct);
  }
};


// Manejador para cambios en el componente Select
const handleSelectChange = (event: SelectChangeEvent<string>) => {
  const { name, value } = event.target;

  const updatedProduct = productSelected
    ? { ...productSelected, [name]: value }
    : null;

  if (productSelected) {
    setProductSelected(updatedProduct);
  }
};

const handleBooleanChange = (name: string, value: boolean) => {
  const updatedProduct = {
    ...productSelected!,
    [name]: value
  };
  setProductSelected(updatedProduct);
};

const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;

  // Actualizar el producto seleccionado
  if (productSelected) {
    const updatedProductSelected = { ...productSelected, category: value, subCategory: '' };
    setProductSelected(updatedProductSelected);
  }

  // Resetear la subcategoría seleccionada al cambiar la categoría
  setSelectedCategory(value);
  setSelectedSubcategory('');
};







const handleSubcategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const { value } = event.target;

  // Actualizar el producto seleccionado
  if (productSelected) {
    const updatedProductSelected = { ...productSelected, subCategory: value };
    setProductSelected(updatedProductSelected);
  }

  // Actualizar la subcategoría seleccionada
  setSelectedSubcategory(value);
};




const [isContentInGrams, setIsContentInGrams] = useState<boolean>(true);

const handleIsContentInGramsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const isChecked = event.target.checked;

  // Actualizar el estado
  setIsContentInGrams(isChecked);

  // Actualizar el objeto según sea necesario
  const updatedProduct = productSelected
    ? { ...productSelected, isContentInGrams: isChecked }
    :  null;

  // Actualizar el estado correspondiente
  if (productSelected) {
    setProductSelected(updatedProduct);
  } 
};


const handleIsContentInMililitersChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  const isChecked = event.target.checked;

  // Actualizar el estado
  setIsContentInGrams(!isChecked);

  // Actualizar el objeto según sea necesario
  const updatedProduct = productSelected
    ? { ...productSelected, isContentInGrams: !isChecked }
    :  null;

  // Actualizar el estado correspondiente
  if (productSelected) {
    setProductSelected(updatedProduct);
  } 
};

  const updateProduct = async (
    collectionRef: CollectionReference,
    productId: string,
    productInfo: Partial<Product>
  ) => {
    try {
      const productDocRef = doc(collectionRef, productId);
      await updateDoc(productDocRef, productInfo);
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

        
      
      // Función para manejar el envío del formulario
      const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
          // Validar el producto, ya sea el nuevo o el editado
          const productToValidate = productSelected;

          if (productToValidate) {
            await productSchema.validate(productToValidate, { abortEarly: false });

            // Calcular el stock acumulado sumando la cantidad actual del producto y las ventas
            const quantities = parseInt(String(productToValidate?.quantities || '0'), 10);
            const salesCount = parseInt(String(productToValidate?.salesCount || '0'), 10);
            const stockAccumulation = quantities + salesCount;

            // Calcular la cantidad agregada
            const previousQuantity = parseInt(String(productToValidate?.stockAccumulation || '0'), 10);
            
            const quantityAdded = quantities  + salesCount - previousQuantity;

            // Verificar si la cantidad agregada es negativa
              if (quantityAdded < 0) {
                // Mostrar mensaje de advertencia y detener el proceso
                 // Mostrar mensaje de advertencia en el modal
                    setWarningMessage(`Están faltando ${Math.abs(quantityAdded)} Productos`);
                    setOpenModal(true);
                  return; // Detener el proceso
              }

           
            // Crear un objeto con la información del producto
            const productInfo = {
              ...productToValidate,
              createdAt: (productToValidate?.createdAt) ?? getFormattedDate(),
              keywords: (productToValidate?.title ?? "").toLowerCase(),
              images: images.map(image => image.url),
              stockAccumulation: stockAccumulation,
              quantityHistory: [
                ...(productToValidate.quantityHistory || []),
                { quantityAdded: quantityAdded, date: getFormattedDate() }
              ]
            };

            const productsCollection = collection(db, "products");

            if (productSelected) {
              // Actualizar el producto existente sin duplicar las imágenes
              await updateProduct(productsCollection, productSelected.id, productInfo);
            }

            // Limpiar el estado y mostrar un mensaje de éxito
            updateImages([]);
            setSnackbarMessage("Producto Modificado con éxito");
            setSnackbarOpen(true);

            setTimeout(() => {
              updateSelectedItems([{ name: 'Mis Productos' }]);
              handleClose();
            }, 1000);
          }
        } catch (error) {
          if (error instanceof Yup.ValidationError) {
            // Manejar errores de validación aquí
            const validationErrors: { [key: string]: string } = {};
            error.inner.forEach((e) => {
              if (e.path) {
                validationErrors[e.path] = e.message;
              }
            });

            // Agregar manejo específico para el error de falta de variantes
            console.error("Errores de validación:", validationErrors);
            setErrors(validationErrors);
            setErrorTimeoutAndClear();
            setSnackbarMessage("Por favor, corrige los errores en el formulario.");
            setSnackbarOpen(true);
          } else {
            // Manejar otros errores aquí
            console.error("Error en handleSubmit:", error);
            setSnackbarMessage("Error al modificar el producto");
            setSnackbarOpen(true);
          }
        }
      };


            // Cuando el usuario elige continuar después de ver el mensaje de advertencia en el modal
            const handleContinue = async () => {
              setOpenModal(false); // Cerrar el modal
            
              // Continuar con el proceso sin detenerlo
              const productToValidate = productSelected;
            
              if (productToValidate) {
                // Calcular el stock acumulado sumando la cantidad actual del producto y las ventas
                const quantities = parseInt(String(productToValidate?.quantities || '0'), 10);
                const salesCount = parseInt(String(productToValidate?.salesCount || '0'), 10);
                const stockAccumulation = quantities + salesCount;
            
                // Calcular la cantidad agregada
                const previousQuantity = parseInt(String(productToValidate?.stockAccumulation || '0'), 10);
                const quantityAdded = quantities + salesCount - previousQuantity;
            
                // Crear un objeto con la información del producto
                const productInfo = {
                  ...productToValidate,
                  createdAt: (productToValidate?.createdAt) ?? getFormattedDate(),
                  keywords: (productToValidate?.title ?? "").toLowerCase(),
                  images: images.map(image => image.url),
                  stockAccumulation: stockAccumulation,
                  quantityHistory: [
                    ...(productToValidate.quantityHistory || []),
                    { quantityAdded: quantityAdded, date: getFormattedDate() }
                  ]
                };
            
                const productsCollection = collection(db, "products");
            
                if (productSelected) {
                  // Actualizar el producto existente sin duplicar las imágenes
                  await updateProduct(productsCollection, productSelected.id, productInfo);
                }
            
                // Limpiar el estado y mostrar un mensaje de éxito
                updateImages([]);
                setSnackbarMessage("Producto Modificado con éxito");
                setSnackbarOpen(true);
            
                setTimeout(() => {
                  updateSelectedItems([{ name: 'Mis Productos' }]);
                  handleClose();
                }, 1000);
              }
            };
            

      


  return (
    <>
      <CssBaseline />

      {/* Fondo blanco y estilos para centrar el contenido */}
      {isModalOpen && (
      <Box
        component="main"
        sx={{
            flexGrow: 1,
            py: 4,
            width: '80%',
            backgroundColor: '#fff', // Fondo semi transparente
            overflowY: 'auto',
            height: '100vh',
            marginLeft: 'auto', // Centrar a la derecha
            marginRight: '20px', // Espaciado en el lado derecho
            justifyContent: 'center', // Centra horizontalmente
            alignItems: 'center', // Centra verticalmente
          }}
          
      >

        <Card
              sx={{
                width: '80%',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto', // Centra el Card dentro del Box
              }}
          >
       <Typography variant="h4" mb={3} style={{ textAlign: 'center'}}>
          Editar Producto
       </Typography>

        {/* Asegúrate de ajustar el contenido según tus necesidades */}
        <Toolbar />
        <form
           onSubmit={handleSubmit}
           style={{
             width: "100%",
             display: "flex",
             flexDirection: "column",
           }}
         >
       
           <Grid container spacing={2} sx={{ textAlign: 'center' }}>
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.title : '' }
                 label="Nombre"
                 name="title"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
               />
               <ErrorMessage
                 messages={
                   errors.title
                     ? Array.isArray(errors.title)
                       ? errors.title
                       : [errors.title]
                     : []
                 }
               />
 
             </Grid>
             <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              value={productSelected ? productSelected.brand : '' }
              label="Marca"
              name="brand"
              onChange={handleChange}
              fullWidth
              sx={{ width: '75%', margin: 'auto' }}
            />
            <ErrorMessage
              messages={
                errors.brand
                  ? Array.isArray(errors.brand)
                    ? errors.brand
                    : [errors.brand]
                  : []
              }
            />
          </Grid>

             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.description : ''}
                 label="Descripción"
                 name="description"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 
               />
               <ErrorMessage
                 messages={
                   errors.description
                     ? Array.isArray(errors.description)
                       ? errors.description
                       : [errors.description]
                     : []
                 }
               />
             </Grid>


                            {/* Categoria y Subcategoría */}
                            <Grid item xs={12} sm={6}>
                                      <TextField
                                        select
                                        variant="outlined"
                                        value={selectedCategory  || ''}
                                        label="Rubro"
                                        name="category"
                                        onChange={handleCategoryChange}
                                        fullWidth
                                        sx={{ width: '75%', margin: 'auto' }}
                                      >
                                        {categories && categories.map((category) => (
                                          <MenuItem key={category.id} value={category.name}>
                                            {category.name}
                                          </MenuItem>
                                        ))}
                                      </TextField>
                                      <ErrorMessage
                                        messages={
                                          errors.category
                                            ? Array.isArray(errors.category)
                                              ? errors.category
                                              : [errors.category]
                                            : []
                                        }
                                      />
                                    </Grid>
                                    {selectedCategory && (
                                      <Grid item xs={12} sm={6}>
                                        <TextField
                                          select
                                          variant="outlined"
                                          value={selectedSubcategory || ''}
                                          label="Categoría"
                                          name="subCategory"
                                          onChange={handleSubcategoryChange}
                                          fullWidth
                                          sx={{ width: '75%', margin: 'auto' }}
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
                                        <ErrorMessage
                                        messages={
                                          errors.subCategory
                                            ? Array.isArray(errors.subCategory)
                                              ? errors.subCategory
                                              : [errors.subCategory]
                                            : []
                                        }
                                      />
                                      </Grid>
                                    )}

                                
                           {/* Categoria y Subcategoría */}

             
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.discount : ''}
                 label="Descuento"
                 type="number"
                 name="discount"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
               />
                <ErrorMessage
                   messages={
                     errors.discount
                       ? Array.isArray(errors.discount)
                         ? errors.discount
                         : [errors.discount]
                       : []
                   }
                 />
             </Grid>
             <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                value={productSelected ? productSelected.unitperpack : ''}
                label="Unidades por Empaque"
                name="unitperpack"
                onChange={handleChange}
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
              />
              <ErrorMessage
                messages={
                  errors.unitperpack
                    ? Array.isArray(errors.unitperpack)
                      ? errors.unitperpack
                      : [errors.unitperpack]
                    : []
                }
              />
            </Grid>
          

         
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined" sx={{ width: '75%', margin: 'auto' }}>
              <InputLabel id="type-label">Tipo</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={productSelected ? productSelected.type || '' : ''}
                label="Tipo"
                onChange={handleSelectChange}
                fullWidth
              >
                <MenuItem value="Bulto">Bulto</MenuItem>
                <MenuItem value="Unidad">Unidad</MenuItem>
              </Select>
            </FormControl>
            <ErrorMessage
                 messages={
                   errors.type
                     ? Array.isArray(errors.type)
                       ? errors.type
                       : [errors.type]
                     : []
                 }
               />
          </Grid>

      
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                label="Precio"
                name="price"
              
                value={productSelected ? productSelected.price : ''}
                onChange={handleChange}
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
              />
                  <ErrorMessage
                    messages={
                      errors.price
                        ? Array.isArray(errors.price)
                          ? errors.price
                          : [errors.price]
                        : []
                    }
                  />
            </Grid>
      
          
  
        


      
            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                label="Cantidad"
                name="quantities"
              
                value={productSelected ? productSelected.quantities: ''}
                onChange={handleChange}
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
              />
                <ErrorMessage
                    messages={
                      errors.quantities
                        ? Array.isArray(errors.quantities)
                          ? errors.quantities
                          : [errors.quantities]
                        : []
                    }
                  />
            </Grid>



            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                label="Código de Barra"
                name="barcode"
                
                value={productSelected ? productSelected.barcode: ''}
                onChange={handleChange}
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
              />
                    <ErrorMessage
                    messages={
                      errors.barcode
                        ? Array.isArray(errors.barcode)
                          ? errors.barcode
                          : [errors.barcode]
                        : []
                    }
                  />
            </Grid>


            <Grid item xs={12} sm={6}>
              <TextField
                type="number"
                variant="outlined"
                label="Contenido por Unidad"
                name="contentPerUnit"    
                value={productSelected ? productSelected.contentPerUnit: ''}   
                onChange={handleChange}
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
              />
                    <ErrorMessage
                    messages={
                      errors.contentPerUnit
                        ? Array.isArray(errors.contentPerUnit)
                          ? errors.contentPerUnit
                          : [errors.contentPerUnit]
                        : []
                    }
                  />
            </Grid>
     
            <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isContentInGrams}
                  onChange={handleIsContentInGramsChange}
                />
              }
              label="¿El contenido es en gramos?"
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={!isContentInGrams}
                  onChange={handleIsContentInMililitersChange}
                />
              }
              label="¿El contenido es en mililitros?"
            />
        </Grid>




        <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              value={productSelected ? productSelected.location : ''}
              label="Ubicación"
              name="location"
              onChange={handleChange}
              fullWidth
              sx={{ width: '75%', margin: 'auto' }}
            />
            <ErrorMessage
              messages={
                errors.location
                  ? Array.isArray(errors.location)
                    ? errors.location
                    : [errors.location]
                  : []
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            label="Producto Destacado"
            name="featured"
            select
            fullWidth
            sx={{ width: '75%', margin: 'auto' }}
            value={productSelected ? (productSelected.featured ? "yes" : "no") : ''}
            onChange={(e) => handleBooleanChange("featured", e.target.value === "yes")}
          >
            <MenuItem value="yes">Sí</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
          </Grid>


          <Grid item xs={12} sm={6}>
          <TextField
            variant="outlined"
            label="En línea"
            name="online"
            select
            fullWidth
            sx={{ width: '75%', margin: 'auto' }}
            value={productSelected ? (productSelected.online ? "yes" : "no") : ''}
            onChange={(e) => handleBooleanChange("online", e.target.value === "yes")}
          >
            <MenuItem value="yes">Sí</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
          </Grid>

          {/*ImageManager */}
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <ImageManager
           initialData={selectedImages}
          />
          </Grid>
          {/*ImageManager*/}

             {/* Botón de crear o modificar*/}
     
                <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {!isLoading && (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      size="large"
                      disabled={isLoading}
                    >
                      {productSelected ? "Modificar" : "Crear"}
                    </Button>
                  )}
                </Grid>
               
           </Grid>
         </form>
         </Card>
         <Modal
                  open={openModal}
                  onClose={() => setOpenModal(false)}
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Paper style={{ background: 'white', padding: '20px', borderRadius: '8px', maxWidth: '500px', textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 2 }}>Advertencia</Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>{warningMessage}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                      <Button variant="contained" onClick={() => setOpenModal(false)}>Cancelar</Button>
                      <Button variant="contained" onClick={handleContinue}>Continuar</Button>
                    </Box>
                  </Paper>
                </Modal>
                
            <Snackbar
                  open={snackbarOpen}
                  autoHideDuration={4000}
                  onClose={() => setSnackbarOpen(false)}
                  message={snackbarMessage}
                  sx={{
                    margin: 'auto',
                    bottom: '20px', // Adjust the position as needed
                    left: '50%',
                    transform: 'translateX(50%)',
                  }}
                />

      </Box>
       )}
    </>
  );
};

export default ProductsEditDesktop;


