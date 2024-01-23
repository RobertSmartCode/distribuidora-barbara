import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, Card, CardContent, IconButton, Snackbar, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { productVariantsSchema } from '../../../../schema/productSchema';
import { ErrorMessage} from '../../../../messages/ErrorMessage';
import { useProductVariantsContext } from '../../../../context/ProductVariantsContext'; 
import { ProductVariantsProps } from '../../../../type/type';
import * as Yup from "yup";




const ProductVariants: React.FC<ProductVariantsProps> = ({ initialData }) => {


  const { productVariantOptions, updateProductVariantOptions } = useProductVariantsContext()!;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [type, setType] = useState<string>("");
  const [cost, setCost] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(21);
  const [profitMargin, setProfitMargin] = useState<number>(0);
  const [quantities, setQuantities] = useState<number>(0);
  const [barcode, setBarcode] = useState<number>(0);
  const [contentPerUnit, setContentPerUnit] = useState<number>(0);
  const [isContentInGrams, setIsContentInGrams] = useState<boolean>(true);



  const calculatePrice = (cost: number, taxes: number, profitMargin: number): number => {
    const totalPrice = cost + (cost * taxes / 100) + (cost * profitMargin / 100);
    return Math.round(totalPrice); 
  };
  



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


  useEffect(() => {
    // Update local state with initialColors when it changes (for editing)
    if (initialData ) {
      updateProductVariantOptions([...initialData ]);
    }
  }, [initialData]);



  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setType(event.target.value as string || "");
  };
  

  
  const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCost(Number(e.target.value || 0));
  };
  
  const handleTaxesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaxes(Number(e.target.value));
  };
  
  const handleProfitMarginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfitMargin(Number(e.target.value));
  };
  

  const handleQuantitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantities(Number(e.target.value));
  };
  
  const handleBarcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBarcode(Number(e.target.value));
  };

  const handleContentPerUnitChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     
    setContentPerUnit(Number(e.target.value));
  };
  
  const handleIsContentInGramsChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    
    setIsContentInGrams( e.target.checked);
  };

  const handleIsContentInMililitersChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    
    setIsContentInGrams(!e.target.checked);
  };
  
  
  

  const handleAddVariant = async () => {
    // Verifica si los campos requeridos están presentes
    try {
      // Calcula el precio utilizando la función calculatePrice
      const calculatedPrice = calculatePrice(cost, taxes, profitMargin);
  
      // Construye el nuevo objeto en base a los campos disponibles
      const newVariant = [
        
        ...productVariantOptions,
        {
          type,
          cost,
          taxes,
          profitMargin,
          price: calculatedPrice,
          quantities,
          barcode,
          contentPerUnit,
          isContentInGrams  
        }
      ];


      newVariant.forEach((variant, index) => {
        productVariantsSchema.validateSync(variant, {
          abortEarly: false,
          context: { index }, 
        });
      });

      updateProductVariantOptions(newVariant);
      setSnackbarMessage("Variantes de Producto creado con éxito");
      setSnackbarOpen(true);
  
      // Restablece los estados para la siguiente variante
      setType("");
      setCost(0);
      setTaxes(21);
      setProfitMargin(0);
      setQuantities(0);
      setBarcode(0);
      setContentPerUnit(0);
      setIsContentInGrams(true);
  
   
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
    
        setSnackbarMessage("Error al crear/modificar el producto");
        setSnackbarOpen(true);
      }
    }
  };
  

  

  
  const handleDeleteVariant = (index: number) => {
    const updatedVariants = [...productVariantOptions];
    updatedVariants.splice(index, 1);
    updateProductVariantOptions(updatedVariants);
  };



  


  return (
    <div>
      <h2>Variantes del Producto</h2>


      <Grid container spacing={5} sx={{ width: '100%', marginBottom: '30px' }}>
      {productVariantOptions.map((variant, index) => (
        <Grid item xs={12} sm={6} lg={6} key={index}>
          <Card>
            <CardContent>
              <Typography variant="body1">{`Tipo: ${variant.type}`}</Typography>
              <Typography variant="body1">{`Costo: ${variant.cost}`}</Typography>
              <Typography variant="body1">{`Impuestos: ${variant.taxes}%`}</Typography>
              <Typography variant="body1">{`Margen de Ganancia: ${variant.profitMargin}%`}</Typography>
              <Typography variant="body1">{`Precio: ${variant.price}`}</Typography>
              <Typography variant="body1">{`Cantidad: ${variant.quantities}`}</Typography>
              <Typography variant="body1">{`Código de Barras: ${variant.barcode}`}</Typography>

              {variant.isContentInGrams ? (
                <Typography variant="body1">{`Contenido por unidad: ${variant.contentPerUnit} gr`}</Typography>
              ) : (
                <Typography variant="body1">{`Contenido por unidad: ${variant.contentPerUnit} ml`}</Typography>
              )}

              
                <IconButton
                  color="error"
                  aria-label="Eliminar"
                  onClick={() => handleDeleteVariant(index)}
                >
                  <DeleteIcon />
                </IconButton>
             


            </CardContent>
            
          </Card>
        </Grid>
      ))}
    </Grid>


  
      <Grid container spacing={2}>


      <Grid item xs={12} sm={6}>
      <FormControl fullWidth variant="outlined" sx={{ width: '75%', margin: 'auto' }}>
        <InputLabel id="type-label">Tipo</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          name="type"
          value={type}
          label="Tipo"
          onChange={(event) => handleTypeChange(event as React.ChangeEvent<{ value: unknown }>)}
          fullWidth
          disabled={productVariantOptions.some((variant) => variant.type === type)}
        >
          {productVariantOptions.some((variant) => variant.type === 'Bulto') ? null : (
            <MenuItem value="Bulto">Bulto</MenuItem>
          )}
          {productVariantOptions.some((variant) => variant.type === 'Unidad') ? null : (
            <MenuItem value="Unidad">Unidad</MenuItem>
          )}
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
            label="Costo"
            name="cost"
            value={cost}
            onChange={handleCostChange}
            fullWidth
            sx={{ width: '75%', margin: 'auto' }}
          />
               <ErrorMessage
                 messages={
                   errors.cost
                     ? Array.isArray(errors.cost)
                       ? errors.cost
                       : [errors.cost]
                     : []
                 }
               />
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            variant="outlined"
            label="Impuestos"
            name="taxes"
            value={taxes}
            onChange={handleTaxesChange}
            fullWidth
            sx={{ width: '75%', margin: 'auto' }}
          />
               <ErrorMessage
                 messages={
                   errors.taxes
                     ? Array.isArray(errors.taxes)
                       ? errors.taxes
                       : [errors.taxes]
                     : []
                 }
               />
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            variant="outlined"
            label="Margen de Ganancia"
            name="profitMargin"
            value={profitMargin}
            onChange={handleProfitMarginChange}
            fullWidth
            sx={{ width: '75%', margin: 'auto' }}
          />
            <ErrorMessage
                 messages={
                   errors.profitMargin
                     ? Array.isArray(errors.profitMargin)
                       ? errors.profitMargin
                       : [errors.profitMargin]
                     : []
                 }
               />
        </Grid>
  
        <Grid item xs={12} sm={6}>
          <TextField
            type="number"
            variant="outlined"
            label="Cantidad"
            name="Cantidad"
            value={quantities}
            onChange={handleQuantitiesChange}
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
            name="Código de Barra"
            value={barcode}
            onChange={handleBarcodeChange}
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
            value={contentPerUnit}
            onChange={handleContentPerUnitChange}
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








      </Grid>
  
      {/* Agrega un botón para añadir más variantes del producto */}
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddVariant}
          sx={{
            width: '74%',
            margin: 'auto',
            marginTop: '8px',
          }}
          disabled={
            productVariantOptions.some((variant) => variant.type === 'Bulto') &&
            productVariantOptions.some((variant) => variant.type === 'Unidad')
          }
        >
          Agregar Variante
        </Button>
      </Grid>



      <Snackbar
         open={snackbarOpen}
         autoHideDuration={4000}
         onClose={() => setSnackbarOpen(false)}
         message={snackbarMessage}
         sx={{
          margin: "auto"
        }}
       />
    </div>
  );
  
};

export default ProductVariants;



