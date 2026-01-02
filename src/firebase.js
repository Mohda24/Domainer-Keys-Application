// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// TODO: Replace with your actual Firebase config object
const firebaseConfig = {
  
  apiKey: "AIzaSyAfo7RlbgSxAF88p3Co2ffFXm7SDTjDhUY",
  authDomain: "mohdadominer-keys.firebaseapp.com",
  projectId: "mohdadominer-keys",
  storageBucket: "mohdadominer-keys.firebasestorage.app",
  messagingSenderId: "654438318420",
  appId: "1:654438318420:web:9e23e7973d369af92808c1"

};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
