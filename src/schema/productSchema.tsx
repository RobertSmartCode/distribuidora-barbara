import * as Yup from "yup";


export const productSchema = Yup.object().shape({
  title: Yup.string().required("El nombre es obligatorio"),
  description: Yup.string().required("La descripción es obligatoria"),
  unit_price: Yup.number()
    .typeError("El precio debe ser un número válido")
    .required("El precio es obligatorio"),
  category: Yup.string().required("La categoría es obligatoria"),
  sku: Yup.string().required("El SKU es obligatorio"),
  discount: Yup.number()
    .typeError("El descuento debe ser un número incluyendo 0")
    .min(0, "El descuento no puede ser negativo"),
  
});
