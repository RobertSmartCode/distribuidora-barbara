import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { PaymentMethod } from "../../../type/type";

const PAYMENT_METHODS_STORAGE_KEY = "paymentMethods";

const PaymentMethodsShow = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  useEffect(() => {
    // Intentar obtener la lista de métodos desde localStorage
    const storedMethods = JSON.parse(localStorage.getItem(PAYMENT_METHODS_STORAGE_KEY) || "[]");

    if (storedMethods.length > 0) {
      // Si hay métodos almacenados, establecerlos en el estado
      setPaymentMethods(storedMethods);
    } else {
      // Si no hay métodos almacenados, obtenerlos de Firestore
      fetchPaymentMethods();
    }
  }, []);

  useEffect(() => {
    // Este efecto se ejecutará cada vez que paymentMethods cambie
    // Aquí podrías agregar lógica para guardar en localStorage o realizar otras acciones
    savePaymentMethodsToLocalStorage();
  }, [paymentMethods]);

  const fetchPaymentMethods = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "paymentMethods"));
      const methodsData: PaymentMethod[] = [];

      querySnapshot.forEach((doc) => {
        const methodData = doc.data();
        // Asegurarse de que los datos del método sean válidos
        if (methodData.name && methodData.description) {
          methodsData.push({
            id: doc.id,
            name: methodData.name,
            description: methodData.description,
          });
        }
      });

      // Agregar Mercado Pago manualmente como método de pago predefinido
      const mercadoPagoMethod: PaymentMethod = {
        id: "mercadoPago",
        name: "Mercado Pago",
        description: "Acepta tarjetas de crédito y débito",
      };
      methodsData.push(mercadoPagoMethod);

      setPaymentMethods(methodsData);
    } catch (error) {
      console.error("Error al obtener los métodos de pago:", error);
    }
  };

  const savePaymentMethodsToLocalStorage = () => {
    localStorage.setItem(PAYMENT_METHODS_STORAGE_KEY, JSON.stringify(paymentMethods));
  };

  return (
    <div style={{ margin: "20px" }}>
      <ul>
        {paymentMethods.map((method) => (
          <li key={method.id}>
            <strong>{method.name}</strong>: {method.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PaymentMethodsShow;
