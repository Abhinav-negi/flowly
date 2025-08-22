// lib/authService.ts
import {
  auth,
  googleProvider,
} from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  UserCredential,
} from "firebase/auth";

/** Sign up with email & password */
export async function signUpWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (err: any) {
    throw new Error(err.message);
  }
}

/** Login with email & password */
export async function loginWithEmail(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred during signup");
    }
  }
}

/** Sign in with Google popup */
export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    } else {
      throw new Error("Unknown error occurred during signup");
    }
  }
}
