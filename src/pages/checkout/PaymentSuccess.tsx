import { useEffect, useState, useContext} from "react";
import { db } from "../../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext';

import { useLocation } from "react-router-dom";

const PaymentSuccess = () => {

  const { isLogged } = useContext(AuthContext)!;
  const navigate = useNavigate();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Esto viene del auto Return Creo que se debería quitar y esto usarlo para Next
  const paramValue = queryParams.get("status"); // approved --- reject

  const [orderSaved, setOrderSaved] = useState(false);

  useEffect(() => {
    const orderData = localStorage.getItem("order");
    let order = {};

    if (orderData && typeof orderData === "string") {
      order = JSON.parse(orderData);
    }

    if (paramValue === "approved" && !orderSaved && Object.keys(order).length > 0) {
      let ordersCollection = collection(db, "orders");
      addDoc(ordersCollection, 
      { ...order,
        date: serverTimestamp(),
        status: "approved",
        paymentType: "mercado pago", 
       });
      setOrderSaved(true); // Marcar como guardado para que no se repita
    }

    // Limpia el almacenamiento local independientemente del resultado
    localStorage.removeItem("order");

     // Redirige al usuario
       // Agregar un retraso de 3 segundos antes de redirigir
       const delay = 3000; // 3 segundos
       const timeoutId = setTimeout(() => {
         if (isLogged) {
           navigate("/user-orders");
         } else { 
         navigate('/login?from=paymentsuccess');

         }
       }, delay);
   
       // Limpiar el temporizador en caso de desmontaje del componente
       return () => clearTimeout(timeoutId);
     }, [paramValue, orderSaved, isLogged, navigate]);

  return (
    <div
    style={{
      backgroundColor: 'white',
      color: 'black',
      height: '100vh', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    <h2 style={{ fontWeight: 'bold' }}>Pago Realizado con éxito</h2>
  </div>
  );
};

export default PaymentSuccess;
