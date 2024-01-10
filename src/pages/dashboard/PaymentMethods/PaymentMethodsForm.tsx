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
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { useFormik } from "formik";
import * as yup from "yup";

// Interfaz para los métodos de pago
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  // Agrega otras propiedades específicas de los métodos de pago si es necesario
}

// Props para el componente PaymentMethodsForm
interface PaymentMethodsFormProps {
  open: boolean;
  onClose: () => void;
  methodToEdit?: PaymentMethod | null;
  onUpdateMethod: (methodId: string, updatedMethod: PaymentMethod) => Promise<void>;
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
  description: yup.string().required("La descripción es requerida"),
  // Agrega validaciones para otras propiedades específicas si es necesario
});

const PaymentMethodsForm: React.FC<PaymentMethodsFormProps> = ({ open, onClose, methodToEdit, onUpdateMethod }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: methodToEdit?.name || "",
      description: methodToEdit?.description || "",
      // Incluye otras propiedades iniciales si es necesario
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const paymentMethodsCollection = collection(db, "paymentMethods");

        if (methodToEdit) {
          // Editar el método de pago existente
          await onUpdateMethod(methodToEdit.id, { ...values, id: methodToEdit.id });
        } else {
          // Agregar un nuevo método de pago
          await addDoc(paymentMethodsCollection, values);
        }

        onClose();
      } catch (error) {
        console.error("Error al guardar el método de pago:", error);
        setSnackbarMessage("Error al guardar el método de pago.");
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
        description: methodToEdit.description || "",
        // Incluye otras propiedades si es necesario
      });
    } else {
      // Cuando el formulario se abre para agregar un nuevo método
      formik.resetForm();
    }
  }, [open, methodToEdit]);

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
                  label="Descripción"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  error={formik.touched.description && !!formik.errors.description}
                  helperText={formik.touched.description && formik.errors.description}
                  required
                />
              </Grid>
              {/* Agrega campos para otras propiedades si es necesario */}
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

export default PaymentMethodsForm;
