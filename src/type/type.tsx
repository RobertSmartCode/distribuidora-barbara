
export interface Product {
  id: string;
  title: string;
  brand: string;
  description: string;
  category: string;
  sector?: string;
  discount: number;
  unitperpack: number;
  type: string;
  cost: number;
  taxes: number;
  profitMargin: number;
  price: number;
  quantities: number;
  barcode: number;
  contentPerUnit: number;  
  isContentInGrams: boolean;
  keywords: string;
  salesCount: string;
  featured: boolean;
  images: string[];
  createdAt: string;
  online: boolean;
  location: string;
  quantity?: number; 
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


// types.ts
export interface Order {
  id: string;
  customerName: string;
  totalAmount: number;
  timestamp: Date;
  completedTimestamp: Date;
  // Agrega más propiedades según la estructura de tu orden
}




const transformBlobToFirebase = async (blobUrl: string): Promise<string | null> => {
  if (!blobUrl.startsWith('blob:')) {
    return null; // No es una URL blob
  }

  try {
    // Obtén el blob directamente de la URL local
    const blob = await fetch(blobUrl).then(response => response.blob());

    // Crea un objeto File a partir del Blob
    const file = new File([blob], 'filename', { lastModified: new Date().getTime() });

    // Carga el archivo a Firebase y obtén la nueva URL
    const firebaseUrl = await uploadFile(file);

    return firebaseUrl;
  } catch (error) {
    console.error('Error al transformar la URL blob a Firebase:', error);
    return null;
  }
};

const resizeImage = async (file: Blob, targetWidth: number, targetHeight: number): Promise<Blob> => {
  return new Promise((resolve) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Redimensionar la imagen en el lienzo
      ctx?.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Obtener el Blob de la imagen redimensionada
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          // En caso de error, resolver con un Blob vacío
          resolve(new Blob());
        }
      }, 'image/jpeg', 0.9); // Puedes ajustar la calidad aquí (0.9 es una calidad alta)
    };

    img.src = URL.createObjectURL(file);
  });
};

const normalizeImages = async (imageFiles: Image[]) => {
  const normalizedImages: Image[] = await Promise.all(
    imageFiles.map(async (image) => {
      const url = image.url;

      if (url.startsWith('blob:')) {
        // Si es una URL local (blob), redimensiona la imagen y cárgala a Firebase
        const resizedBlob = await resizeImage(
          await fetch(url).then((response) => response.blob()),
          300,
          300
        );
        const firebaseUrl = await transformBlobToFirebase(URL.createObjectURL(resizedBlob));

        return { url: firebaseUrl || url }; // Devuelve la URL de Firebase si está disponible, de lo contrario, devuelve la URL original
      } else {
        // Si es una URL de Firebase o cualquier otro tipo, déjala tal como está
        return { url };
      }
    })
  );

  return normalizedImages;
};
