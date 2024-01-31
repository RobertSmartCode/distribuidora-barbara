import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

import { CustomerInfo } from "../type/type";

interface CustomerContextData {
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
}

interface CustomerContextProviderProps {
  children: ReactNode;
}

const CustomerContext = createContext<CustomerContextData | undefined>(undefined);

const CustomerContextComponent: React.FC<CustomerContextProviderProps> = ({ children }) => {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  // Efecto para guardar y cargar datos del localStorage
  useEffect(() => {
    const storedCustomerInfo = localStorage.getItem("customerInfo");
    if (storedCustomerInfo) {
      setCustomerInfo(JSON.parse(storedCustomerInfo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);

  const data: CustomerContextData = {
    customerInfo,
    setCustomerInfo,
  };

  return <CustomerContext.Provider value={data}>{children}</CustomerContext.Provider>;
};

const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomer must be used within a CustomerContextProvider");
  }
  return context;
};

export { CustomerContextComponent, useCustomer, CustomerContext };
