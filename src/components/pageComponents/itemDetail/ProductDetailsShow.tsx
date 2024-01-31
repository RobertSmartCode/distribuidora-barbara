import React, { useEffect, useState } from "react";
import { doc, getDoc, collection } from "firebase/firestore";
import { db } from "../../../firebase/firebaseConfig";
import { Product } from "../../../type/type";
import { useParams } from "react-router-dom";

interface ProductDetailShowProps {}

const ProductDetailShow: React.FC<ProductDetailShowProps> = () => {
    const { id } = useParams<{ id: string | undefined }>();
    const [product, setProduct] = useState<Product | null>(null);
  
    useEffect(() => {
      const fetchProduct = async () => {
        try {
          const storedProduct = localStorage.getItem(`product_${id}`);
          if (storedProduct) {
            // Si existe en el Local Storage, usar esos datos
            setProduct(JSON.parse(storedProduct));
          } else {
            // Si no existe, obtener los datos de la base de datos
            const refCollection = collection(db, "products");
            const refDoc = doc(refCollection, id);
            const docSnapshot = await getDoc(refDoc);
  
            if (docSnapshot.exists()) {
              const productData = docSnapshot.data();
              // Guardar en el estado y en el Local Storage
              setProduct({ ...productData, id: docSnapshot.id } as Product);
              localStorage.setItem(`product_${id}`, JSON.stringify(productData));
            } else {
              console.log("El producto no existe");
            }
          }
        } catch (error) {
          console.error("Error al obtener el producto:", error);
        }
      };
  
      fetchProduct();
    }, [id]);
  
    if (!product) {
      return <div>Loading...</div>;
    }

  return (
    <div style={{ margin: "20px" }}>
      <h2>{product.title}</h2>
      <p>{product.description}</p>
      <div>
        <strong>Empaque:</strong> {product.type}
      </div>
      <div>
        <strong>Marca:</strong> {product.brand}
      </div>
      <div>
      <strong>Contenido Neto:</strong> {product.contentPerUnit} {product.isContentInGrams ? 'gramos' : 'mililitros'}
    </div>
  
      <div>
        <strong>Unidad por empaque:</strong> {product.unitperpack}
      </div>
      {/* Puedes agregar más detalles según sea necesario */}
    </div>
  );
};

export default ProductDetailShow;
