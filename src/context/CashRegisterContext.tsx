import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Product, } from '../type/type';



interface CashRegisterContextData {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  getQuantityByBarcode: (barcode: number) => number | undefined;
  removeFromCart: (barcode: string) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
  updateQuantityByBarcode: (barcode: string, newQuantity: number) => void;
  getTotalQuantity: () => number;
  checkStock: (product: Product) => boolean;
  getStockForProduct: (product: Product) => number;
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

  const getQuantityByBarcode = (barcode: number) => {
    const product = cart.find((item) => item.barcode === barcode);
    return product?.quantity;
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

  const updateQuantityByBarcode = (barcode: string, newQuantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.barcode.toString() === barcode ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  
  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkStock = (product: Product) => {
    const cartItem = cart.find((item) => item.barcode === product.barcode);
    const inventoryQuantity = product.quantities || 0;
    const cartQuantity = cartItem?.quantity || 0;
    return inventoryQuantity > cartQuantity;
  };

  const getStockForProduct = (product: Product) => {
    const cartItem = cart.find((item) => item.barcode === product.barcode);
    const inventoryQuantity = product.quantities || 0;
    const cartQuantity = cartItem?.quantity || 0;
    const availableStock = inventoryQuantity - cartQuantity;
    return Math.max(0, availableStock);
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
    getQuantityByBarcode,
    removeFromCart,
    clearCart,
    getTotalAmount,
    updateQuantityByBarcode,
    getTotalQuantity,
    checkStock,
    getStockForProduct,
  };

  return <CashRegisterContext.Provider value={data}>{children}</CashRegisterContext.Provider>;
};

export default CashRegisterContextComponent;




