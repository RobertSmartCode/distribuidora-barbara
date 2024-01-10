import React, { useContext, useState } from 'react';
import { TextField, Box, Typography, Avatar } from '@mui/material';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { useFormik,  FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { CartContext } from '../../context/CartContext';

interface CouponDiscount {
  promoCode: string;
  discountPercentage: number;
  createdAt: Date;
  duration: number;
  maxDiscountAmount: number;
  minPurchaseAmount: number;
}

type ValidateCouponFunction = (couponCode: string) => Promise<CouponDiscount | null>;

const CouponValidation: React.FC = () => {
  const { updateDiscountInfo, getTotalPrice, getSelectedShippingMethod, discountInfo } =
    useContext(CartContext)! || {};

  const [isCouponValid, setIsCouponValid] = useState(false);
  const [couponInfo, setCouponInfo] = useState<CouponDiscount | null>(null);
  const [showValidationAlert, setShowValidationAlert] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null); // Agregar estado para el mensaje de error
  const [customError, setCustomError] = useState<string | null>(null);
  const [showDiscountMessage, setShowDiscountMessage] = useState(false);

  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const selectedShippingMethod = getSelectedShippingMethod();
  const shippingCost = selectedShippingMethod ? selectedShippingMethod.price : 0;
  const total = subtotal + shippingCost;

  const validationSchema = Yup.object({
    couponCode: Yup.string().required('El código del cupón es requerido'),
  });

  const formik = useFormik({
    initialValues: {
      couponCode: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }: FormikHelpers<any>) => {
      const validatedCoupon = await validateCoupon(values.couponCode);

      if (validatedCoupon) {
        setIsCouponValid(true);
        setCouponInfo(validatedCoupon);
        setValidationError(null); // Reiniciar el mensaje de error
        
        
        // Mostrar el mensaje de descuento aplicado
        setShowDiscountMessage(true);

        // Ocultar el mensaje de descuento aplicado después de 1 segundo
        setTimeout(() => {
          setShowDiscountMessage(false);
        }, 2000);
        
        resetForm();

      } else {
        const errorMessage = 'El cupón ingresado no es válido.';
        setShowValidationAlert(true);
        
        setValidationError(errorMessage); // Actualizar el mensaje de error
        setTimeout(() => {
          setShowValidationAlert(false);
          formik.resetForm();
        }, 1000); // Ocultar la alerta después de 1 segundo
      }
    },
  });

  const validateCoupon: ValidateCouponFunction = async (couponCodeToValidate) => {
    try {
      const couponsCollection = collection(db, 'promoCodes');
      const querySnapshot = await getDocs(
        query(couponsCollection, where('promoCode', '==', couponCodeToValidate))
      );
  
      if (querySnapshot.size === 1) {
        const couponDoc = querySnapshot.docs[0];
  
        if (
          couponDoc.data().promoCode &&
          couponDoc.data().discountPercentage !== null &&
          couponDoc.data().createdAt &&
          couponDoc.data().duration !== null &&
          couponDoc.data().maxDiscountAmount !== null &&
          couponDoc.data().minPurchaseAmount !== null
        ) {
          const promoCode = couponDoc.data().promoCode;
          const discountPercentage = couponDoc.data().discountPercentage;
          const createdAt = couponDoc.data().createdAt.toDate();
          const duration = couponDoc.data().duration;
          const maxDiscountAmount = couponDoc.data().maxDiscountAmount;
          const minPurchaseAmount = couponDoc.data().minPurchaseAmount;
  
          const currentDate = new Date();
          const couponExpirationDate = new Date(createdAt);
          couponExpirationDate.setDate(couponExpirationDate.getDate() + duration);
  
          if (currentDate <= couponExpirationDate) {
            const discountAmount = (discountPercentage / 100) * total;
  
            const newTotal =
              discountAmount > maxDiscountAmount ? total - maxDiscountAmount : total - discountAmount;
  
            if (newTotal >= minPurchaseAmount) {
              const newDiscountInfo = {
                promoCode,
                discountPercentage,
                createdAt,
                duration,
                maxDiscountAmount,
                minPurchaseAmount,
                isValid: true,
              };
  
              updateDiscountInfo(newDiscountInfo);
              return newDiscountInfo;
            } else {             
              const errorMessage = 'El monto mínimo de compra no se cumple.';
             
              setShowValidationAlert(true);
              setCustomError(errorMessage);
  
              // Ocultar la alerta y limpiar el error personalizado después de 1 segundo
              setTimeout(() => {
                setShowValidationAlert(false);
                setCustomError(null);
              }, 1000);
  
              return null;
            }
          } else {
            const errorMessage = 'El cupón ha caducado.';
            
            setShowValidationAlert(true);
            setCustomError(errorMessage);
  
            // Ocultar la alerta y limpiar el error personalizado después de 1 segundo
            setTimeout(() => {
              setShowValidationAlert(false);
              setCustomError(null);
            }, 1000);
  
            return null;
          }
        } else {
          console.error('El documento de cupón no contiene todos los campos necesarios.');
          return null;
        }
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      return null;
    }
  };
  
  let discountPercentage = discountInfo?.discountPercentage ?? 0;
  const maxDiscountAmount = discountInfo?.maxDiscountAmount ?? 0;
  const discountAmount = (discountPercentage / 100) * (subtotal + shippingCost);
  let newTotal;
  
  if (discountAmount < maxDiscountAmount) {
    newTotal = (subtotal + shippingCost) * (1 - discountPercentage / 100);
  } else {
    newTotal = subtotal + shippingCost - maxDiscountAmount;
    discountPercentage = Math.floor((1 - newTotal / (subtotal + shippingCost)) * 100);


  }
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" margin="0 25px" marginTop="30px" marginBottom="30px">
      <TextField
        label="¿Tienes un cupón de descuento?"
        variant="outlined"
        fullWidth
        sx={{
          "@media (min-width: 600px)": {
            maxWidth: "500px",  // Ajusta el valor según tus necesidades
            marginLeft: "auto", // Para centrar en modo escritorio
            marginRight: "auto", // Para centrar en modo escritorio
          },
        }}
        name="couponCode"
        value={formik.values.couponCode}
        onChange={formik.handleChange}
        error={formik.touched.couponCode && Boolean(formik.errors.couponCode)}
        helperText={formik.touched.couponCode ? (formik.errors.couponCode as string) : ''}
        className={formik.errors.couponCode ? 'errorBorder' : ''}
        InputProps={{
          endAdornment: (
            <Avatar
              variant="circular"
              color="primary"
              style={{
                marginLeft: '-42px',
                cursor: 'pointer',
              }}
              onClick={() => formik.handleSubmit()}
            >
              &gt;
            </Avatar>
          ),
        }}
      />

        {validationError && showValidationAlert && (
          <Typography variant="body1" style={{ color: 'red', marginTop: '8px' }}>
            {validationError}
          </Typography>
        )}

        {customError && (
          <Typography variant="body1" style={{ color: 'red', marginTop: '8px' }}>
            {customError}
          </Typography>
        )}


      {showDiscountMessage && isCouponValid && couponInfo && (
        <Box mt={2}>
          <Typography variant="subtitle1">Descuento Aplicado:</Typography>
          <Typography variant="body1" style={{ color: 'black' }}>
            Se aplicó un descuento del {discountPercentage}%.
          </Typography>
          <Typography variant="body1" style={{ color: 'black' }}>
            <span style={{ textDecoration: 'line-through' }}>${total.toFixed(2)}</span> ${newTotal.toFixed(2)}
          </Typography>
        </Box>
      )}
    </Box>


     
  );
};

export default CouponValidation;
