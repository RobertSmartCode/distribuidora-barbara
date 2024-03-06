import React, { createContext, useState, useEffect, ReactNode, useContext } from "react";
import { Product } from "../type/type";
import { collection, onSnapshot, query, where, QuerySnapshot, DocumentData, Query } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useSearchContext } from "../context/SearchContext";
import { useBarcodeContext } from "../context/BarcodeContext"; 
import { useCategories } from '../context/CategoriesContext'; 

interface ProductContextData {
  products: Product[];
  deleteProduct: (id: string) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
}

export const ProductContext = createContext<ProductContextData | undefined>(undefined);

interface ProductContextComponentProps {
  children: ReactNode;
}

const ProductContextComponent: React.FC<ProductContextComponentProps> = ({ children }) => {
  const { searchKeyword } = useSearchContext();
  const { barcodeKeyword } = useBarcodeContext();
  const { selectedCategory, selectedSubcategory } = useCategories(); 
  const [products, setProducts] = useState<Product[]>([]);
  const productsCollection = collection(db, "products"); 
  let queryProducts: Query<DocumentData, DocumentData> = query(collection(db, "products"));

  useEffect(() => {
    if (searchKeyword || barcodeKeyword || selectedCategory || selectedSubcategory) {
      let searchQuery = query(productsCollection); 

      if (searchKeyword) {
        searchQuery = query(
          productsCollection,
          where("keywords", ">=", searchKeyword.toLowerCase()),
          where("keywords", "<=", searchKeyword.toLowerCase() + "\uf8ff")
        ) as Query<DocumentData, DocumentData>;
      }

      if (barcodeKeyword) {
        searchQuery = query(
          productsCollection,
          where("barcode", "==", barcodeKeyword)
        ) as Query<DocumentData, DocumentData>;
      }

      if (selectedCategory && selectedCategory !== null && (!selectedSubcategory || selectedSubcategory === '')) {
        searchQuery = query(
          productsCollection,
          where("category", "==", selectedCategory.name)
        ) as Query<DocumentData, DocumentData>;
      }

      if (selectedSubcategory && selectedSubcategory !== '') {
        searchQuery = query(
          productsCollection,
          
          where("subCategory", "==", selectedSubcategory)
        ) as Query<DocumentData, DocumentData>;
      }

      queryProducts = searchQuery; 
    }

    const unsubscribe = onSnapshot(queryProducts, (snapshot: QuerySnapshot<DocumentData>) => {
      const newArr: Product[] = snapshot.docs.map((productDoc) => {
        const productData = productDoc.data();
        return {
          id: productDoc.id,
          title: productData.title || "",
          brand: productData.brand || "",
          description: productData.description || "",
          subCategory: productData.subCategory || "",
          category: productData.category || "",
          discount: productData.discount || 0,
          unitperpack: productData.unitperpack || 0,
          type: productData.type || "", 
          price: productData.price || 0, 
          quantities: productData.quantities || 0,
          barcode: productData.barcode || 0,
          contentPerUnit: productData.contentPerUnit || 0,
          isContentInGrams: productData.isContentInGrams || false,
          keywords: productData.keywords || "",
          salesCount: productData.salesCount || 0,
          onlineSalesCount: productData.onlineSalesCount || 0,
          localSalesCount: productData.localSalesCount || 0,
          featured: productData.featured || false,
          images: productData.images || [],
          createdAt: productData.createdAt || "",
          online: productData.online || false,
          location: productData.location || "",
          stockAccumulation: productData.stockAccumulation || 0,
          quantityHistory: [...(productData.quantityHistory || [])]
        };
      });
      setProducts(newArr);
    });

    return () => unsubscribe();
  }, [searchKeyword, barcodeKeyword, selectedCategory, selectedSubcategory]);

  const deleteProduct = (id: string) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== id));
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === id) {
          return { ...product, ...updatedProduct };
        }
        return product;
      });
    });
  };

  const productContextData: ProductContextData = {
    products,
    deleteProduct,
    updateProduct,
  };

  return (
    <ProductContext.Provider value={productContextData}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductContextProvider");
  }
  return context;
};

export default ProductContextComponent;
