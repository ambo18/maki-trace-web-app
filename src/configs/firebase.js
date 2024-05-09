// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "app-d-and-er-application.firebaseapp.com",
  databaseURL: "https://app-d-and-er-application-default-rtdb.firebaseio.com",
  projectId: "app-d-and-er-application",
  storageBucket: "app-d-and-er-application.appspot.com",
  messagingSenderId: "802049124908",
  appId: "1:802049124908:android:aefc93fa7d5614503f3f89",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getDatabase(app);
