import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
}

interface ShippingMethodsProviderProps {
  children: ReactNode;
}

interface ShippingMethodsContextValue {
  shippingMethods: ShippingMethod[] | null;
  selectedMethodId: string | null;
  updateShippingMethods: (newShippingMethods: ShippingMethod[]) => void;
  selectShippingMethod: (methodId: string) => void;
  getSelectedShippingMethod: () => ShippingMethod | null; 
}

const ShippingMethodsContext = createContext<ShippingMethodsContextValue | undefined>(undefined);

export const useShippingMethods = () => {
  const context = useContext(ShippingMethodsContext);
  if (!context) {
    throw new Error("useShippingMethods must be used within a ShippingMethodsProvider");
  }
  return context;
};

const ShippingContextComponent: React.FC<ShippingMethodsProviderProps> = ({ children }) => {
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[] | null>(null);
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "shippingMethods"), (snapshot) => {
      const newShippingMethods: ShippingMethod[] = snapshot.docs.map((shippingMethodDoc) => {
        const shippingMethodData = shippingMethodDoc.data();
        return {
          id: shippingMethodDoc.id,
          name: shippingMethodData.name || "",
          price: shippingMethodData.price || 0,
        };
      });
      setShippingMethods(newShippingMethods);
    });

    return () => unsubscribe();
  }, []);

  const updateShippingMethods = (newShippingMethods: ShippingMethod[]) => {
    setShippingMethods(newShippingMethods);
  };

  const selectShippingMethod = (methodId: string) => {
    setSelectedMethodId(methodId);
  };

  const getSelectedShippingMethod = (): ShippingMethod | null => {
    if (selectedMethodId && shippingMethods) {
      return shippingMethods.find((method) => method.id === selectedMethodId) || null;
    }
    return null;
  };

  return (
    <ShippingMethodsContext.Provider
      value={{
        shippingMethods,
        selectedMethodId,
        updateShippingMethods,
        selectShippingMethod,
        getSelectedShippingMethod,
      }}
    >
      {children}
    </ShippingMethodsContext.Provider>
  );
};

export default ShippingContextComponent;
