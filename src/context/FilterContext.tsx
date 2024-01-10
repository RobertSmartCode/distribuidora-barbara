import React, { createContext, useState, ReactNode, useContext } from "react";

interface Filter {
  sortBy: string;
  sortOrder: "asc" | "desc";
  colors: { [key: string]: boolean };
  sizes: { [key: string]: boolean };
  priceRange: { from: string; to: string };
}

interface FilterContextData {
  filter: Filter;
  updateFilter: (newFilter: Partial<Filter>) => void;
}

export const FilterContext = createContext<FilterContextData | undefined>(undefined);

interface FilterContextComponentProps {
  children: ReactNode;
}

const FilterContextComponent: React.FC<FilterContextComponentProps> = ({ children }) => {
  const [filter, setFilter] = useState<Filter>({
    sortBy: "default",
    sortOrder: "asc",
    colors: {},
    sizes: {},
    priceRange: { from: "", to: "" },
  });

  const updateFilter = (newFilter: Partial<Filter>) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      ...newFilter,
    }));
  };

  const data: FilterContextData = {
    filter,
    updateFilter,
  };

  return <FilterContext.Provider value={data}>{children}</FilterContext.Provider>;
};

// Hook personalizado para acceder al contexto de filtros
export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilterContext must be used within a FilterContextProvider");
  }
  return context;
};

export default FilterContextComponent;
