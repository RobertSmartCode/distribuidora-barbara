import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';
import { StoreData, SelectedLocation } from "../type/type";

interface StoreDataContextProps {
  children: React.ReactNode;
}

interface StoreDataContextValue {
  storeData: StoreData[];
  selectedLocation: SelectedLocation;
  updateStoreData: (newData: StoreData[]) => void;
  updateSelectedLocation: (location: SelectedLocation) => void;
}

const StoreDataContext = createContext<StoreDataContextValue | undefined>(undefined);

export const useStoreData = () => {
  const context = useContext(StoreDataContext);
  if (!context) {
    throw new Error("useStoreData must be used within a StoreDataProvider");
  }
  return context;
};

const StoreDataContextComponent: React.FC<StoreDataContextProps> = ({ children }) => {
  const [storeData, setStoreData] = useState<StoreData[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    sucursal: "",
    caja: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storeCollection = collection(db, "storeData");
        const storeQuery = query(storeCollection, orderBy("storeName")); // Ordena por nombre de tienda
        const unsubscribe = onSnapshot(storeQuery, (snapshot) => {
          const newStoreData: StoreData[] = snapshot.docs.map((storeDoc) => {
            const storeData = storeDoc.data();
            return {
              id: storeDoc.id,
              storeName: storeData.storeName || "",
              logo: storeData.logo || "",
              description: storeData.description || "",
              address: storeData.address || "",
              phoneNumber: storeData.phoneNumber || "",
              email: storeData.email || "",
              website: storeData.website || "",
              socialMedia: storeData.socialMedia || {},
              businessHours: storeData.businessHours || "",
            };
          });
          setStoreData(newStoreData);
        });
        return () => unsubscribe();
      } catch (error) {
        console.error("Error al obtener los datos de la tienda:", error);
      }
    };
    fetchData();
  }, []);

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

export default StoreDataContextComponent;
