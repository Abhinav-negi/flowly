import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export interface NotificationPayload {
  title: string;
  body: string;
  type?: string; // e.g., "profile", "verification", "matchmaking"
  anchor?: string; // optional anchor for scroll
}

/**
 * Send a notification to a specific user
 */
export async function sendNotification(
  uid: string,
  payload: NotificationPayload
) {
  const notificationsRef = collection(db, "users", uid, "notifications");
  await addDoc(notificationsRef, {
    ...payload,
    read: false,
    createdAt: serverTimestamp(),
  });
}
