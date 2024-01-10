import React, { useState, useEffect, useRef } from "react";
import { db, uploadFile } from "../../../firebase/firebaseConfig";
import { addDoc, collection, doc, updateDoc, CollectionReference} from "firebase/firestore";
import {
  Button,
  TextField,
  Grid,
  Snackbar,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Container,
  Paper,
  MenuItem

} from "@mui/material";
import * as Yup from "yup";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ColorInput from './ColorInput';
import { useColorsContext } from '../../../context/ColorsContext'; 
import { Product, ColorData, ProductsFormProps } from '../../../type/type';
import { getFormattedDate } from '../../../utils/dateUtils';
import { ErrorMessage } from '../../../messages/ErrorMessage';
import { productSchema } from '../../../schema/productSchema';


const ProductsForm: React.FC<ProductsFormProps> = ({
  handleClose,
  setIsChange,
  productSelected,
  setProductSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isLoading] = useState<boolean>(false);
 
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

  const timeout = setTimeout(clearErrors, 10000); 
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



 // Estado para las imágenes existentes
 const [files, setFiles] = useState<File[]>([]);


 // Estado para las imágenes recién cargadas desde la computadora


  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [uploadMessage, setUploadMessage] = useState<string>("");
  const [selectedImageCount, setSelectedImageCount] = useState<number>(
    productSelected?.images.length || 0
  );

 


  useEffect(() => {
    if (productSelected) {
      setSelectedProductColors(productSelected.colors || []);
      setFiles(productSelected.images.map((imageUrl) => new File([], imageUrl)));
    } else {
      setFiles(newProduct.images.map((imageUrl) => new File([], imageUrl)));
    }
  }, [productSelected, newProduct]);

  

  
  

const normalizeImages = async (imageFiles: File[], existingImageURLs: string[]) => {
  // Filtra las imágenes que ya son URLs de Firebase
  const firebaseImages = existingImageURLs.filter((url) =>
  url.startsWith('https://firebasestorage.googleapis.com'));

  // Filtra las imágenes que son blob URLs (temporales)
  const localImages = imageFiles.filter((file) =>
   URL.createObjectURL(file).startsWith('blob:'));

  // Sube las imágenes locales a Firebase y obtén sus URLs
  const uploadedLocalImages = await Promise.all(localImages.map(async (file) => {
    // Asume que uploadFile es una función que sube el archivo a Firebase
    const url = await uploadFile(file); 
    return url;
  }));

  // Combina todas las URLs
  const normalizedImages = [...firebaseImages, ...uploadedLocalImages];

  return normalizedImages;
};

// Uso en tu función handleImageChange
const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const selectedFiles = Array.from(e.target.files);
   

    if (
      selectedFiles.length + selectedImageCount <= 8 &&
      selectedFiles.length + selectedImageCount >= 1
    ) {
      const updatedFiles = [...files, ...selectedFiles];
      

      setFiles(updatedFiles);

      setSelectedImageCount(selectedImageCount + selectedFiles.length);
      setUploadMessage("");

      if (productSelected) {
        normalizeImages(selectedFiles, productSelected.images)
          .then((normalizedImages) => {
            const updatedProductSelected = {
              ...productSelected,
              images: normalizedImages,
            };
            console.log("Updated Product Selected:", updatedProductSelected);
            setProductSelected(updatedProductSelected);
          })
          .catch((error) => {
            console.error("Error al normalizar las imágenes:", error);
            setUploadMessage("Error al cargar las imágenes");
          });
      }
    } else {
      setUploadMessage(
        "Llegaste al límite de fotos permitido (mínimo 1, máximo 8)."
      );
    }
  }
};

  

// Función para manejar la eliminación de imágenes existentes

const handleRemoveImage = (index: number) => {
  const updatedFiles = [...files];
  updatedFiles.splice(index, 1);
  setFiles(updatedFiles);

  if (productSelected) {
    const updatedProductSelected = {
      ...productSelected,
      images: [
        ...productSelected.images.slice(0, index),
        ...productSelected.images.slice(index + 1),
      ],
    };
    setProductSelected(updatedProductSelected);

    // Después de eliminar la imagen, actualiza el contador
    setSelectedImageCount(updatedProductSelected.images.length);
    setUploadMessage("");
  } else {
    setSelectedImageCount(updatedFiles.length);
    setUploadMessage("");
  }
};

  

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  // Lógica para otros campos
  if (productSelected) {
    setProductSelected({
      ...productSelected,
      [name]: value,
      // Actualizar automáticamente las palabras clave si el campo modificado es el título
      keywords: name === 'title' ? value.toLowerCase() : productSelected.keywords,
    });
  } else {
    setNewProduct({
      ...newProduct,
      [name]: value,
      // Actualizar automáticamente las palabras clave si el campo modificado es el título
      keywords: name === 'title' ? value.toLowerCase() : newProduct.keywords,
    });
  }
};



  // Función para subir las imágenes al servidor y obtener las URL
  const uploadImages = async () => {
    const uploadedImages = [];
  
    for (const file of files) {
      setUploadMessage("Cargando el producto...");
      const url = await uploadFile(file);
      uploadedImages.push(url);
    }
  
    setUploadMessage("");
    return uploadedImages;
  };

  const createProduct = async (
    collectionRef: CollectionReference,
    productInfo: Product
  ) => {
    try {
      const { ...productDataWithoutId } = productInfo;
      await addDoc(collectionRef, productDataWithoutId);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
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

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
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
      setSnackbarMessage("Por favor, corrige los errores en el formulario.");
      setSnackbarOpen(true);
      setErrorTimeoutAndClear();
      return;
    }
       
       
    
      // Subir las imágenes y obtener las URLs
      const uploadedImages = await uploadImages();
  
      // Crear un objeto con la información del producto
      const productInfo = {
        ...productToValidate,
        unit_price: +productToValidate.unit_price,
        createdAt: productToValidate.createdAt ?? getFormattedDate(),
        colors: colors.length > 0 ? [...colors] : [], 
        stock: calculateStock(colors), 
        images: [...uploadedImages],
      };
      
  
      const productsCollection = collection(db, "products");
  
      if (productSelected) {
        // Actualizar el producto existente sin duplicar las imágenes
        productInfo.images = productSelected.images; // Utiliza las imágenes existentes
        await updateProduct(productsCollection, productSelected.id, productInfo);
      } else {
        // Crear un nuevo producto con las imágenes cargadas
        await createProduct(productsCollection, productInfo);
      }
  
      // Limpiar el estado y mostrar un mensaje de éxito
      setFiles([]);
      setSnackbarMessage("Producto creado/modificado con éxito");
      setSnackbarOpen(true);
      setIsChange(true);
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
    <Container 
      maxWidth="xs"
      sx={{
        height: "100vh",
        overflowY: "auto",
        marginLeft: "auto",
        marginRight: "auto", 
        padding: "20px", 
        border: "1px solid #ccc", 
      }}
    >
      <Paper elevation={3} style={{ padding: "20px" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginLeft: "40px", 
            marginRight: "40px",
            gap: "20px",
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
  
            {/* Input Color y Talles */}
            <Grid item xs={12}>
            <ColorInput
              initialColors={selectedProductColors}
              updateColors={updateColors}
            />
            <ErrorMessage errors={colorErrors} />

          </Grid>
            {/* Input Color y Talles */}
  
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
  
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                label="Detalles"
                name="details"
                multiline
                fullWidth
                sx={{ width: '75%', margin: 'auto' }}
                rows={4}
                value={productSelected ? productSelected.details : newProduct.details}
                onChange={handleChange}
              />
            </Grid>
  
            {/* Maneja la carga de las imagenes para Modificar */}
            <Grid item xs={12}>
              <div style={{  maxHeight: "600px", overflowY: "scroll" }}>
                {productSelected ? (
                  productSelected.images.map((imageUrl, index) => (
                    <Card key={index} style={{ maxWidth: 345,  marginRight:60,  borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <CardContent
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <p>{`Vista Previa ${index + 1}`}</p>
                        </CardContent>
                     
                      <CardMedia
                        component="img"
                        height="140"
                        image={imageUrl}
                        alt={`Imagen ${index + 1}`}
                        style={{ objectFit: "contain", justifyContent: 'center' }}
                      />
                        
                      <CardActions
                       style={{
                        marginLeft: 'auto', // Añade esta línea para mover el CardActions a la derecha
                        width: 'fit-content', // Ajusta el ancho según sea necesario
                      }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveImage(index)}
                          
                        >
                           <DeleteForeverIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  ))
                ) : (
                  files.map((file, index) => (
                    <Card key={index} style={{ maxWidth: 345,  marginRight:60,  borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                     <CardContent
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <p>{`Vista Previa ${index + 1}`}</p>
                        </CardContent>
                      <CardMedia
                        component="img"
                        height="140"
                        image={URL.createObjectURL(file)}
                        alt={`Vista Previa ${index + 1}`}
                        style={{ objectFit: "contain", justifyContent: 'center', marginBottom:"20px" }}
                      />
                      
                      <CardActions
                       style={{
                        marginLeft: 'auto', // Añade esta línea para mover el CardActions a la derecha
                        width: 'fit-content', // Ajusta el ancho según sea necesario
                      }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          color="secondary"
                          onClick={() => handleRemoveImage(index)}
                         
                        >
                           <DeleteForeverIcon />
                        </Button>
                      </CardActions>
                    </Card>
                  ))
                )}
              </div>
            </Grid>
  
            {/* Maneja la carga de las imagenes para Crear */}
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={openFileInput}
              >
                Subir foto
              </Button>
              {selectedImageCount >= 1 && selectedImageCount < 8 && (
                <p>Puedes subir otra foto.</p>
              )}
              {selectedImageCount === 8 && (
                <p>Llegaste al máximo de fotos permitido.</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
              <p>{uploadMessage}</p>
            </Grid>
  
            {/* Botón de crear o modificar*/}
            <Grid item xs={12}>
              {!isLoading && (
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={isLoading}
                >
                  {productSelected ? "Modificar" : "Crear"}
                </Button>
              )}
             
            </Grid>
          </Grid>
        </form>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Container>
  );
  



};

export default ProductsForm;
