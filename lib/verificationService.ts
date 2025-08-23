import { db, storage, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL, deleteObject } from "firebase/storage";

export type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";

/**
 * Delete a file from Firebase Storage given its URL
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  if (!fileUrl) return;
  try {
    const storageRef = ref(storage, fileUrl.split("/o/")[1].split("?")[0]); // Decode path from URL
    await deleteObject(storageRef);
    console.log(`Deleted previous file: ${fileUrl}`);
  } catch (err) {
    console.warn(`Failed to delete file: ${fileUrl}`, err);
  }
}

/**
 * Upload ID card
 */
export async function uploadIdCard(file: File): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const storageRef = ref(storage, `verifications/${user.uid}/idcard_${Date.now()}.jpg`);
  await uploadBytes(storageRef, file);

  const url = await getDownloadURL(storageRef);

  await setDoc(doc(db, "verifications", user.uid), {
    idDocUrl: url,
    status: "in_review",
    updatedAt: Date.now(),
  }, { merge: true });

  return url;
}

/**
 * Upload selfie (expects a full data URL from webcam)
 */
export async function uploadSelfie(imageDataUrl: string): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user");

  const validDataUrl = imageDataUrl.startsWith("data:") ? imageDataUrl : `data:image/jpeg;base64,${imageDataUrl}`;

  const storageRef = ref(storage, `verifications/${user.uid}/selfie_${Date.now()}.jpg`);
  await uploadString(storageRef, validDataUrl, "data_url");

  const url = await getDownloadURL(storageRef);

  await setDoc(doc(db, "verifications", user.uid), {
    livePhotoUrl: url,
    status: "in_review",
    updatedAt: Date.now(),
  }, { merge: true });

  return url;
}
