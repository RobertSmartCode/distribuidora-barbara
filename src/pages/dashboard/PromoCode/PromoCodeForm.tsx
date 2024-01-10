import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Paper } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../firebase/firebaseConfig';


// Función para generar un código aleatorio
const generatePromoCode = (
  duration: number,
  minPurchaseAmount: number,
  maxDiscountAmount: number,
  discountPercentage: number
): string => {
  // Combina los valores en una cadena
  const amount=(minPurchaseAmount-maxDiscountAmount)/100
  const promoCodeData1 = `${duration}${discountPercentage}`;
  const promoCodeData2 = `${amount}`;
  // Longitud deseada del código
  const codeLength = 8;

  // Genera una cadena alternada de mayúsculas, minúsculas y números
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const promoCode = Array.from({ length: codeLength }, (_, index) => {
    const charIndex = Math.floor(index / 3) % 3; // Alternar entre mayúsculas, minúsculas y números
    return characters.charAt(Math.floor(Math.random() * characters.length)+charIndex);
  }).join('');

  // Combina los datos del código y la parte aleatoria
  return promoCodeData1 + promoCode+promoCodeData2 ;
};




const validationSchema = yup.object({
  duration: yup.number().required('Campo requerido'),
  minPurchaseAmount: yup.number().required('Campo requerido'),
  maxDiscountAmount: yup.number().required('Campo requerido'),
  discountPercentage: yup.number().required('Campo requerido'),
});

const PromoCodeForm: React.FC = () => {

  const [generatedCode, setGeneratedCode] = useState<string | null>(null); 
  const formik = useFormik({
    initialValues: {
      duration: '',
      minPurchaseAmount: '',
      maxDiscountAmount: '',
      discountPercentage: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const promoCodesCollection = collection(db, 'promoCodes');
        
      
        // Genera el código a partir de los valores ingresados
              const promoCode = generatePromoCode(
                parseInt(values.duration),
                parseInt(values.minPurchaseAmount),
                parseInt(values.maxDiscountAmount),
                parseInt(values.discountPercentage)
      );


        const promoCodeData = {
          ...values,
          promoCode: promoCode, // Agrega el código generado al objeto de datos
          createdAt: serverTimestamp(),
        };

        await addDoc(promoCodesCollection, promoCodeData);

            // Establece el código generado en el estado
            setGeneratedCode(promoCode);

        formik.resetForm();

        // Puedes agregar una lógica adicional, como mostrar un mensaje de éxito
      } catch (error) {
        console.error('Error al guardar el código de descuento:', error);
        // Puedes manejar el error, por ejemplo, mostrando un mensaje de error al usuario
      }
    },
  });


  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      // Puedes agregar una lógica adicional, como mostrar un mensaje de éxito
    }
  };
  return (
    <Container maxWidth="sm" style={{ paddingTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', paddingTop: '40px' }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="60vh"
        >
          {generatedCode ? (
             <Box
             display="flex"
             flexDirection="column"
             alignItems="center"
             justifyContent="center"
             minHeight="60vh"
           >
              <Typography variant="h5" gutterBottom>
                Código Generado
              </Typography>
              <Typography variant="body1" gutterBottom>
                El código generado es: {generatedCode}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={copyToClipboard}
              >
                Copiar al Portapapeles
              </Button>
            </Box>
          ) : (
            <div>
              <Typography variant="h5" gutterBottom>
                Crear Cupón
              </Typography>
              <form
                onSubmit={formik.handleSubmit}
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TextField
                  label="Duración (días)"
                  name="duration"
                  type="number"
                  value={formik.values.duration}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.duration && !!formik.errors.duration}
                  helperText={formik.touched.duration && formik.errors.duration}
                  required
                />
                <TextField
                  label="Monto Mínimo de Compra"
                  name="minPurchaseAmount"
                  type="number"
                  value={formik.values.minPurchaseAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.minPurchaseAmount && !!formik.errors.minPurchaseAmount}
                  helperText={formik.touched.minPurchaseAmount && formik.errors.minPurchaseAmount}
                  required
                />
                <TextField
                  label="Cantidad Máxima de Descuento"
                  name="maxDiscountAmount"
                  type="number"
                  value={formik.values.maxDiscountAmount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.maxDiscountAmount && !!formik.errors.maxDiscountAmount}
                  helperText={formik.touched.maxDiscountAmount && formik.errors.maxDiscountAmount}
                  required
                />
                <TextField
                  label="Porcentaje de Descuento"
                  name="discountPercentage"
                  type="number"
                  value={formik.values.discountPercentage}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.discountPercentage && !!formik.errors.discountPercentage}
                  helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                  required
                />
                <Box mt={2} width="50%">
                  <Button variant="contained" color="primary" type="submit" fullWidth>
                    Crear
                  </Button>
                </Box>
              </form>
            </div>
          )}
        </Box>
      </Paper>
    </Container>
  );
  };
  
  export default PromoCodeForm;
  