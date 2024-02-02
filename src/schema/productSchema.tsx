import * as Yup from "yup";


export const productSchema = Yup.object().shape({
  title: Yup.string().required("El nombre es obligatorio"),
  brand: Yup.string().required("La marca es obligatoria"),
  description: Yup.string().required("La descripción es obligatoria"),
  category: Yup.string().required("La categoría es obligatoria"),
  discount: Yup.number()
    .typeError("El descuento debe ser un número incluyendo 0")
    .min(0, "El descuento no puede ser negativo"),
    type: Yup.string().required("El tipo es obligatorio"),
    contentPerUnit: Yup.number().required("El contenido neto por unidad es obligatorio").min(1, "El contenido neto por unidad debe ser mayor a cero"),
    quantities: Yup.number().required("La cantidad es obligatoria").min(1, "La cantidad debe ser mayor a cero"),
    barcode: Yup.number().required("El código de barras es obligatorio").min(1, "El código de barras debe ser mayor a cero")
});




