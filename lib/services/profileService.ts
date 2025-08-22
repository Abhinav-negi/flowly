import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, serverTimestamp } from "firebase/firestore";
import {  storage } from "@/lib/firebase";
// import { sendNotification } from "@/lib/notificationService";
import { getUserDocRef, fetchUserDocSnapshot, docSnapToUserProfile } from "./firestoreUser";
import type { UserProfile } from "../types/userProfile";

/**
 * Fetch profile
 */
export async function getProfile(uid: string): Promise<UserProfile | null> {
  const snap = await fetchUserDocSnapshot(uid);
  return docSnapToUserProfile(uid, snap);
}

/**
 * Update profile
 */
export async function updateProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = getUserDocRef(uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `users/${uid}/profile/profile.${ext}`;
  const sRef = storageRef(storage, path);
  await uploadBytes(sRef, file);
  const url = await getDownloadURL(sRef);

  const userRef = getUserDocRef(uid);
  await updateDoc(userRef, { profilePicture: url, updatedAt: serverTimestamp() });

  return url;
}
