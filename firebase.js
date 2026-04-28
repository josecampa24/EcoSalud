// Import the functions you need from the SDKs
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; //  <-- Agregado

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3nOjbm3dyuTPT1EW3tdhLS7EElQV09l0",
  authDomain: "ecosalud-7f228.firebaseapp.com",
  projectId: "ecosalud-7f228",
  storageBucket: "ecosalud-7f228.appspot.com", // <-- Corregido para que coincida con el estándar de Firebase
  messagingSenderId: "574517793463",
  appId: "1:574517793463:web:98d109427cb7c50f71f332",
};

// Initialize Firebase safely
let app;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); //  <-- EXPORTAMOS Storage
