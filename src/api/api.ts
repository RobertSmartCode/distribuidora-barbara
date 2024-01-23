// api.ts
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export const fetchStoreData = (callback: (newData: any) => void) => {
  const storeDataCollection = collection(db, "storeData");

  const unsubscribe = onSnapshot(storeDataCollection, (querySnapshot) => {
    const storeDataArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(storeDataArray);
  });

  return () => unsubscribe();
};
