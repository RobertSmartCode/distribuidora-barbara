
export interface Product {
  id: string;
  title: string;
  brand: string;
  description: string;
  category: string;
  subCategory: string;
  discount: number;
  unitperpack: number;
  type: string;
  price: number;
  quantities: number;
  barcode: string;
  contentPerUnit: number;  
  isContentInGrams: boolean;
  keywords: string;
  salesCount: number;
  onlineSalesCount?: number;
  localSalesCount?: number;
  featured: boolean;
  images: string[];
  createdAt: string;
  online: boolean;
  location: string;
  quantity?: number;
  stockAccumulation?: number;
  quantityHistory?: { quantityAdded: number; date: string; }[];
}

export interface OrderOnline {
  id: string;
  date: Date;
  timestamp: Date;
  completedTimestamp: Date;
  items: Array<{
    id: string;
    title: string;
    quantity: number;
    price: number;
    images: string;
    barcode:string;
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
    customerType?: "finalConsumer" | "invoice"; 
    cuilCuit?: string; 
    businessName?: string; 
  };
}

export interface Orderbox {
  id: string;
  customerId: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  products: Productbox[];
}

export interface Productbox {
  id: string;
  title: string;
  quantity: number;
  price: number;
  images: string[];
  barcode:number;
}

export interface CompletedOrderbox {
  id: string;
  customerId: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  paymentMethod: string;
  products: Productbox[];
  
}



export interface ProductsEditDesktopProps {
  productSelected: Product | null;
  setProductSelected: React.Dispatch<React.SetStateAction<Product | null>>;
  handleClose: () => void;
}


// Asegúrate de ajustar los tipos según tus necesidades reales
export interface ProductsFormDesktopProps {
  productSelected: Product | null;
  setProductSelected: React.Dispatch<React.SetStateAction<Product | null>>;
  handleClose: () => void;
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  products: Product[]; // Agrega esta línea
}



export interface Image {
  url: string;
}

export interface CartItem extends Product {
  quantity: number;
}


export  interface ProductsFormProps {
    handleClose: () => void;
    setIsChange: (value: boolean) => void;
    productSelected: Product | null;
    setProductSelected: (product: Product | null) => void;
    products: Product[];
 
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
  customerType?: "finalConsumer" | "invoice"; 
  cuilCuit?: string; 
  businessName?: string;

}

export interface StoreData {
  id?: string;
  storeName: string;
  logo?: string;
  description: string;
  address: string;
  phoneNumber: string;
  email: string;
  website: string;
  socialMedia: SocialMedia;
  businessHours: string;
  branches?: Branch[];
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
  linkedin?: string;
}


export interface Branch {
  id?: string; 
  name: string;
  address: string;
  phone: string;
  boxes: Box[];
}

export interface Box {
   id: string;
  number: string;
  location: string;
  branchIndex: number; 
}

export interface SelectedLocation {
  sucursal: string;
  caja: string;
}



