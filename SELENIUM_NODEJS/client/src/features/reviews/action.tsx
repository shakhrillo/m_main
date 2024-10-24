import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, Firestore, getDocs } from "firebase/firestore";

const loadReviews = createAsyncThunk('firestore/loadReviews', async ({ db } : { db: Firestore }) => {
  const collectionReviews = collection(db, "users/smZRSW0D6xa1o8SG7BMouKa17G0C/reviews");
  const reviews: any[] = []
  
  const querySnapshot = await getDocs(collectionReviews);
  querySnapshot.forEach((doc) => {
    reviews.push(doc.data());
  });

  return reviews;
});

export { loadReviews };
