import { useState, useContext, useEffect } from "react";
import { initMercadoPago, Wallet} from "@mercadopago/sdk-react";
import axios from "axios";
import { CartContext } from '../../context/CartContext';

interface Product {
  title: string;
  unit_price: number;
  quantity: number;
}

const MercadoPagoPayment = () => {

  const { cart } = useContext(CartContext)! || {};
  


  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const shippingCost = 0
 
  useEffect(() => {
    // Inicializa Mercado Pago con tu clave pública y la configuración de localización
    initMercadoPago(import.meta.env.VITE_PUBLICKEY, {
      locale: "es-AR",
    });
    createPreference();
  }, []);

  const createPreference = async () => {
    let newArray: Product[]; // Declaración explícita del tipo de newArray
    try {
      newArray = cart.map((product) => {
        return {
          title: product.title,
          unit_price: parseFloat(product.price.toString()), // Asegúrate de que product.price sea un número
          quantity: product.quantity,
        };
      });    
      console.log(newArray); // Mover aquí la impresión
  
      const response = await axios.post("https://backbarbara.vercel.app/create_preference", {
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
