import { useContext, useEffect, useState, } from "react";
import {
  Typography,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio
} from "@mui/material";

import { db } from "../../firebase/firebaseConfig";
import { useCustomer } from '../../context/CustomerContext';
import { AuthContext } from "../../context/AuthContext";
import * as Yup from 'yup';
import { useFormik } from "formik";
import { useNavigate } from 'react-router-dom';
import {CustomerInfo, Order} from "../../type/type"
import {
  getDocs,
  collection,
  query,
  where,
  DocumentData,
} from "firebase/firestore";


const CheckoutForm = () => {

  const { customerInfo, setCustomerInfo } = useCustomer()!;

    const [myOrders, setMyOrders] = useState<Order[]>([]);

    const [initialValuesLoaded, setInitialValuesLoaded] = useState(false);

    const [showInvoiceFields, setShowInvoiceFields] = useState(false);

    const [showError, setShowError] = useState(false);

    const { user } = useContext(AuthContext)!;


    const handleCustomerTypeChange = (event: any) => {
      setShowInvoiceFields(event.target.value === "invoice");
      formik.handleChange(event);
    };


    useEffect(() => {
      const ordersCollection = collection(db, "orders");
      const ordersFiltered = query(
        ordersCollection,
        where("userData.email", "==", user.email)
      );
  
      getDocs(ordersFiltered)
        .then((res) => {
          const newArr: Order[] = res.docs.map((order) => ({
            ...(order.data() as DocumentData),
            id: order.id,
          })) as Order[];
          
          setMyOrders(newArr);
        })
        .catch((error) => console.log(error));
    }, [user.email]);

    
    // Si el usuario está logueado e hizo una orden llenará la información del usuario con la información de la orden
    const mapOrderToCustomerInfo = (order: Order): CustomerInfo => {
      const userData = order.userData || {};
    
      return {
        email: userData.email || "",
        receiveOffers: userData.receiveOffers || false,
        country: userData.country || "",
        identificationDocument: userData.identificationDocument || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        isOtherPerson: userData.isOtherPerson || false,
        otherPersonFirstName: userData.otherPersonFirstName || "",
        otherPersonLastName: userData.otherPersonLastName || "",
        streetAndNumber: userData.streetAndNumber || "",
        department: userData.department || "",
        neighborhood: userData.neighborhood || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
        province: userData.province || "",
        customerType: userData.customerType || "finalConsumer",
        cuilCuit: userData.cuilCuit || "",
        businessName: userData.businessName || "",
        
      
      };
    };
    
    
    const navigate = useNavigate();

      // Definir los valores iniciales
      const initialValues: CustomerInfo = {
        email: "",
        receiveOffers: false,
        country: "",
        identificationDocument: "",
        firstName: "",
        lastName: "",
        phone: "",
        isOtherPerson: false,
        otherPersonFirstName: "",
        otherPersonLastName: "",
        streetAndNumber: "",
        department: "",
        neighborhood: "",
        city: "",
        postalCode: "",
        province: "",
        customerType: "finalConsumer",
        cuilCuit: "",
        businessName: "",
      };

   
      
      
 
      const validationSchema = Yup.object().shape({
        email: Yup.string().email("Correo electrónico inválido").required("Campo requerido"),
        country: Yup.string().required("Campo requerido"),
        identificationDocument: Yup.string().required("Campo requerido"),
        firstName: Yup.string().required("Campo requerido"),
        lastName: Yup.string().required("Campo requerido"),
        phone: Yup.string().required("Campo requerido"),
        streetAndNumber: Yup.string().required("Campo requerido"),
        city: Yup.string().required("Campo requerido"),
        postalCode: Yup.string().required("Campo requerido"),
        province: Yup.string().required("Campo requerido"),
       
      });
    
    
    
  // Utilizar formik para manejar el formulario
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const customerData: CustomerInfo = {
        email: values.email || "",
        receiveOffers: values.receiveOffers || false,
        country: values.country || "",
        identificationDocument: values.identificationDocument || "",
        firstName: values.firstName || "",
        lastName: values.lastName || "",
        phone: values.phone || "",
        isOtherPerson: values.isOtherPerson || false,
        otherPersonFirstName: values.otherPersonFirstName || "",
        otherPersonLastName: values.otherPersonLastName || "",
        streetAndNumber: values.streetAndNumber || "",
        department: values.department || "",
        neighborhood: values.neighborhood || "",
        city: values.city || "",
        postalCode: values.postalCode || "",
        province: values.province || "",
        customerType: values.customerType || "finalConsumer",
        cuilCuit: values.cuilCuit || "",
        businessName: values.businessName || "",
        
      };

      setCustomerInfo(customerData);

      navigate("/checkout/next");
    },
  });

  
// Verificar si los valores iniciales han sido cargados antes de inicializar el formulario

// Verificar si los valores iniciales han sido cargados antes de inicializar el formulario
useEffect(() => {
  if (initialValuesLoaded) {
    const currentUser =
      user && myOrders.length > 0
        ? mapOrderToCustomerInfo(myOrders[0])
        : (customerInfo || {}) as CustomerInfo;

    // Actualizar los valores iniciales solo si el formulario no ha sido tocado
    if (!formik.touched.email) {
      // Establecer el correo electrónico en el formulario
      formik.setValues({
        email: currentUser.email || "",
        receiveOffers: currentUser.receiveOffers || false,
        country: currentUser.country || "",
        identificationDocument: currentUser.identificationDocument || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        phone: currentUser.phone || "",
        isOtherPerson: currentUser.isOtherPerson || false,
        otherPersonFirstName: currentUser.otherPersonFirstName || "",
        otherPersonLastName: currentUser.otherPersonLastName || "",
        streetAndNumber: currentUser.streetAndNumber || "",
        department: currentUser.department || "",
        neighborhood: currentUser.neighborhood || "",
        city: currentUser.city || "",
        postalCode: currentUser.postalCode || "",
        province: currentUser.province || "",
        customerType: currentUser.customerType || "finalConsumer",
        cuilCuit: currentUser.cuilCuit || "",
        businessName: currentUser.businessName || "",
      });

      // Verificar si el tipo de cliente es "invoice" y actualizar showInvoiceFields
      if (currentUser.customerType === "invoice") {
        setShowInvoiceFields(true);
      }
    }
  }
}, [user, myOrders, customerInfo, formik.touched.email, initialValuesLoaded]);




// Marcar que los valores iniciales han sido cargados
useEffect(() => {
  setInitialValuesLoaded(true);
}, []);



  const titleStyle = {
    fontWeight: "bold",
    color: "black", // Color negro
  };

  const labelStyle = {
    
    color: "gray", // Color negro
    fontSize: "12px",
  };

// Función de validación para CUIL/CUIT
const validateCuilCuit = (value: string) => {
  if (!value) {
    return "Campo requerido";
  }
  // Puedes agregar más lógica de validación específica si es necesario
  return "";
};

// Función de validación para Razón Social
const validateBusinessName = (value: string) => {
  if (!value) {
    return "Campo requerido";
  }
  // Puedes agregar más lógica de validación específica si es necesario
  return "";
};


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await formik.validateForm(); // Validar el formulario con formik
      formik.setSubmitting(true); // Establecer el indicador de envío a true

      // Verificar si el tipo de cliente es "invoice" para aplicar las validaciones específicas
    if (formik.values.customerType === 'invoice') {
      // Validación específica para CUIL/CUIT
      const cuilCuitError = validateCuilCuit(formik.values.cuilCuit || "");
      
      formik.setFieldError("cuilCuit", cuilCuitError);

      // Validación específica para Razón Social
      const businessNameError = validateBusinessName(formik.values.businessName || "");
    
      formik.setFieldError("businessName", businessNameError);

      // Verificar si hay errores en las validaciones específicas antes de continuar
      if (cuilCuitError || businessNameError) {
        setShowError(true)

        setTimeout(() => {
          setShowError(false);
        }, 5000); 
        return;
      }
    }

      const customerData: CustomerInfo = {
        email: formik.values.email || "",
        receiveOffers: formik.values.receiveOffers || false,
        country: formik.values.country || "",
        identificationDocument: formik.values.identificationDocument || "",
        firstName: formik.values.firstName || "",
        lastName: formik.values.lastName || "",
        phone: formik.values.phone || "",
        isOtherPerson: formik.values.isOtherPerson || false,
        otherPersonFirstName: formik.values.otherPersonFirstName || "",
        otherPersonLastName: formik.values.otherPersonLastName || "",
        streetAndNumber: formik.values.streetAndNumber || "",
        department: formik.values.department || "",
        neighborhood: formik.values.neighborhood || "",
        city: formik.values.city || "",
        postalCode: formik.values.postalCode || "",
        province: formik.values.province || "",
        customerType: formik.values.customerType || "finalConsumer",
        cuilCuit: formik.values.cuilCuit || "",
        businessName: formik.values.businessName || "",
      };

      setCustomerInfo(customerData);

      navigate("/checkout/next");

    } catch (error) {
      // Manejar errores y actualizar el estado de los errores
      if (error instanceof Yup.ValidationError) {
        const validationErrors: { [key: string]: string } = {};
        error.inner.forEach((e) => {
          if (e.path) {
            validationErrors[e.path] = e.message;
          }
        });
        formik.setErrors(validationErrors);
      } else {
        formik.setSubmitting(false); // Establecer el indicador de envío a false
      }
    } 
  };
  
  
  
 
  return (
    <form onSubmit={handleSubmit}>
      <Box maxWidth="400px" margin="0 auto" padding="25px">
        <Typography variant="h6" align="left" style={titleStyle}>
          <strong>Datos de Contacto</strong>
        </Typography>
        <TextField
          fullWidth
          label="Correo Electrónico"
          variant="outlined"
          margin="normal"
          required
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && !!formik.errors.email}
          helperText={formik.touched.email && formik.errors.email}
        />
        
        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.receiveOffers}
              onChange={formik.handleChange}
              name="receiveOffers"
            />
          }
          label={
            <Typography style={labelStyle}>
              Quiero recibir ofertas y novedades por email
            </Typography>
          }
        />
        <Typography variant="h6" align="left" style={titleStyle}>
          <strong>Datos de Facturación</strong>
        </Typography>
        <TextField
          fullWidth
          label="País"
          variant="outlined"
          margin="normal"
          required
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          error={formik.touched.country && !!formik.errors.country}
          helperText={formik.touched.country && formik.errors.country}
        />
        <TextField
          fullWidth
          label="Documento de Identidad"
          variant="outlined"
          margin="normal"
          required
          name="identificationDocument"
          value={formik.values.identificationDocument}
          onChange={formik.handleChange}
          error={formik.touched.identificationDocument && !!formik.errors.identificationDocument}
          helperText={formik.touched.identificationDocument && formik.errors.identificationDocument}
        />
        <TextField
          fullWidth
          label="Nombre"
          variant="outlined"
          margin="normal"
          required
          name="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          error={formik.touched.firstName && !!formik.errors.firstName}
          helperText={formik.touched.firstName && formik.errors.firstName}
        />
        <TextField
          fullWidth
          label="Apellido"
          variant="outlined"
          margin="normal"
          required
          name="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          error={formik.touched.lastName && !!formik.errors.lastName}
          helperText={formik.touched.lastName && formik.errors.lastName}
        />
        <TextField
          fullWidth
          label="Teléfono"
          variant="outlined"
          margin="normal"
          required
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          error={formik.touched.phone && !!formik.errors.phone}
          helperText={formik.touched.phone && formik.errors.phone}
        />






              {/* Elección de tipo de cliente: Consumidor Final o Factura A/B */}
        <FormControl component="fieldset" style={{ marginTop: "20px" }}>
        <FormLabel component="legend" style={titleStyle}>
          Tipo de Cliente
        </FormLabel>
        <RadioGroup
          row
          aria-label="customerType"
          name="customerType"
          value={formik.values.customerType || ''} // Ensure value is not undefined
          onChange={handleCustomerTypeChange}
        >
          <FormControlLabel
            value="finalConsumer"
            control={<Radio />}
            label={<Typography style={{ color: 'black' }}>Consumidor Final</Typography>}
          />
          <FormControlLabel
            value="invoice"
            control={<Radio />}
            label={<Typography style={{ color: 'black' }}>Factura A/B</Typography>}
          />
        </RadioGroup>

      </FormControl>

      {/* Additional fields for Invoice if it's selected */}

    
      { showError && (
        <>
          <Typography variant="body1" color="error" component="span">
       Razón Social y CUIL/CUIT son Obligatorios
          </Typography>
        </>
      )}
      
      {showInvoiceFields && (
        <>
           <TextField
          fullWidth
          label="Razón Social"
          variant="outlined"
          margin="normal"
          name="businessName"
          value={formik.values.businessName}
          onChange={formik.handleChange}
         
        />
          <TextField
          fullWidth
          label="CUIL/CUIT"
          variant="outlined"
          margin="normal"
          name="cuilCuit"
          value={formik.values.cuilCuit}
          onChange={formik.handleChange}
         
        />
        </>
      )}

        <FormControlLabel
          control={
            <Checkbox
              checked={formik.values.isOtherPerson}
              onChange={formik.handleChange}
              name="isOtherPerson"
            />
          }
          label={
            <Typography style={labelStyle}>
              Otra persona retirará el pedido
            </Typography>
          }
        />


        {formik.values.isOtherPerson && (
          <>
            <Typography style={titleStyle}>
              Persona que retirará el pedido
            </Typography>
            <TextField
              fullWidth
              label="Nombre"
              variant="outlined"
              margin="normal"
              name="otherPersonFirstName"
              value={formik.values.otherPersonFirstName}
              onChange={formik.handleChange}
              error={formik.touched.otherPersonFirstName && !!formik.errors.otherPersonFirstName}
              helperText={formik.touched.otherPersonFirstName && formik.errors.otherPersonFirstName}
            />
            <TextField
              fullWidth
              label="Apellido"
              variant="outlined"
              margin="normal"
              name="otherPersonLastName"
              value={formik.values.otherPersonLastName}
              onChange={formik.handleChange}
              error={formik.touched.otherPersonLastName && !!formik.errors.otherPersonLastName}
              helperText={formik.touched.otherPersonLastName && formik.errors.otherPersonLastName}
            />
          </>
        )}






        <Typography variant="subtitle1" style={titleStyle}>
          <strong>Datos del Domicilio de Entrega</strong>
        </Typography>
        <TextField
          fullWidth
          label="Calle y Número"
          variant="outlined"
          margin="normal"
          required
          name="streetAndNumber"
          value={formik.values.streetAndNumber}
          onChange={formik.handleChange}
          error={formik.touched.streetAndNumber && !!formik.errors.streetAndNumber}
          helperText={formik.touched.streetAndNumber && formik.errors.streetAndNumber}
        />
        <TextField
          fullWidth
          label="Departamento (Opcional)"
          variant="outlined"
          margin="normal"
          name="department"
          value={formik.values.department}
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          label="Barrio (Opcional)"
          variant="outlined"
          margin="normal"
          name="neighborhood"
          value={formik.values.neighborhood}
          onChange={formik.handleChange}
        />
        <TextField
          fullWidth
          label="Ciudad"
          variant="outlined"
          margin="normal"
          required
          name="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          error={formik.touched.city && !!formik.errors.city}
          helperText={formik.touched.city && formik.errors.city}
        />
        <TextField
          fullWidth
          label="Código Postal"
          variant="outlined"
          margin="normal"
          required
          name="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          error={formik.touched.postalCode && !!formik.errors.postalCode}
          helperText={formik.touched.postalCode && formik.errors.postalCode}
        />
        <TextField
          fullWidth
          label="Provincia"
          variant="outlined"
          margin="normal"
          required
          name="province"
          value={formik.values.province}
          onChange={formik.handleChange}
          error={formik.touched.province && !!formik.errors.province}
          helperText={formik.touched.province && formik.errors.province}
        />

        { showError && (
                <Box display="flex" justifyContent="center" marginTop="20px">
                  <Typography variant="body1" color="error" component="span" style={{ textAlign: 'center' }}>
                    Revisa el Formulario
                  </Typography>
                  </Box>
        )}
         <Box display="flex" justifyContent="center" marginTop="20px">
            
          <Button variant="contained" color="primary" type="submit">
            Continuar
          </Button>
        </Box>
        
     
      </Box>
    </form>
  );
  
  
};

export default CheckoutForm;
