import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../type/type';

interface CashRegisterContextData {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (barcode: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
}

export interface CartItem extends Product {
  quantity: number;
}

export const CashRegisterContext = createContext<CashRegisterContextData | undefined>(undefined);

interface CashRegisterContextComponentProps {
  children: ReactNode;
}

const CashRegisterContextComponent: React.FC<CashRegisterContextComponentProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity: number = 1) => {
    const existingProductIndex = cart.findIndex((item) => item.barcode === product.barcode);
  
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito, incrementa la cantidad del producto existente
      setCart((prevCart) =>
        prevCart.map((item, index) =>
          index === existingProductIndex ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      // Si el producto no está en el carrito, agrégalo con la cantidad especificada
      setCart((prevCart) => [...prevCart, { ...product, quantity }]);
    }
  };
  
  const removeFromCart = (barcode: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.barcode.toString() !== barcode.toString()));

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
