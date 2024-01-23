// StoreDataContext.tsx
import React, { createContext, useContext, useState} from "react";


import { StoreData,  SelectedLocation } from "../type/type";


interface StoreDataContextProps {
  children: React.ReactNode;
}

interface StoreDataContextValue {
  storeData: StoreData[];
  selectedLocation: SelectedLocation;
  updateStoreData: (newData: StoreData[]) => void;
  updateSelectedLocation: (location: SelectedLocation) => void;
}

const StoreDataContext = createContext<StoreDataContextValue | undefined>(
  undefined
);

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
};

const StoreDataProvider: React.FC<StoreDataContextProps> = ({ children }) => {
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    sucursal: "",
    caja: "",
  });

  const updateStoreData = (newData: StoreData[]) => {
    setStoreData(newData);
  };

  const updateSelectedLocation = (location: SelectedLocation) => {
    setSelectedLocation(location);
  };

  return (
    <StoreDataContext.Provider
      value={{
        storeData,
        selectedLocation,
        updateStoreData,
        updateSelectedLocation,
      }}
    >
      {children}
    </StoreDataContext.Provider>
  );
};

export { StoreDataProvider };

