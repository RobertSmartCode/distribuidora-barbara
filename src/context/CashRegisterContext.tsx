import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface CashRegisterContextData {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const CashRegisterContext = createContext<CashRegisterContextData | undefined>(undefined);

interface CashRegisterContextComponentProps {
  children: ReactNode;
}

const CashRegisterContextComponent: React.FC<CashRegisterContextComponentProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: CartItem) => {
    const existingProduct = cart.find((item) => item.id === product.id);

    if (existingProduct) {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
        )
      );
    } else {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalAmount = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Guardar y cargar el carrito desde el almacenamiento local al inicio
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cashRegisterCart') || '[]') as CartItem[];
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cashRegisterCart', JSON.stringify(cart));
  }, [cart]);

  const data: CashRegisterContextData = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalAmount,
  };

  return <CashRegisterContext.Provider value={data}>{children}</CashRegisterContext.Provider>;
};

export default CashRegisterContextComponent;
