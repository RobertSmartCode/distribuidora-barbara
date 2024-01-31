import { useState, useContext, useEffect } from "react";
import { initMercadoPago, Wallet} from "@mercadopago/sdk-react";
import axios from "axios";
import { CartContext } from '../../context/CartContext';
import { useShippingMethods } from '../../context/ShippingMethodsContext';
import { useCustomer} from '../../context/CustomerContext';


const MercadoPagoPayment = () => {

 
  const { cart, getTotalPrice } = useContext(CartContext)! || {};
  const { getSelectedShippingMethod } = useShippingMethods()!;
  const { customerInfo } = useCustomer()!;
  const subtotal = getTotalPrice ? getTotalPrice() : 0;
  const selectedShippingMethod = getSelectedShippingMethod();

  const [preferenceId, setPreferenceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const shippingCost = selectedShippingMethod ? selectedShippingMethod.price : 0;

 
  let total = (subtotal + shippingCost)


const userData = customerInfo




  useEffect(() => {
    // Inicializa Mercado Pago con tu clave pública y la configuración de localización
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, {
      locale: "es-AR",
    });

    
    createPreference();


    let order = {
      userData,
      items: cart,
      shippingCost,
      shippingMethod: selectedShippingMethod ? selectedShippingMethod.name : 'No shipping method',
      total

      
    };
    localStorage.setItem("order", JSON.stringify(order));
   
  }, []);


  const createPreference = async () => {
    const newArray = cart.map((product) => {
      return {
        title: product.title,
        unit_price: product.price,
        quantity: product.quantity,
      };
    });

    try {
      const response = await axios.post("https://back-ecommerce-phi.vercel.app/create_preference", {
        items: newArray,
        shipment_cost: shippingCost
      });

      const { id } = response.data;
      setPreferenceId(id);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px", marginBottom: "20px", maxWidth: "300px", margin: "auto" }}>
    <h2 style={{ color: "black" }}>Mercado Pago</h2>
    {isLoading ? (
      <h4 style={{ color: "black" }}>Cargando...</h4>
    ) : (
      preferenceId && (
        <Wallet initialization={{ preferenceId, redirectMode: "self" }} />
      )
    )}
  </div>
  
  );
};

export { MercadoPagoPayment };
