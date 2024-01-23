import React, { useContext } from 'react';
import { CashRegisterContext } from '../../context/CashRegisterContext'; // Ajusta la ruta según tu estructura de archivos

const CartList: React.FC = () => {
  const { cart} = useContext(CashRegisterContext)!;

  
  return (
    <div className="cart-list">
      <h2>Carrito de Compras</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.name} - Cantidad: {item.quantity} - Precio: ${item.price * item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CartList;
