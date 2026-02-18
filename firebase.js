// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3nOjbm3dyuTPT1EW3tdhLS7EElQV09l0",
  authDomain: "ecosalud-7f228.firebaseapp.com",
  projectId: "ecosalud-7f228",
  storageBucket: "ecosalud-7f228.firebasestorage.app",
  messagingSenderId: "574517793463",
  appId: "1:574517793463:web:98d109427cb7c50f71f332",
  measurementId: "G-Q082CE8D4Y"
};

// Initialize Firebase
let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

try {
    const analytics = getAnalytics(app);
} catch (e) {
    console.log("Firebase analytics not available in this environment");
}

export const auth = getAuth(app);
