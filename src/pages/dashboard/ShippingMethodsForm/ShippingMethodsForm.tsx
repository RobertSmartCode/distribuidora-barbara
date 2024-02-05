import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  Snackbar,
  Container,
  Grid,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import { collection, addDoc} from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useFormik } from "formik";
import * as yup from "yup";

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

interface ShippingMethodsFormProps {
  open: boolean;
  onClose: () => void;
  methodToEdit?: ShippingMethod | null;
  onUpdateMethod: (methodId: string, updatedMethod: ShippingMethod) => Promise<void>;
}

const Transition = React.forwardRef<unknown, TransitionProps>((props: TransitionProps, ref: React.Ref<unknown>) => {
  return (
    <Slide direction="up" ref={ref as React.Ref<HTMLElement>} {...props}>
      <div>{props.children}</div>
    </Slide>
  );
});

const validationSchema = yup.object({
  name: yup.string().required("El nombre es requerido"),
  price: yup.number().required("El precio es requerido"),
});


const ShippingMethodsForm: React.FC<ShippingMethodsFormProps> = ({
  open,
  onClose,
  methodToEdit,
  onUpdateMethod,
}) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: methodToEdit?.name || "",
      price: methodToEdit?.price || 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const shippingMethodsCollection = collection(db, "shippingMethods");

        if (methodToEdit) {
          // Editar el método de envío existente
          await onUpdateMethod(methodToEdit.id, { ...values, id: methodToEdit.id });
        } else {
          // Agregar un nuevo método de envío
          await addDoc(shippingMethodsCollection, values);
        }

        onClose();
      } catch (error) {
        console.error("Error al guardar el método de envío:", error);
        setSnackbarMessage("Error al guardar el método de envío.");
        setSnackbarOpen(true);
      }
    },
  });

  // Agregar un efecto para reiniciar el formulario cuando cambia el método a editar
  useEffect(() => {
    if (open && methodToEdit) {
      // Cuando el formulario se abre y se pasa un método para editar
      formik.setValues({
        name: methodToEdit.name || "",
        price: methodToEdit.price || 0,
      });
    } else {
      // Cuando el formulario se abre para agregar un nuevo método
      formik.resetForm();
    }
  }, [open, methodToEdit]); // Agrega formik como dependencia si es necesario

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  return (
    <Dialog open={open} onClose={onClose} TransitionComponent={Transition} fullWidth maxWidth="sm">
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Container maxWidth="sm">
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Nombre"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.name && !!formik.errors.name}
                  helperText={formik.touched.name && formik.errors.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Precio"
                  name="price"
                  type="number"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.price && !!formik.errors.price}
                  helperText={formik.touched.price && formik.errors.price}
                  required
                />
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            {methodToEdit ? "Guardar Cambios" : "Agregar"}
          </Button>
        </DialogActions>
      </form>
      <Snackbar open={snackbarOpen} autoHideDuration={4000} onClose={handleCloseSnackbar} message={snackbarMessage} />
    </Dialog>
  );
};

export default ShippingMethodsForm;
