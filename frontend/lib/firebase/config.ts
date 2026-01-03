// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEgyPX28K34vzlR7EJD-XqMgQs6kyn-1A",
  authDomain: "todo-list-7dadc.firebaseapp.com",
  projectId: "todo-list-7dadc",
  storageBucket: "todo-list-7dadc.firebasestorage.app",
  messagingSenderId: "285820616966",
  appId: "1:285820616966:web:0c3884f7e7e3edb657de87",
  measurementId: "G-DTPDMEY843"
};

// Initialize Firebase (prevent re-initialization in hot reload)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize Firebase Auth and Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
