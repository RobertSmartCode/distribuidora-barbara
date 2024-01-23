import { Firestore, getFirestore, collection, query, where, getDocs, DocumentData } from 'firebase/firestore';

export const getProductById = async (productId: string): Promise<DocumentData[]> => {
  const firestore: Firestore = getFirestore();
  const productsCollection = collection(firestore, 'products');
  const q = query(productsCollection, where('id', '==', productId));

  try {
    const querySnapshot = await getDocs(q);
    const products: DocumentData[] = [];

    querySnapshot.forEach((doc) => {
      const productData = doc.data();
      products.push(productData);
    });

    return products;
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    throw error;
  }
};
