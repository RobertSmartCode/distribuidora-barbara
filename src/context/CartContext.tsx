import React, { createContext, useState, useEffect, ReactNode } from "react";
import {Product, CartItem } from "../type/type"


interface CartContextData {
  cart: CartItem[];
  addToCart: (product: CartItem) => void;
  getQuantityById: (id: string) => number | undefined;
  clearCart: () => void;
  deleteById: (id: string, color: string, size: string) => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  productQuantities:  { [combinedKey: string]: number };
  updateQuantityById: (id: string, newQuantity: number, color: string, size: string) => void;
  selectedShippingMethod: ShippingMethod | null;
  shippingCost: number;
  updateShippingInfo: (method: ShippingMethod, cost: number) => void;
  getSelectedShippingMethod: () => ShippingMethod | null;
  getShippingCost: () => number;
  discountInfo: {
    createdAt: Date | null;
    discountPercentage: number | null;
    duration: number | null;
    maxDiscountAmount: number | null;
    minPurchaseAmount: number | null;
    promoCode: string;
    isValid: boolean;
  };
  updateDiscountInfo: (newDiscountInfo: Partial<CartContextData["discountInfo"]>) => void;
  setCustomerInformation: (info: CustomerInfo) => void;
  updateCustomerInformation: (info: Partial<CustomerInfo>) => void; 
  getCustomerInformation: () => CustomerInfo | null; 
  checkStock: (product: Product, color: string, size: string) => boolean;
  getStockForProduct: (product: Product, color: string, size: string) => number;
}



export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}


interface DiscountInfo {
  createdAt: Date | null;
  discountPercentage: number | null;
  duration: number | null;
  maxDiscountAmount: number | null;
  minPurchaseAmount: number | null;
  promoCode: string;
  isValid: boolean;
}

interface CustomerInfo {
  email: string;
  receiveOffers: boolean;
  country: string;
  identificationDocument: string;
  firstName: string;
  lastName: string;
  phone: string;
  isOtherPerson: boolean;
  otherPersonFirstName?: string;
  otherPersonLastName?: string;
  streetAndNumber: string;
  department?: string;
  neighborhood?: string;
  city: string;
  postalCode: string;
  province: string;
}



export const CartContext = createContext<CartContextData | undefined>(undefined);

interface CartContextComponentProps {
  children: ReactNode;
}

const CartContextComponent: React.FC<CartContextComponentProps> = ({ children }) => {
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [productQuantities, setProductQuantities] = useState<{ [combinedKey: string]: number }>({});
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);


  const [selectedShippingMethod, setSelectedShippingMethod] = useState<ShippingMethod | null>(null);
  const [shippingCost, setShippingCost] = useState<number>(0);
 

const updateShippingInfo = (method: ShippingMethod, cost: number) => {
  setSelectedShippingMethod(method);
  setShippingCost(cost);
};

const getSelectedShippingMethod = () => {
  return selectedShippingMethod;
};

const getShippingCost = () => {
  return shippingCost;
};

const setCustomerInformation = (info: CustomerInfo) => {
  setCustomerInfo(info);
};

const getCustomerInformation = () => {
  return customerInfo;
};


const updateCustomerInformation = (info: Partial<CustomerInfo>) => {
  if (customerInfo) {
    const updatedInfo = { ...customerInfo, ...info };
    setCustomerInformation(updatedInfo);
  }
};


  // Cargar la información del cliente en el almacenamiento local al inicio
  useEffect(() => {
    const savedCustomerInfo = JSON.parse(localStorage.getItem("customerInfo") || "null") as CustomerInfo;
    setCustomerInfo(savedCustomerInfo);
    
  }, []);

   // Actualizar el almacenamiento local cuando cambia la información del cliente

   useEffect(() => {
    localStorage.setItem("customerInfo", JSON.stringify(customerInfo));
  }, [customerInfo]);


  // Cargar el carrito y las cantidades desde el almacenamiento local al inicio
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]") as CartItem[];
    const savedQuantities = JSON.parse(localStorage.getItem("productQuantities") || "{}");
    setCart(savedCart);
    setProductQuantities(savedQuantities);
  }, []);

  // Actualizar el almacenamiento local cuando cambia el carrito o las cantidades
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  }, [cart, productQuantities]);


  const addToCart = (product: CartItem) => {
    const combinedKey = `${product.id}-${product.selectedColor}-${product.selectedSize}`;
  
    const existingProductIndex = cart.findIndex(
      (item) =>
        item.id === product.id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
    );
  
    if (existingProductIndex !== -1) {
      // Si el producto ya está en el carrito con el mismo id, color y talla, actualizamos su cantidad
      const updatedCart = [...cart];
      updatedCart[existingProductIndex] = {
        ...updatedCart[existingProductIndex],
        quantity: updatedCart[existingProductIndex].quantity + product.quantity,
      };
      setCart(updatedCart);
    } else {
      // Si es un producto nuevo en el carrito, lo agregamos
      setCart([...cart, product]);
    }
  
    // Actualizamos la cantidad del producto en el estado de cantidades
    setProductQuantities((prevQuantities) => {
      return {
        ...prevQuantities,
        [combinedKey]: (prevQuantities[combinedKey] || 0) + product.quantity,
      };
    });
   
  };
  
    
    



  const getTotalQuantity = () => {
    // Sumar la cantidad de cada producto en el carrito
    const totalQuantity = cart.reduce((acc, product) => acc + product.quantity, 0);
    return totalQuantity;
  };

  const getQuantityById = (id: string) => {
    const product = cart.find((elemento) => elemento.id === id);
    return product?.quantity;
  };

  const clearCart = () => {
    setCart([]);
    setProductQuantities({});
    localStorage.removeItem("cart");
    localStorage.removeItem("productQuantities");
  };



  const updateQuantityById = (id: string, newQuantity: number, color: string, size: string) => {
    const combinedKey = `${id}-${color}-${size}`;
  
    const updatedCart = cart.map((item) =>
      item.id === id && item.selectedColor === color && item.selectedSize === size
        ? { ...item, quantity: newQuantity }
        : item
    );
  
    setCart(updatedCart);
  
    setProductQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
  
      // Verificamos si ya existe la entrada para la clave combinada
      if (!updatedQuantities[combinedKey]) {
        updatedQuantities[combinedKey] = 0;
      }
  
      // Actualizamos la cantidad para la clave combinada
      updatedQuantities[combinedKey] = newQuantity;
  
      return updatedQuantities;
    });
  };
  

  const deleteById = (id: string, color: string, size: string) => {
    // Filtra el carrito para eliminar el elemento con el ID, color y talla dados
    const updatedCart = cart.filter(
      (item) =>
        item.id !== id ||
        item.selectedColor !== color ||
        item.selectedSize !== size
    );
  
    // Actualiza el estado del carrito
    setCart(updatedCart);
  
    // Actualiza el estado de las cantidades de productos
    setProductQuantities((prevQuantities) => {
      const combinedKey = `${id}-${color}-${size}`;
      const updatedQuantities = { ...prevQuantities };
  
      // Verifica si existe la entrada para el combinedKey
      if (updatedQuantities[combinedKey]) {
        // Elimina la entrada para el combinedKey
        delete updatedQuantities[combinedKey];
      }
  
      return updatedQuantities;
    });
  
    // Actualiza el almacenamiento local para reflejar los cambios en el carrito y las cantidades
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("productQuantities", JSON.stringify(productQuantities));
  };
  

  const getTotalPrice = () => {
    const total = cart.reduce((acc, product) => {
      const originalPrice = product?.unit_price || 0;
      const discountPercentage = product?.discount || 0;
      const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
  
      return acc + discountedPrice * product.quantity;
    }, 0);
  
    return total;
  };
  

  const [discountInfo, setDiscountInfo] = useState<DiscountInfo>({
    createdAt: null,
    discountPercentage: null,
    duration: null,
    maxDiscountAmount: null,
    minPurchaseAmount: null,
    promoCode: "",
    isValid: false,
  });
  
  const updateDiscountInfo = (newDiscountInfo: Partial<DiscountInfo>) => {
    setDiscountInfo((prevDiscountInfo) => ({
      ...prevDiscountInfo,
      ...newDiscountInfo,
    }));
  };
  

  const checkStock = (product: Product, color: string, size: string): boolean => {

    const combinedKey = `${product.id}-${color}-${size}`;

      // Obtener la cantidad disponible en el inventario
      const inventoryQuantity = product?.colors
      .find((colorObject: { color: string }) => colorObject.color === color)
      ?.quantities.find((_, index: number) => product?.colors[index]?.sizes.includes(size)) || 0;

          
    // Obtener la cantidad en el carrito
    const cartQuantity = productQuantities[combinedKey] || 0;

    // Verificar si hay suficiente stock
    const hasEnoughStock = inventoryQuantity > cartQuantity;

    return hasEnoughStock;
  };

  const getStockForProduct = (product: Product, color: string, size: string): number => {
    const combinedKey = `${product.id}-${color}-${size}`;

      // Obtener la cantidad disponible en el inventario
      const inventoryQuantity = product?.colors
      .find((colorObject: { color: string }) => colorObject.color === color)
      ?.quantities.find((_, index: number) => product?.colors[index]?.sizes.includes(size)) || 0;

          
    // Obtener la cantidad en el carrito
    const cartQuantity = productQuantities[combinedKey] || 0;

    // Calcular el stock disponible restando la cantidad en el carrito del inventario
    const availableStock = inventoryQuantity - cartQuantity;

    return Math.max(0, availableStock); // Asegurarse de que el stock no sea negativo
  };


  const data: CartContextData = {
    cart,
    addToCart,
    getQuantityById,
    clearCart,
    deleteById,
    getTotalPrice,
    getTotalQuantity,
    productQuantities,
    updateQuantityById,
    selectedShippingMethod, // Agregamos selectedShippingMethod
    shippingCost, // Agregamos shippingCost
    updateShippingInfo, // Agregamos updateShippingInfo
    getSelectedShippingMethod, // Agregamos esta función
    getShippingCost, // Agregamos esta función
    discountInfo, // Agregamos la información del descuento
    updateDiscountInfo,
    setCustomerInformation,
    getCustomerInformation,
    updateCustomerInformation,
    checkStock,
    getStockForProduct
  };

  return <CartContext.Provider value={data}>{children}</CartContext.Provider>;
};

export default CartContextComponent;
