import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendNotification } from "@/lib/notificationService";
import type { DateCard } from "../types/userProfile";

// New functions for shared dateCards collection
export const getUserDateCards = async (userId: string) => {
  try {
    const dateCardsRef = collection(db, "dateCards");
    const q = query(dateCardsRef, where("users", "array-contains", userId));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as DateCard[];
  } catch (error) {
    console.error("Error fetching date cards:", error);
    return [];
  }
};

export const respondToDateCard = async (
  dateCardId: string,
  userId: string,
  response: "accept" | "decline",
  reason?: string
) => {
  try {
    console.log("🚀 Starting respondToDateCard", { dateCardId, userId, response, reason });
    
    const dateCardRef = doc(db, "dateCards", dateCardId);
    const dateCardSnap = await getDoc(dateCardRef);
    
    if (!dateCardSnap.exists()) {
      console.error("❌ Date card not found:", dateCardId);
      throw new Error("Date card not found");
    }

    const dateCardData = dateCardSnap.data() as DateCard;
    console.log("📄 Current date card data:", dateCardData);
    
    // Verify user is part of this date card
    if (!dateCardData.users.includes(userId)) {
      console.error("❌ User not authorized for this date card:", { userId, dateCardUsers: dateCardData.users });
      throw new Error("User not authorized for this date card");
    }

    const updatedResponses = {
      ...dateCardData.responses,
      [userId]: {
        status: response as "accepted" | "declined",
        respondedAt: Date.now(),
        ...(response === "decline" && reason && { declineReason: reason })
      }
    };
    console.log("📝 Updated responses:", updatedResponses);

    let newStatus = dateCardData.status;
    let confirmedAt = dateCardData.confirmedAt;
    let cancelledAt = dateCardData.cancelledAt;

    const allResponses = Object.values(updatedResponses);
    if (allResponses.length === 2) {
      const allAccepted = allResponses.every(r => r.status === "accepted");
      const anyDeclined = allResponses.some(r => r.status === "declined");
      
      if (allAccepted) {
        newStatus = "confirmed";
        confirmedAt = Date.now();
        console.log("✅ Date confirmed!");
      } else if (anyDeclined) {
        newStatus = "cancelled";
        cancelledAt = Date.now();
        console.log("❌ Date cancelled!");
      }
    }

    // Prepare update data
const updateData: {
  responses: Record<string, { status: "accepted" | "declined" | "pending"; respondedAt?: number; declineReason?: string }>;
  status: string;
  updatedAt: ReturnType<typeof serverTimestamp>;
  confirmedAt?: number;
  cancelledAt?: number;
} = {
  responses: updatedResponses,
  status: newStatus,
  updatedAt: serverTimestamp()
};

if (confirmedAt) updateData.confirmedAt = confirmedAt;
if (cancelledAt) updateData.cancelledAt = cancelledAt;
    
    console.log("📤 Sending update to Firestore:", updateData);

    // Try to update the document
    await updateDoc(dateCardRef, updateData);
    console.log("✅ Successfully updated date card");

    // Send notification to other user
    const otherUserId = dateCardData.users.find(uid => uid !== userId);
    if (otherUserId) {
      console.log("📨 Sending notification to:", otherUserId);
      try {
        await sendNotification(otherUserId, {
          title: response === "accept" ? "Date Accepted!" : "Date Response",
          body: response === "accept"
            ? "Your match accepted the date! Check your dates tab."
            : `Your match declined the date${reason ? `: "${reason}"` : "."}`,
          type: response === "accept" ? "date_accepted" : "date_declined",
          anchor: "/dates",
        });
        console.log("✅ Notification sent successfully");
      } catch (notifError) {
        console.warn("⚠️ Failed to send notification:", notifError);
        // Don't throw here as the main operation succeeded
      }
    }

    return true;
  } catch (error) {
    console.error("💥 Error responding to date card:", error);
    
    // Log specific Firebase error details
// Log specific Firebase error details
if (error && typeof error === 'object' && 'code' in error) {
  const firebaseError = error as { code: string; message: string };
  console.error("Firebase error code:", firebaseError.code);
  console.error("Firebase error message:", firebaseError.message);
}
    
    throw error;
  }
};