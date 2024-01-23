import React, { useState, useEffect } from 'react';
import { ProductsEditDesktopProps } from '../../../../type/type';
import { Box, CssBaseline, Toolbar, Card, Typography } from '@mui/material';
import * as Yup from "yup";
import { db } from "../../../../firebase/firebaseConfig";
import { collection, doc, updateDoc, CollectionReference} from "firebase/firestore";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  MenuItem

} from "@mui/material";



import { Product,  Image } from '../../../../type/type';
import { getFormattedDate } from '../../../../utils/dateUtils';
import { ErrorMessage } from '../../../../messages/ErrorMessage';
import { productSchema } from '../../../../schema/productSchema';
import { useSelectedItemsContext } from '../../../../context/SelectedItems';
import { useProductVariantsContext } from '../../../../context/ProductVariantsContext'; 

import ImageManager from '../ImageManager';
import { useImagesContext } from "../../../../context/ImagesContext";
import ProductVariants from "./ProductVariants";




const ProductsEditDesktop: React.FC<ProductsEditDesktopProps> = ({ productSelected, setProductSelected, handleClose }) => {
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [isLoading] = useState<boolean>(false);

  const {  updateSelectedItems } = useSelectedItemsContext()!;


  useEffect(() => {
    // Abre el modal cuando productSelected está presente
    if (productSelected) {
      setIsModalOpen(true);
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

const { productVariantOptions } = useProductVariantsContext()!;

const { images, updateImages} = useImagesContext()!;


const [selectedImages, setSelectedImages] = useState<Image[]>([]);

const [selectedProductVariants, setSelectedProductVariants] = useState<{ 
    type: string; 
    cost: number; 
    taxes: number; 
    profitMargin: number; 
    price: number; 
    quantities: number;
    barcode: number;
    contentPerUnit: number;  
    isContentInGrams: boolean;
    
     }[]>([]);
   
  useEffect(() => {
    if (productSelected) {
     
      setSelectedProductVariants(productSelected.productVariants || []);

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
      : null;  // Asegúrate de ajustar esta parte según tus necesidades
  
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
      const productToValidate = productSelected ;
  
      await productSchema.validate(productToValidate, { abortEarly: false });
  
      if (productVariantOptions.length === 0) {
        setSnackbarMessage('Debe agregar al menos una variante al producto.');
        setSnackbarOpen(true);
        return; // Terminar la función si hay un error
      }

    
  
      // Crear un objeto con la información del producto
      const productInfo = {
        ...productToValidate,
       
        createdAt: (productToValidate?.createdAt) ?? getFormattedDate(),
        productVariants: productVariantOptions.length > 0 ? [...productVariantOptions] : [],
        keywords: (productToValidate?.title ?? "").toLowerCase(),
        images: images.map(image => image.url),
        
      };
  
      const productsCollection = collection(db, "products");
  
      if (productSelected) {
        // Actualizar el producto existente sin duplicar las imágenes
        await updateProduct(productsCollection, productSelected.id, productInfo);
      }
  
      // Limpiar el estado y mostrar un mensaje de éxito
   
      updateImages([]); 
      setSnackbarMessage("Producto Modificado con éxito");
      updateSelectedItems([{ name: 'Mis Productos' }]);
      setSnackbarOpen(true);
      handleClose();
  
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
        setSnackbarMessage("Modificar el producto");
        setSnackbarOpen(true);
      }
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
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.category : '' }
                 label="Categoría"
                 name="category"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
               />
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

             {/* ProductVariants */}
             
             <Grid item xs={12}>
                <ProductVariants
                  initialData={selectedProductVariants}
                />
              </Grid>

        
             {/*ProductVariants*/}
   
   
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 label="Producto Destacado"
                 name="featured"
                 select
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.featured ? "yes" : "no" : ''}
                 onChange={handleChange}
               >
                 <MenuItem value="yes">Si</MenuItem>
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
              value={productSelected ? productSelected.online ? "yes" : "no" : '' }
              onChange={handleChange}
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
       )}
    </>
  );
};

export default ProductsEditDesktop;


