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
import type {
  DateCard,
} from "../types/userProfile";
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
    const dateCardRef = doc(db, "dateCards", dateCardId);
    const dateCardSnap = await getDoc(dateCardRef);
    
    if (!dateCardSnap.exists()) {
      throw new Error("Date card not found");
    }

    const dateCardData = dateCardSnap.data() as DateCard;
    
    const updatedResponses = {
      ...dateCardData.responses,
      [userId]: {
        status: response as "accepted" | "declined",
        respondedAt: Date.now(),
        ...(response === "decline" && reason && { declineReason: reason })
      }
    };

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
      } else if (anyDeclined) {
        newStatus = "cancelled";
        cancelledAt = Date.now();
      }
    }

    await updateDoc(dateCardRef, {
      responses: updatedResponses,
      status: newStatus,
      ...(confirmedAt && { confirmedAt }),
      ...(cancelledAt && { cancelledAt }),
      updatedAt: serverTimestamp()
    });

    const otherUserId = dateCardData.users.find(uid => uid !== userId);
    if (otherUserId) {
      await sendNotification(otherUserId, {
        title: response === "accept" ? "Date Accepted!" : "Date Response",
        body: response === "accept" 
          ? "Your match accepted the date! Check your dates tab."
          : `Your match declined the date${reason ? `: "${reason}"` : "."}`,
        type: response === "accept" ? "date_accepted" : "date_declined",
        anchor: "/dates",
      });
    }

    return true;
  } catch (error) {
    console.error("Error responding to date card:", error);
    throw error;
  }
};
