import { createAsyncThunk } from "@reduxjs/toolkit";
import { addDoc, collection, Firestore, getDocs } from "firebase/firestore";

const loadCustomer = createAsyncThunk('firestore/loadCustomer', async ({ db, customerId } : { db: Firestore, customerId: string }) => {
  const collectionCustomer = collection(db, "customers", customerId);
  let customer: any = {}
  
  const querySnapshot = await getDocs(collectionCustomer);
  querySnapshot.forEach((doc) => {
    customer = {
      id: doc.id,
      ...doc.data()
    };
  });

  return customer;
});

const loadCustomerSubscriptions = createAsyncThunk('firestore/loadCustomerSubscription', async ({ db, customerId } : { db: Firestore, customerId: string }) => {
  const collectionCustomer = collection(db, "customers", customerId, "subscriptions");
  const subscriptions: any[] = []

  const querySnapshot = await getDocs(collectionCustomer);
  querySnapshot.forEach((doc) => {
    subscriptions.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return subscriptions;
});

const loadCustomerPayments = createAsyncThunk('firestore/loadCustomerPayments', async ({ db, customerId } : { db: Firestore, customerId: string }) => {
  const collectionCustomer = collection(db, "customers", customerId, "payments");
  const payments: any[] = []

  const querySnapshot = await getDocs(collectionCustomer);
  querySnapshot.forEach((doc) => {
    payments.push({
      id: doc.id,
      ...doc.data()
    });
  });

  return payments;
});

export { loadCustomer, loadCustomerSubscriptions, loadCustomerPayments };