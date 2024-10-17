import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";

const loadProducts = createAsyncThunk('firestore/loadProducts', async ({ db } : { db: Firestore }) => {
  const collectionProducts = collection(db, "products");
  const products: any[] = []
  
  const querySnapshot = await getDocs(collectionProducts);
  querySnapshot.forEach((doc) => {
    products.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return products;
});

const loadProductPrices = createAsyncThunk('firestore/loadProductPrices', async ({ db, productId } : { db: Firestore, productId: string }) => {
  const collectionProducts = collection(db, "products", productId, "prices");
  const prices: any[] = []

  const querySnapshot = await getDocs(collectionProducts);
  querySnapshot.forEach((doc) => {
    prices.push({
      productId,
      id: doc.id,
      ...doc.data()
    });
  });

  return prices;
});

const buyProductAction = createAsyncThunk('firestore/buyProduct', async ({ db, currentUser, price } : { db: Firestore, currentUser: any, price: any }) => {
  const docRef = await addDoc(collection(db, "customers", currentUser.uid, "checkout_sessions"), {
    price: price.id,
    success_url: window.location.origin,
    cancel_url: window.location.origin,
  });

  return docRef;
});

export { loadProducts, loadProductPrices, buyProductAction };