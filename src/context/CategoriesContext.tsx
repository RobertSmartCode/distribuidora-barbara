import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

// Definición de la interfaz de categoría
interface Category {
  id: string;
  name: string;
  subCategories: string[];
}

// Props del componente CategoriesProvider
interface CategoriesProviderProps {
  children: ReactNode;
}

// Interfaz para el contexto de categorías
interface CategoriesContextValue {
  categories: Category[] | null;
  updateCategories: (newCategories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;
 
 
}

// Crear el contexto de categorías
const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

// Hook personalizado para usar el contexto de categorías
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};

// Componente principal que provee el contexto de categorías
const CategoriesContextComponent: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);

  
 
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categories"), (snapshot) => {
      const newCategories: Category[] = snapshot.docs.map((categoryDoc) => {
        const categoryData = categoryDoc.data();
        const subCategories: string[] = categoryData.subCategory || [];

        
        return {
          id: categoryDoc.id,
          name: categoryData.name || "",
          subCategories: subCategories,
        };
      });
      setCategories(newCategories);
    });
  
    return () => unsubscribe();
  }, []);
  
  

  // Función para actualizar las categorías
  const updateCategories = (newCategories: Category[]) => {
    setCategories(newCategories);
  };


  // Función para eliminar una categoría
  const deleteCategory = async (categoryId: string) => {
    const categoryRef = doc(db, "categories", categoryId);
    await deleteDoc(categoryRef);
    const updatedCategories = categories?.filter((category) => category.id !== categoryId);
    if (updatedCategories) {
      updateCategories(updatedCategories);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        updateCategories,
        deleteCategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};



export default CategoriesContextComponent;
