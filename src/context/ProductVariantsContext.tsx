import React, { createContext, useState, ReactNode, useContext } from "react";

import { ProductVariantOption } from '../type/type';



// Define la interfaz para el contexto de opciones de producto
interface ProductVariantsContextData {
  productVariantOptions: ProductVariantOption[];
  updateProductVariantOptions: (newProductVariantOptions: ProductVariantOption[]) => void;
}

// Crea el contexto de opciones de producto
export const ProductVariantsContext = createContext<ProductVariantsContextData | undefined>(undefined);

// Define las propiedades del componente de contexto de opciones de producto
interface ProductVariantsContextComponentProps {
  children: ReactNode;
}

// Crea el componente de contexto de opciones de producto
const ProductVariantsContextComponent: React.FC<ProductVariantsContextComponentProps> = ({ children }) => {

  
  const [productVariantOptions, setProductVariantOptions] = useState<ProductVariantOption[]>([]);

  const updateProductVariantOptions = (newProductVariantOptions: ProductVariantOption[]) => {
    setProductVariantOptions(newProductVariantOptions);
  };

  const data: ProductVariantsContextData = {
    productVariantOptions,
    updateProductVariantOptions,
  };

  return <ProductVariantsContext.Provider value={data}>{children}</ProductVariantsContext.Provider>;
};

// Crea el hook personalizado para acceder al contexto de opciones de producto
export const useProductVariantsContext = () => {
  const context = useContext(ProductVariantsContext);
  if (!context) {
    throw new Error("useProductVariantsContext must be used within a ProductVariantsContextProvider");
  }
  return context;
};

export default ProductVariantsContextComponent;
