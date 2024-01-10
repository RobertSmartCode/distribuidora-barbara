import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para las opciones de colores
interface Color {
  color: string;
  sizes: string[];
  quantities: number[];
}

// Definir la interfaz para el contexto de colores
interface ColorsContextData {
  colors: Color[];
  updateColors: (newColors: Color[]) => void;
}

// Crear el contexto de colores
export const ColorsContext = createContext<ColorsContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de colores
interface ColorsContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de colores
const ColorsContextComponent: React.FC<ColorsContextComponentProps> = ({ children }) => {
  const [colors, setColors] = useState<Color[]>([]);

  const updateColors = (newColors: Color[]) => {
    setColors(newColors);
  };

  const data: ColorsContextData = {
    colors,
    updateColors,
  };

  return <ColorsContext.Provider value={data}>{children}</ColorsContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de colores
export const useColorsContext = () => {
  const context = useContext(ColorsContext);
  if (!context) {
    throw new Error("useColorsContext must be used within a ColorsContextProvider");
  }
  return context;
};

export default ColorsContextComponent;
