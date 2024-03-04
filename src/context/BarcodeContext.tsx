import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para el contexto de búsqueda por código de barras
interface BarcodeContextData {
  barcodeKeyword: string;
  updateBarcodeKeyword: (newBarcodeKeyword: string) => void;
}

// Crear el contexto de búsqueda por código de barras
export const BarcodeContext = createContext<BarcodeContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de búsqueda por código de barras
interface BarcodeContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de búsqueda por código de barras
export const BarcodeContextComponent: React.FC<BarcodeContextComponentProps> = ({ children }) => {
  const [barcodeKeyword, setBarcodeKeyword] = useState<string>('');

  const updateBarcodeKeyword = (newBarcodeKeyword: string) => {
    setBarcodeKeyword(newBarcodeKeyword);
  };

  const data: BarcodeContextData = {
    barcodeKeyword,
    updateBarcodeKeyword,
  };

  return <BarcodeContext.Provider value={data}>{children}</BarcodeContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de búsqueda por código de barras
export const useBarcodeContext = () => {
  const context = useContext(BarcodeContext);
  if (!context) {
    throw new Error("useBarcodeContext must be used within a BarcodeContextComponent");
  }
  return context;
};


export default BarcodeContextComponent;
