import React, { useState, useEffect } from "react";
import { db } from "../../../../firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc, CollectionReference} from "firebase/firestore";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  MenuItem

} from "@mui/material";
import * as Yup from "yup";

import { useColorsContext } from '../../../../context/ColorsContext'; 
import { Product, ColorData, Image  } from '../../../../type/type';
import { getFormattedDate } from '../../../../utils/dateUtils';
import { ErrorMessage } from '../../../../messages/ErrorMessage';
import { productSchema } from '../../../../schema/productSchema';
import { useSelectedItemsContext } from '../../../../context/SelectedItems';
import ColorInputDesktop from "./ColorInputDesktop";
import ImageManager from '../ImageManager';
import { useImagesContext } from "../../../../context/ImagesContext";

const ProductsFormDesktop: React.FC= () => {

  const [isLoading] = useState<boolean>(false);

  const {  updateSelectedItems } = useSelectedItemsContext()!;

  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    title: "",
    description: "",
    category: "",
    unit_price: 1000,
    discount: 10,
    stock: 0,
    sizes: [],
    colors: [],
    images: [],
    sku: "",
    keywords: "",
    salesCount: "",
    featured: false,
    createdAt: getFormattedDate(),
    elasticity: "",
    thickness: "",
    breathability: "",
    season: "",
    material: "",
    details: "",
    selectedColor:"", 
    selectedSize: "", 
  });

const [productSelected, setProductSelected] = useState<Product | null>(null);

const [errors, setErrors] = useState<{ [key: string]: string }>({});

const [colorErrors, setColorErrors] = useState<{ [key: string]: string }>({});

const [errorTimeout, setErrorTimeout] = useState<NodeJS.Timeout | null>(null);

const clearErrors = () => {
  setErrors({});
  setColorErrors({}); 
};

// Función para manejar el tiempo de duración de los errores
const setErrorTimeoutAndClear = () => {
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  const timeout = setTimeout(clearErrors, 10000); // 5000 milisegundos (5 segundos)
  setErrorTimeout(timeout);
};


const validateColorsData = (colorsData: ColorData[]) => {
  const newErrors: { [key: string]: string } = {};

  if (!colorsData || colorsData.length === 0) {
    newErrors.colors = "Debe haber al menos un color";
  }

  for (let i = 0; i < colorsData.length; i++) {
    const color = colorsData[i];

    if (!color.color || color.sizes.length === 0 || color.quantities.length === 0) {
      newErrors[`color${i}`] = "Cada color debe tener al menos una talla y una cantidad";
      console.log(newErrors)
    }
  }

  setColorErrors(newErrors);

  return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
};


const { colors, updateColors } = useColorsContext()!;

const { images, updateImages} = useImagesContext()!;


const calculateStock = (colorsData: ColorData[]) => {
  let totalStock = 0;

  colorsData.forEach((colorData) => {
    colorData.quantities.forEach((quantity) => {
      totalStock += quantity;
    });
  });

  return totalStock;
};


const [selectedProductColors, setSelectedProductColors] = useState<{ color: string; sizes: string[]; quantities: number[] }[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
 


  useEffect(() => {
    if (productSelected) {
      setSelectedProductColors(productSelected.colors || []);
    
    } else {
    
    }
  }, [productSelected, newProduct]);



// Función para manejar la eliminación de imágenes existentes

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'keywords') {
      const lowercaseValue = value.toLowerCase();
  
      if (productSelected) {
        setProductSelected({
          ...productSelected,
          [name]: lowercaseValue,
        });
      } else {
        setNewProduct({
          ...newProduct,
          [name]: lowercaseValue,
        });
      }
    } else {
      // Lógica para otros campos
      if (productSelected) {
        setProductSelected({
          ...productSelected,
          [name]: value,
        });
      } else {
        setNewProduct({
          ...newProduct,
          [name]: value,
        });
      }
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
      return newDocRef.id; // Puedes devolver el ID del nuevo documento si es necesario
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
  
      // Validar los datos de colores
      if (!validateColorsData(colors)) {
        throw new Error("Por favor, corrige los errores en el formulario.");
      }

      const convertImagesToStringArray = (images: Image[]): string[] => {
        return images.map(image => image.url);
      };
      
  
      // Crear un objeto con la información del producto
      const productInfo = {
        ...productToValidate,
        unit_price: +productToValidate.unit_price,
        createdAt: productToValidate.createdAt ?? getFormattedDate(),
        colors: colors.length > 0 ? [...colors] : [],
        stock: calculateStock(colors),
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
       
         <form
           onSubmit={handleSubmit}
           style={{
             width: "100%",
             display: "flex",
             flexDirection: "column",
           }}
         >
           <Grid container spacing={2}>
             <Grid item xs={12} sm={6}>
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
                 value={productSelected ? productSelected.unit_price: newProduct.unit_price}
                 label="Precio"
                 name="unit_price"
                 type="number"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
               />
               <ErrorMessage
                 messages={
                   errors.unit_price
                     ? Array.isArray(errors.unit_price)
                       ? errors.unit_price
                       : [errors.unit_price]
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
                 value={productSelected ? productSelected.sku : newProduct.sku}
                 label="SKU"
                 name="sku"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
               />
                 <ErrorMessage
                   messages={
                     errors.sku
                       ? Array.isArray(errors.sku)
                         ? errors.sku
                         : [errors.sku]
                       : []
                   }
                 />
             </Grid>


   
             {/* Input Color y Talles */}
             <Grid item xs={12}>
             <ColorInputDesktop
               initialColors={selectedProductColors}
               updateColors={updateColors}
             />
             <ErrorMessage errors={colorErrors} />
 
           </Grid>
             {/* Input Color y Talles */}
   

             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 value={productSelected ? productSelected.salesCount: newProduct.salesCount}
                 label="Cantidad de ventas"
                 type="number"
                 name="salesCount"
                 onChange={handleChange}
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
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
                 label="Elasticidad"
                 name="elasticity"
                 select
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.elasticity : newProduct.elasticity}
                 onChange={handleChange}
               >
                 <MenuItem value="alta">Alta</MenuItem>
                 <MenuItem value="moderado">Moderado</MenuItem>
                 <MenuItem value="nula">Nula/Casi Nula</MenuItem>
               </TextField>
             </Grid>
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 label="Espesor"
                 name="thickness"
                 select
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.thickness : newProduct.thickness}
                 onChange={handleChange}
               >
                 <MenuItem value="grueso">Grueso</MenuItem>
                 <MenuItem value="moderado">Moderado</MenuItem>
                 <MenuItem value="fino">Fino</MenuItem>
               </TextField>
             </Grid>
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 label="Transpirabilidad"
                 name="breathability"
                 select
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.breathability : newProduct.breathability}
                 onChange={handleChange}
               >
                 <MenuItem value="alta">Alta</MenuItem>
                 <MenuItem value="moderado">Moderado</MenuItem>
                 <MenuItem value="nula">Nula/Casi Nula</MenuItem>
               </TextField>
             </Grid>
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 label="Temporada"
                 name="season"
                 select
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.season : newProduct.season}
                 onChange={handleChange}
               >
                 <MenuItem value="primavera/otono">Primavera/Otoño</MenuItem>
                 <MenuItem value="verano">Verano</MenuItem>
                 <MenuItem value="invierno">Invierno</MenuItem>
               </TextField>
             </Grid>
             <Grid item xs={12} sm={6}>
               <TextField
                 variant="outlined"
                 label="Materiales"
                 name="material"
                 fullWidth
                 sx={{ width: '75%', margin: 'auto' }}
                 value={productSelected ? productSelected.material : newProduct.material}
                 onChange={handleChange}
               />
             </Grid>
             <Grid item xs={12} sm={12}>
               <TextField
                 variant="outlined"
                 label="Detalles"
                 name="details"
                 multiline
                 fullWidth
                 sx={{ width: '88%', margin: 'auto' }}
                 rows={4}
                 value={productSelected ? productSelected.details : newProduct.details}
                 onChange={handleChange}
               />
             </Grid>



                  {/*ImageManager */}
                  <Grid item xs={12}>
                  <ImageManager
                    productSelected={productSelected}
                  />
                    {/* <ErrorMessage errors={colorErrors} /> */}
                  </Grid>
                    {/*ImageManager*/}

             {/* Botón de crear o modificar*/}
             <Grid item xs={12} style={{ textAlign: 'center', marginRight: "200px", marginBottom: "20px" }}>
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
       
       <Snackbar
         open={snackbarOpen}
         autoHideDuration={4000}
         onClose={() => setSnackbarOpen(false)}
         message={snackbarMessage}
       />
       </>
    
   );
   
 

};

export default ProductsFormDesktop;







