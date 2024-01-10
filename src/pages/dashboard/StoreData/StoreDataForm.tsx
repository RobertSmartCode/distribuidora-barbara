import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  Snackbar,
  Container,
  Grid,
  TextField,
 
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";

// import LogoUploader from './LogoUploader';
import { useFormik } from "formik";
import * as yup from "yup";

// types.ts
export interface StoreData {
  id: string;
  storeName: string;
  // logo: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
  };
  businessHours: string;
  // Agrega otras propiedades específicas de los datos de la tienda si es necesario
}

interface StoreDataFormProps {
  open: boolean;
  onClose: () => void;
  storeDataToEdit?: StoreData | null;
  onUpdateStoreData: (storeDataId: string, updatedStoreData: StoreData) => Promise<void>;
}

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref: React.Ref<unknown>) => {
  return (
    <Slide direction="up" ref={ref as React.Ref<HTMLElement>} {...props}>
      <div>{props.children}</div>
    </Slide>
  );
});

const validationSchema = yup.object({
  id: yup.string().required("El ID de la Tienda es obligatorio."),
  storeName: yup.string().required("El Nombre de la Tienda es obligatorio."),
  // logo: yup.string().url("Ingrese una URL válida para el Logo de la Tienda."),
  description: yup.string().required("La Descripción es obligatoria."),
  address: yup.string().required("La Dirección es obligatoria."),
  phoneNumber: yup
    .string()
    .matches(/^\d{10}$/, "El Teléfono debe tener 10 dígitos válidos.")
    .required("El Teléfono es obligatorio."),
  email: yup
    .string()
    .email("Ingrese una dirección de correo electrónico válida.")
    .required("El Correo Electrónico es obligatorio."),
  website: yup.string().url("Ingrese una URL válida para el Sitio Web."),
  "socialMedia.facebook": yup.string().url("Ingrese una URL válida para Facebook."),
  "socialMedia.instagram": yup.string().url("Ingrese una URL válida para Instagram."),
  "socialMedia.tiktok": yup.string().url("Ingrese una URL válida para TikTok."),
  "socialMedia.twitter": yup.string().url("Ingrese una URL válida para Twitter."),
  "socialMedia.linkedin": yup.string().url("Ingrese una URL válida para LinkedIn."),
  businessHours: yup.string().required("El Horario de Atención es obligatorio."),
  // Agrega otras validaciones si es necesario para campos adicionales
});

const StoreDataForm: React.FC<StoreDataFormProps> = ({ open, onClose, storeDataToEdit, onUpdateStoreData }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const isEditing = storeDataToEdit !== null;


  


  const formik = useFormik({
    initialValues: {
      id: isEditing ? storeDataToEdit?.id || "" : "",
      storeName: isEditing ? storeDataToEdit?.storeName || "" : "",
      // logo: isEditing ? storeDataToEdit?.logo || "" : "",
      description: isEditing ? storeDataToEdit?.description || "" : "",
      address: isEditing ? storeDataToEdit?.address || "" : "",
      phoneNumber: isEditing ? storeDataToEdit?.phoneNumber || "" : "",
      email: isEditing ? storeDataToEdit?.email || "" : "",
      website: isEditing ? storeDataToEdit?.website || "" : "",
      socialMedia: {
        facebook: isEditing ? storeDataToEdit?.socialMedia?.facebook || "" : "",
        instagram: isEditing ? storeDataToEdit?.socialMedia?.instagram || "" : "",
        tiktok: isEditing ? storeDataToEdit?.socialMedia?.tiktok || "" : "",
        twitter: isEditing ? storeDataToEdit?.socialMedia?.twitter || "" : "",
        linkedin: isEditing ? storeDataToEdit?.socialMedia?.linkedin || "" : "",
      },
      businessHours: isEditing ? storeDataToEdit?.businessHours || "" : "",
      // Agrega otras propiedades específicas si es necesario
    },
    validationSchema: validationSchema,
    
    onSubmit: async (values) => {
      try {
        const storeDataCollection = collection(db, "storeData");
    
        if (isEditing && storeDataToEdit && storeDataToEdit.id) {
          
          await onUpdateStoreData(storeDataToEdit.id, {
            ...values,
          });
        } else {
          console.log("Modo creación, agregando nuevos datos...");
          await addDoc(storeDataCollection, values);
        }
    
        onClose();
      } catch (error) {
        console.error("Error al guardar los datos de la tienda:", error);
        setSnackbarMessage("Error al guardar los datos de la tienda.");
        setSnackbarOpen(true);
      }
    },
    
  });
  

  useEffect(() => {
    if (open && storeDataToEdit) {
      formik.setValues({
        ...storeDataToEdit,
        socialMedia: {
          facebook: storeDataToEdit.socialMedia?.facebook || "",
          instagram: storeDataToEdit.socialMedia?.instagram || "",
          tiktok: storeDataToEdit.socialMedia?.tiktok || "",
          twitter: storeDataToEdit.socialMedia?.twitter || "",
          linkedin: storeDataToEdit.socialMedia?.linkedin || "",
        },
      });
    } else {
      formik.resetForm();
    }
  }, [open, storeDataToEdit]);
  

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogContent sx={{ overflowY: "auto", maxHeight: "70vh" }}>
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="storeName"
                  name="storeName"
                  label="Nombre de la Tienda"
                  variant="outlined"
                  value={formik.values.storeName}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="text"
                  error={formik.touched.storeName && Boolean(formik.errors.storeName)}
                  helperText={formik.touched.storeName && formik.errors.storeName}
                />
              </Grid>
              <Grid item xs={12}>
              {/* <LogoUploader onLogoUpload={handleLogoUpload} /> */}

              
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  name="description"
                  label="Descripción"
                  variant="outlined"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="text"
                  error={formik.touched.description && Boolean(formik.errors.description)}
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="address"
                  name="address"
                  label="Dirección"
                  variant="outlined"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="text"
                  error={formik.touched.address && Boolean(formik.errors.address)}
                  helperText={formik.touched.address && formik.errors.address}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Teléfono"
                  variant="outlined"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="tel"
                  // inputProps={{ pattern: "[0-9]{10}" }}
                  error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                  helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Correo Electrónico"
                    variant="outlined"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    margin="normal"
                    type="email"
                   
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="website"
                  name="website"
                  label="Enlace al Sitio Web"
                  variant="outlined"
                  value={formik.values.website}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://.*" }}
                  error={formik.touched.website && Boolean(formik.errors.website)}
                  helperText={formik.touched.website && formik.errors.website}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="socialMedia.facebook"
                  name="socialMedia.facebook"
                  label="Facebook"
                  variant="outlined"
                  value={formik.values.socialMedia?.facebook || ""}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://www.facebook.com/.*" }}
                  error={formik.touched.socialMedia?.facebook && Boolean(formik.errors.socialMedia?.facebook)}
                  helperText={formik.touched.socialMedia?.facebook && formik.errors.socialMedia?.facebook}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="socialMedia.instagram"
                  name="socialMedia.instagram"
                  label="Instagram"
                  variant="outlined"
                  value={formik.values.socialMedia?.instagram || ""}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://www.instagram.com/.*" }}
                  error={formik.touched.socialMedia?.instagram && Boolean(formik.errors.socialMedia?.instagram)}
                  helperText={formik.touched.socialMedia?.instagram && formik.errors.socialMedia?.instagram}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="socialMedia.tiktok"
                  name="socialMedia.tiktok"
                  label="TikTok"
                  variant="outlined"
                  value={formik.values.socialMedia?.tiktok || ""}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://www.tiktok.com/.*" }}
                  error={formik.touched.socialMedia?.tiktok && Boolean(formik.errors.socialMedia?.tiktok)}
                  helperText={formik.touched.socialMedia?.tiktok && formik.errors.socialMedia?.tiktok}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="socialMedia.twitter"
                  name="socialMedia.twitter"
                  label="Twitter"
                  variant="outlined"
                  value={formik.values.socialMedia?.twitter || ""}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://twitter.com/.*" }}
                  error={formik.touched.socialMedia?.twitter && Boolean(formik.errors.socialMedia?.twitter)}
                  helperText={formik.touched.socialMedia?.twitter && formik.errors.socialMedia?.twitter}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="socialMedia.linkedin"
                  name="socialMedia.linkedin"
                  label="LinkedIn"
                  variant="outlined"
                  value={formik.values.socialMedia?.linkedin || ""}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="url"
                  inputProps={{ pattern: "https://www.linkedin.com/.*" }}
                  error={formik.touched.socialMedia?.linkedin && Boolean(formik.errors.socialMedia?.linkedin)}
                  helperText={formik.touched.socialMedia?.linkedin && formik.errors.socialMedia?.linkedin}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="businessHours"
                  name="businessHours"
                  label="Horario de Atención"
                  variant="outlined"
                  value={formik.values.businessHours}
                  onChange={formik.handleChange}
                  margin="normal"
                  type="text"
                  error={formik.touched.businessHours && Boolean(formik.errors.businessHours)}
                  helperText={formik.touched.businessHours && formik.errors.businessHours}
                />
              </Grid>
              {/* Agrega otros campos de formulario si es necesario */}
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            {isEditing ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} message={snackbarMessage} />
    </Dialog>
  );
};

export default StoreDataForm;