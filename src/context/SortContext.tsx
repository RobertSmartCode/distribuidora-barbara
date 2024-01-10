import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para las opciones de clasificación
interface Sort {
  sortBy: string;
  sortOrder: "asc" | "desc";
}

// Definir la interfaz para el contexto de clasificación
interface SortContextData {
  sort: Sort;
  updateSort: (newSort: Partial<Sort>) => void;
}

// Crear el contexto de clasificación
export const SortContext = createContext<SortContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de clasificación
interface SortContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de clasificación
const SortContextComponent: React.FC<SortContextComponentProps> = ({ children }) => {
  const [sort, setSort] = useState<Sort>({
    sortBy: "default",
    sortOrder: "asc",
  });

  const updateSort = (newSort: Partial<Sort>) => {
    setSort((prevSort) => ({
      ...prevSort,
      ...newSort,
    }));
  };

  const data: SortContextData = {
    sort,
    updateSort,
  };

  return <SortContext.Provider value={data}>{children}</SortContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de clasificación
export const useSortContext = () => {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSortContext must be used within a SortContextProvider");
  }
  return context;
};

export default SortContextComponent;
