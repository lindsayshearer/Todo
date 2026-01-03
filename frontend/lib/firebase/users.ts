import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  Timestamp 
} from "firebase/firestore";
import { db } from "./config";

// User schema/type definition
export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Type for creating a new user (timestamps added automatically)
export interface CreateUserData {
  uid: string;
  name: string;
  email: string;
}

// Type for updating user data
export interface UpdateUserData {
  name?: string;
  email?: string;
}

// Create a new user document in Firestore
export async function createUser(data: CreateUserData): Promise<void> {
  await setDoc(doc(db, "users", data.uid), {
    uid: data.uid,
    name: data.name,
    email: data.email,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

// Get a user by their UID
export async function getUser(uid: string): Promise<User | null> {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as User;
  }
  
  return null;
}

// Update a user's data
export async function updateUser(uid: string, data: UpdateUserData): Promise<void> {
  const docRef = doc(db, "users", uid);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

