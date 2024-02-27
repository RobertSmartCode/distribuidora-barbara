import React, { createContext, useState, ReactNode, useContext } from "react";
import { Product } from "../type/type";
// Definir la interfaz para el contexto de búsqueda
interface SearchContextData {
  searchKeyword: string;
  updateSearchKeyword: (newSearchKeyword: string) => void;
  searchResults: Product[];
  setSearchResults: React.Dispatch<React.SetStateAction<Product[]>>;
}

// Crear el contexto de búsqueda
export const SearchContext = createContext<SearchContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de búsqueda
interface SearchContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de búsqueda
const SearchContextComponent: React.FC<SearchContextComponentProps> = ({ children }) => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const updateSearchKeyword = (newSearchKeyword: string) => {
    setSearchKeyword(newSearchKeyword);
  };

  const data: SearchContextData = {
    searchKeyword,
    updateSearchKeyword,
    searchResults,
    setSearchResults,
  };

  return <SearchContext.Provider value={data}>{children}</SearchContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de búsqueda
export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};

export default SearchContextComponent;


