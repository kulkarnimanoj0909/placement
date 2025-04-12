// firebase.js

// Import Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZAshggnVOXtJSngdcENTTC5ta395qq3k",
  authDomain: "prediction-5e589.firebaseapp.com",
  projectId: "prediction-5e589",
  storageBucket: "prediction-5e589.appspot.com",
  messagingSenderId: "478281746873",
  appId: "1:478281746873:web:0997e92b25edb992aece68",
  measurementId: "G-D7F1TYZY0M"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Export initialized services
export { app, auth, db, storage };
