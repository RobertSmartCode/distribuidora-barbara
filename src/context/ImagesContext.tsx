import React, { createContext, useState, ReactNode, useContext } from "react";

// Definir la interfaz para las opciones de imágenes
interface Image {
  url: string;
  alt: string;
}

// Definir la interfaz para el contexto de imágenes
interface ImagesContextData {
  images: Image[];
  updateImages: (newImages: Image[]) => void;
}

// Crear el contexto de imágenes
export const ImagesContext = createContext<ImagesContextData | undefined>(undefined);

// Definir las propiedades del componente de contexto de imágenes
interface ImagesContextComponentProps {
  children: ReactNode;
}

// Crear el componente de contexto de imágenes
const ImagesContextComponent: React.FC<ImagesContextComponentProps> = ({ children }) => {
  const [images, setImages] = useState<Image[]>([]);

  const updateImages = (newImages: Image[]) => {
    setImages(newImages);
  };

  const data: ImagesContextData = {
    images,
    updateImages,
  };

  return <ImagesContext.Provider value={data}>{children}</ImagesContext.Provider>;
};

// Crear el hook personalizado para acceder al contexto de imágenes
export const useImagesContext = () => {
  const context = useContext(ImagesContext);
  if (!context) {
    throw new Error("useImagesContext must be used within an ImagesContextProvider");
  }
  return context;
};

export default ImagesContextComponent;
