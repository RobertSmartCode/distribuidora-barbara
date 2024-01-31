// PaymentMethodsProvider.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {collection, onSnapshot} from "firebase/firestore";
import { db } from '../firebase/firebaseConfig'; // Ajusta la ruta según tu estructura de carpetas

// Interface para los datos de los métodos de pago
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  // Agrega otras propiedades específicas de los métodos de pago si es necesario
}

// Props del componente PaymentMethodsProvider
interface PaymentMethodsProviderProps {
  children: ReactNode;
}

// Interface para el contexto
interface PaymentMethodsContextValue {
  paymentMethods: PaymentMethod[] | null;
  updatePaymentMethods: (newPaymentMethods: PaymentMethod[]) => void;
}

// Crear el contexto
const PaymentMethodsContext = createContext<PaymentMethodsContextValue | undefined>(undefined);

// Hook personalizado para usar el contexto
export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error("usePaymentMethods must be used within a PaymentMethodsProvider");
  }
  return context;
};

// Componente principal que provee el contexto
const PaymentMethodsContextComponent: React.FC<PaymentMethodsProviderProps> = ({ children }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[] | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "paymentMethods"), (snapshot) => {
      const newPaymentMethods: PaymentMethod[] = snapshot.docs.map((paymentMethodDoc) => {
        const paymentMethodData = paymentMethodDoc.data();
        return {
          id: paymentMethodDoc.id,
          name: paymentMethodData.name || "",
          description: paymentMethodData.description || "",
          // Agrega otras propiedades específicas de los métodos de pago si es necesario
        };
      });
      setPaymentMethods(newPaymentMethods);
    });

    return () => unsubscribe();
  }, []);

  const updatePaymentMethods = (newPaymentMethods: PaymentMethod[]) => {
    setPaymentMethods(newPaymentMethods);
  };

  return (
    <PaymentMethodsContext.Provider
      value={{
        paymentMethods,
        updatePaymentMethods,
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export default  PaymentMethodsContextComponent ;
