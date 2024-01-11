
export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  unit_price: number;
  discount: number;
  stock: number;
  sizes: string[];
  colors: { color: string; sizes: string[]; quantities: number[] }[];
  sku: string;
  keywords: string;
  salesCount: string;
  featured: boolean;
  images: string[];
  createdAt: string;
  elasticity: string; 
  thickness: string; 
  breathability: string;
  season: string; 
  material: string; 
  details: string; 
  selectedColor: string; 
  selectedSize: string;
  
}

export interface Image {
  url: string;
  alt: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string; 
  selectedSize: string;  
  
  colors: {
    color: string;
    sizes: string[];
    quantities: number[];
  }[]; 
}



  export interface ColorData {
    color: string;
    sizes: string[];
    quantities: number[];
  }


export  interface ProductsFormProps {
    handleClose: () => void;
    setIsChange: (value: boolean) => void;
    productSelected: Product | null;
    setProductSelected: (product: Product | null) => void;
    products: Product[];
    updateColors: (newColors: { color: string; sizes: string[]; quantities: number[] }[]) => void;
  }

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  selected: boolean;
}



export interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  // Otros campos relevantes para un método de pago
}

export interface CustomerInfo {
  email: string;
  receiveOffers: boolean;
  country: string;
  identificationDocument: string;
  firstName: string;
  lastName: string;
  phone: string;
  isOtherPerson: boolean;
  otherPersonFirstName: string;
  otherPersonLastName: string;
  streetAndNumber: string;
  department: string;
  neighborhood: string;
  city: string;
  postalCode: string;
  province: string;
  customerType?: "finalConsumer" | "invoice"; // Nuevo campo para el tipo de cliente
  cuilCuit?: string; // Nuevo campo para CUIL/CUIT
  businessName?: string; // Nuevo campo para Razón Social

}

export interface Order {
  id: string;
  date: Date;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    unit_price: number;
    images: string
    sku:string
  }>;
  shippingCost: number;
  shippingMethod: string;
  total: number;
  paymentType:  string;
  userData: {
    email: string;
    receiveOffers: boolean;
    country: string;
    identificationDocument: string;
    firstName: string;
    lastName: string;
    phone: string;
    isOtherPerson: boolean;
    otherPersonFirstName: string;
    otherPersonLastName: string;
    streetAndNumber: string;
    department: string;
    neighborhood: string;
    city: string;
    postalCode: string;
    province: string;
    customerType?: "finalConsumer" | "invoice"; // Nuevo campo para el tipo de cliente
    cuilCuit?: string; // Nuevo campo para CUIL/CUIT
    businessName?: string; // Nuevo campo para Razón Social
  };
}