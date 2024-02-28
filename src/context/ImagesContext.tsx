import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";

// Definir la interfaz para las opciones de imágenes
interface Image {
  url: string;
}

// Definir la interfaz para el contexto de imágenes
interface ImagesContextData {
  images: Image[];
  updateImages: (newImages: Image[]) => void;
  resetImages: () => void;
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

  // Al cargar el componente, intenta cargar las imágenes desde el localStorage
  useEffect(() => {
    const storedImages = localStorage.getItem("images");
    if (storedImages) {
      setImages(JSON.parse(storedImages));
    }
  }, []);

  // Actualiza el estado de las imágenes y guarda en localStorage
  const updateImages = (newImages: Image[]) => {
    setImages(newImages);
    localStorage.setItem("images", JSON.stringify(newImages));
  };

  // Restablecer las imágenes al estado inicial (vacío) y limpiar localStorage
  const resetImages = () => {
    setImages([]);
    localStorage.removeItem("images");
  };

  const data: ImagesContextData = {
    images,
    updateImages,
    resetImages,
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
