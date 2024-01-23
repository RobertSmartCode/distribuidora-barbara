import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { db } from "../../../../firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc, CollectionReference} from "firebase/firestore";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  MenuItem,
  Card

} from "@mui/material";



import { Product,  Image, ProductsFormDesktopProps } from '../../../../type/type';
import { getFormattedDate } from '../../../../utils/dateUtils';
import { ErrorMessage } from '../../../../messages/ErrorMessage';
import { productSchema } from '../../../../schema/productSchema';
import { useSelectedItemsContext } from '../../../../context/SelectedItems';
import { useProductVariantsContext } from '../../../../context/ProductVariantsContext'; 

import ImageManager from '../ImageManager';
import { useImagesContext } from "../../../../context/ImagesContext";
import ProductVariants from "./ProductVariants";


const ProductsFormDesktop: React.FC<ProductsFormDesktopProps> = (props) => {
  const { productSelected, setProductSelected  } = props;


  const [isLoading] = useState<boolean>(false);

  const {  updateSelectedItems } = useSelectedItemsContext()!;

  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    title: "",
    brand: "",
    description: "",
    category: "",
    discount: 0,
    unitperpack: 10,
    productVariants: [{
      type: "",
      cost: 0,
      taxes: 0,
      profitMargin: 0,
      price: 0,
      quantities: 0,
      barcode: 0,
      contentPerUnit: 0, 
      isContentInGrams: true,  
    }],
    keywords: "",
    salesCount: "",
    featured: false,
    images: [],
    createdAt: getFormattedDate(),
    online: false,
    location: "",
  });
  



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
  } else {
   
    setSelectedProductVariants([]);
  }
}, [productSelected, newProduct]);


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

// Función para manejar la eliminación de imágenes existentes

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  const updatedProduct = productSelected
    ? { ...productSelected, [name]: value }
    : { ...newProduct, [name]: value };

  if (productSelected) {
    setProductSelected(updatedProduct);
  } else {
    setNewProduct(updatedProduct);
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


  const createProduct = async (
    collectionRef: CollectionReference,
    productInfo: Omit<Product, 'id'>
  ) => {
    try {
      const newDocRef = await addDoc(collectionRef, productInfo);
      console.log("New product ID:", newDocRef.id);
      return newDocRef.id; 
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };
  
  
  
   // Función para manejar el envío del formulario


   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    try {
      // Validar el producto, ya sea el nuevo o el editado
      const productToValidate = productSelected || newProduct;
  
      await productSchema.validate(productToValidate, { abortEarly: false });
  
      if (productVariantOptions.length === 0) {
        setSnackbarMessage('Debe agregar al menos una variante al producto.');
        setSnackbarOpen(true);
        return; // Terminar la función si hay un error
      }

      const convertImagesToStringArray = (images: Image[]): string[] => {
        return images.map(image => image.url);
      };
      
  
      // Crear un objeto con la información del producto
      const productInfo = {
        ...productToValidate,
       
        createdAt: productToValidate.createdAt ?? getFormattedDate(),
        productVariants:productVariantOptions.length > 0 ? [...productVariantOptions] : [],
        keywords: productToValidate.title.toLowerCase(),
        images: convertImagesToStringArray(images),
      };
  
      const productsCollection = collection(db, "products");
  
      if (productSelected) {
        // Actualizar el producto existente sin duplicar las imágenes
        await updateProduct(productsCollection, productSelected.id, productInfo);
      } else {
        // Crear un nuevo producto con las imágenes cargadas
        await createProduct(productsCollection, productInfo);
      }
  
      // Limpiar el estado y mostrar un mensaje de éxito
   
      updateImages([]); 
      setSnackbarMessage("Producto creado/modificado con éxito");
      updateSelectedItems([{ name: 'Mis Productos' }]);
      setSnackbarOpen(true);
  
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
        setSnackbarMessage("Error al crear/modificar el producto");
        setSnackbarOpen(true);
      }
    }
  };

return (
    <>

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
         <form
           onSubmit={handleSubmit}
           
         >
           <Grid container spacing={2} sx={{ textAlign: 'center' }}>
             <Grid item xs={12} sm={6} >
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.title : newProduct.title}
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
             <Grid item xs={12} sm={6} >
            <TextField
              variant="outlined"
              value={productSelected ? productSelected.brand : newProduct.brand}
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
                 value={productSelected ? productSelected.description : newProduct.description}
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
                 value={productSelected ? productSelected.category : newProduct.category}
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
                 value={productSelected ? productSelected.discount : newProduct.discount}
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
                value={productSelected ? productSelected.unitperpack : newProduct.unitperpack}
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
              value={productSelected ? productSelected.location : newProduct.location}
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
             <Grid item xs={12} sm={12}>
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
                 value={productSelected ? productSelected.featured ? "yes" : "no" : newProduct.featured ? "yes" : "no"}
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
              value={productSelected ? productSelected.online ? "yes" : "no" : newProduct.online ? "yes" : "no"}
              onChange={handleChange}
            >
              <MenuItem value="yes">Sí</MenuItem>
              <MenuItem value="no">No</MenuItem>
            </TextField>
          </Grid>

          {/*ImageManager */}
          <Grid item xs={12}>
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

       </>
    
   );
   
 

};

export default ProductsFormDesktop;









