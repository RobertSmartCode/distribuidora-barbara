import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { db } from '../firebase/firebaseConfig';

// Define la interfaz de categoría
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
  selectedCategory: Category | null;
  selectedSubcategory: string | null;
  updateCategories: (newCategories: Category[]) => void;
  deleteCategory: (categoryId: string) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedSubcategory: (subcategory: string | null) => void;
}

// Crea el contexto de categorías
const CategoriesContext = createContext<CategoriesContextValue | undefined>(undefined);

// Hook personalizado para usar el contexto de categorías
export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) {
    throw new Error("useCategories debe ser utilizado dentro de un CategoriesProvider");
  }
  return context;
};

// Componente principal que provee el contexto de categorías
const CategoriesProvider: React.FC<CategoriesProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  useEffect(() => {
    // Carga las categorías desde Firestore
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
      // Guarda las categorías en el almacenamiento local
      localStorage.setItem("categories", JSON.stringify(newCategories));
      setCategories(newCategories);
    });

    return () => unsubscribe();
  }, []);

  // Función para actualizar las categorías
  const updateCategories = (newCategories: Category[]) => {
    localStorage.setItem("categories", JSON.stringify(newCategories));
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
        selectedCategory,
        selectedSubcategory,
        updateCategories,
        deleteCategory,
        setSelectedCategory,
        setSelectedSubcategory,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export default CategoriesProvider;
