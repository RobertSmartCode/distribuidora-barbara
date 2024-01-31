import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Product, CartItem } from "../type/type";

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  getQuantityByBarcode: (barcode: number) => number | undefined;
  clearCart: () => void;
  deleteByBarcode: (barcode: number) => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  updateQuantityByBarcode: (barcode: number, newQuantity: number) => void;
  checkStock: (product: Product) => boolean;
  getStockForProduct: (product: Product) => number;
}

export const CartContext = createContext<CartContextData | undefined>(undefined);

interface CartContextComponentProps {
  children: ReactNode;
}

const CartContextComponent: React.FC<CartContextComponentProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Cargar el carrito desde el almacenamiento local al inicio
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    setCart(savedCart);
  }, []);

  // Actualizar el almacenamiento local cuando cambia el carrito
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: CartItem) => {
    const existingProduct = cart.find((item) => item.barcode === product.barcode);

    if (existingProduct) {
      // Si el producto ya está en el carrito, actualizamos su cantidad
      const updatedCart = cart.map((item) =>
        item.barcode === product.barcode ? { ...item, quantity: item.quantity + product.quantity } : item
      );
      setCart(updatedCart);
    } else {
      // Si es un producto nuevo en el carrito, lo agregamos
      setCart([...cart, product]);
    }
  };

  const getQuantityByBarcode = (barcode: number) => {
    const product = cart.find((item) => item.barcode === barcode);
    return product?.quantity;
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  const updateQuantityByBarcode = (barcode: number, newQuantity: number) => {
    const updatedCart = cart.map((item) =>
      item.barcode === barcode ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const deleteByBarcode = (barcode: number) => {
    const updatedCart = cart.filter((item) => item.barcode !== barcode);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    const total = cart.reduce((acc, item) => {
      const discountedPrice = item.price * (1 - item.discount / 100);
      return acc + discountedPrice * item.quantity;
    }, 0);
    return total;
  };

  const getTotalQuantity = () => {
    const totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    return totalQuantity;
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

  const data: CartContextData = {
    cart,
    addToCart,
    getQuantityByBarcode,
    clearCart,
    deleteByBarcode,
    getTotalPrice,
    getTotalQuantity,
    updateQuantityByBarcode,
    checkStock,
    getStockForProduct,
  };

  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};

export default CartContextComponent;
