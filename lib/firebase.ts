// lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

// List of required env variables
const requiredEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID",
] as const;

// Only check environment variables on the server to prevent client-side errors
if (typeof window === "undefined") {
  requiredEnv.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing Firebase env variable: ${key}`);
    }
  });
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Initialize Firebase app (reuse if already initialized)
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Services
export const auth: Auth = getAuth(app);

// ✅ Enable phone auth testing in development
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  auth.settings.appVerificationDisabledForTesting = true;
}

export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const firebaseApp: FirebaseApp = app;

// Google Auth Provider
export const googleProvider: GoogleAuthProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
