import { db, storage, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, uploadString, getDownloadURL } from "firebase/storage";

export type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";

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

  // Ensure proper data_url format
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
