import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para los elementos seleccionados
interface SelectedItem {
  name: string;
  // Puedes agregar más propiedades según tus necesidades
}

// Definir la interfaz para el contexto de elementos seleccionados
interface SelectedItemsContextData {
  selectedItems: SelectedItem[];
  updateSelectedItems: (newItems: SelectedItem[]) => void;
}

// Crear el contexto de elementos seleccionados
export const SelectedItemsContext = createContext<SelectedItemsContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de elementos seleccionados
interface SelectedItemsContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de elementos seleccionados
const SelectedItemsContextComponent: React.FC<SelectedItemsContextComponentProps> = ({ children }) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);

  const updateSelectedItems = (newItems: SelectedItem[]) => {
    setSelectedItems(newItems);
  };

  const data: SelectedItemsContextData = {
    selectedItems,
    updateSelectedItems,
  };

  return <SelectedItemsContext.Provider value={data}>{children}</SelectedItemsContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de elementos seleccionados
export const useSelectedItemsContext = () => {
  const context = useContext(SelectedItemsContext);
  if (!context) {
    throw new Error("useSelectedItemsContext must be used within a SelectedItemsContextProvider");
  }
  return context;
};

export default SelectedItemsContextComponent;
