import {
  collection,
  doc,
  setDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  onSnapshot,
  query,
  where,
  getDoc,
  DocumentData,
  writeBatch
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendNotification } from "@/lib/notificationService";
import {
  getUserDocRef,
  docSnapToUserProfile,
  fetchUserDocSnapshot,
} from "./firestoreUser";
import type {
  UserProfile,
  DateCard,
  Message,
  VerificationStatus,
} from "../types/userProfile";

/**
 * Create user profile document at signup
 */
export async function createUserProfileOnSignup(
  uid: string,
  email: string,
  name?: string
) {
  const ref = getUserDocRef(uid);
await setDoc(
  ref,
  {
    email,
    name: name || "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    verification: {
      photoVerified: false,
      idVerified: false,
      verificationStatus: "pending" as VerificationStatus,
    },
    inQueue: false,
    queueTimer: 0,
    matchedUsers: [],
    likesSent: [],
    likesReceived: [],
  },
  { merge: true }
);

  await sendNotification(uid, {
    title: "Welcome to Flowly",
    body: "Thanks for joining — complete your profile to start getting matches!",
    type: "welcome",
    anchor: "/profile",
  });
}

/**
 * Return frontend-shaped profile
 */
export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await fetchUserDocSnapshot(uid);
  return docSnapToUserProfile(uid, snap);
}

/**
 * Check if user exists
 */
export async function checkUserExists(uid: string): Promise<boolean> {
  const snap = await fetchUserDocSnapshot(uid);
  return snap.exists();
}

/**
 * Find matches for user
 */
export async function findMatchesForUser(
  uid: string
): Promise<UserProfile[]> {
  const userSnap = await fetchUserDocSnapshot(uid);
  if (!userSnap.exists()) return [];
  const userData = userSnap.data() as DocumentData;

  const interestedIn: string[] = Array.isArray(userData.interestedIn)
    ? userData.interestedIn
    : [];
  const matchedUsers: string[] = Array.isArray(userData.matchedUsers)
    ? userData.matchedUsers
    : [];

  const allUsersSnap = await getDocs(collection(db, "users"));

  const results: UserProfile[] = [];
  allUsersSnap.forEach((docSnap) => {
    const otherUid = docSnap.id;
    if (otherUid === uid) return;
    if (matchedUsers.includes(otherUid)) return;

    const otherProfile = docSnapToUserProfile(otherUid, docSnap);
    if (!otherProfile) return;

    if (
      interestedIn.length > 0 &&
      otherProfile.gender &&
      !interestedIn.includes(otherProfile.gender)
    )
      return;

    results.push(otherProfile);
  });

  return results;
}

/**
 * Queue management
 */
export async function setUserInQueue(
  uid: string,
  inQueue: boolean,
  timerSeconds = 0
) {
  const ref = getUserDocRef(uid);
  await updateDoc(ref, {
    inQueue,
    queueTimer: timerSeconds,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Add a match between two users
 */
export async function addMatch(uid: string, otherUid: string) {
  const ref = getUserDocRef(uid);
  const otherRef = getUserDocRef(otherUid);

  const snap = await getDoc(ref);
  const otherSnap = await getDoc(otherRef);

  const data = snap.data() ?? {};
  const otherData = otherSnap.data() ?? {};

  const matchedUsers: string[] = Array.isArray(data.matchedUsers)
    ? data.matchedUsers
    : [];
  const otherMatched: string[] = Array.isArray(otherData.matchedUsers)
    ? otherData.matchedUsers
    : [];

  if (!matchedUsers.includes(otherUid)) matchedUsers.push(otherUid);
  if (!otherMatched.includes(uid)) otherMatched.push(uid);

  await updateDoc(ref, { matchedUsers, updatedAt: serverTimestamp() });
  await updateDoc(otherRef, {
    matchedUsers: otherMatched,
    updatedAt: serverTimestamp(),
  });

  await sendNotification(uid, {
    title: "New Match!",
    body: "You've matched with someone new.",
    type: "match",
    anchor: "/matches",
  });
  await sendNotification(otherUid, {
    title: "New Match!",
    body: "You've matched with someone new.",
    type: "match",
    anchor: "/matches",
  });
}

/**
 * Date card helpers
 */
export async function getUserWithDates(uid: string): Promise<{
  uid: string;
  name: string;
  email?: string;
  dateCards: DateCard[];
} | null> {
  const snap = await fetchUserDocSnapshot(uid);
  if (!snap.exists()) return null;
  const data = snap.data() as DocumentData;

  // Get date cards from shared collection instead
  const dateCardsRef = collection(db, "dateCards");
  const q = query(dateCardsRef, where("users", "array-contains", uid));
  const querySnapshot = await getDocs(q);
  
  const currentTime = Date.now();
  const dateCards = querySnapshot.docs
    .map(doc => ({ id: doc.id, ...doc.data() } as DateCard))
    .filter(card => new Date(card.time).getTime() > currentTime - 2 * 60 * 60 * 1000)
    .map(card => ({
      ...card,
      isRevealed: currentTime >= (card.revealAt || 0),
    }));

  return {
    uid,
    name: data.name ?? "",
    email: data.email,
    dateCards,
  };
}
/**
 * Create a detailed date card with 10-minute reveal before date time
 */
export async function createDateCard(
  userUid: string,
  matchUid: string,
  dateDetails: {
    time: string;
    location: string;
    description: string;
    suggestedActivity?: string;
    dressCode?: string;
    specialInstructions?: string;
  }
) {
  const dateTime = new Date(dateDetails.time).getTime();
  const revealAt = dateTime - 10 * 60 * 1000;

  // Create match document if it doesn't exist
  const matchId = [userUid, matchUid].sort().join("-");
  const matchRef = doc(db, "matches", matchId);
  const matchSnap = await getDoc(matchRef);
  
  if (!matchSnap.exists()) {
    await setDoc(matchRef, {
      users: [userUid, matchUid],
      createdAt: Date.now(),
      status: "active",
      createdBy: "admin"
    });
  }

  // Create date card in shared collection
  const dateCard = {
    matchId,
    users: [userUid, matchUid] as [string, string],
    time: dateDetails.time,
    location: dateDetails.location,
    description: dateDetails.description,
    specialInstructions: dateDetails.specialInstructions,
    responses: {},
    status: "pending" as const,
    revealAt,
    isRevealed: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  const dateCardRef = doc(collection(db, "dateCards"));
  await setDoc(dateCardRef, dateCard);

  // Schedule reveal notification
  scheduleDateRevealNotification(userUid, matchUid, dateDetails.time, revealAt);

  await sendNotification(userUid, {
    title: "Date Scheduled!",
    body: "You have a date scheduled. Details will be revealed 10 minutes before the date time.",
    type: "date_scheduled",
    anchor: "/dates",
  });

  await sendNotification(matchUid, {
    title: "Date Scheduled!",
    body: "You have a date scheduled. Details will be revealed 10 minutes before the date time.",
    type: "date_scheduled",
    anchor: "/dates",
  });

  return { id: dateCardRef.id, ...dateCard };
}

/**
 * Schedule notification for date reveal
 */
function scheduleDateRevealNotification(
  userUid: string,
  matchUid: string,
  dateTime: string,
  revealAt: number
) {
  const timeUntilReveal = revealAt - Date.now();

  if (timeUntilReveal > 0) {
setTimeout(async () => {
  // Get all date cards for these users
  const dateCardsRef = collection(db, "dateCards");
  const q = query(dateCardsRef, where("users", "array-contains", userUid));
  const querySnapshot = await getDocs(q);
  
  const relevantCard = querySnapshot.docs.find(doc => {
    const data = doc.data();
    return data.users.includes(matchUid) && data.time === dateTime;
  });
  
  if (relevantCard) {
    await updateDateRevealStatus(relevantCard.id, true);
  }

  // ... rest of notifications remain same
}, timeUntilReveal);
  }
}

/**
 * Update date reveal status
 */
async function updateDateRevealStatus(
  dateCardId: string,
  isRevealed: boolean
) {
  const dateCardRef = doc(db, "dateCards", dateCardId);
  await updateDoc(dateCardRef, {
    isRevealed,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update date card
 */
export async function updateDateCard(
  dateCardId: string,
  updates: Partial<DateCard>
) {
  const dateCardRef = doc(db, "dateCards", dateCardId);
  await updateDoc(dateCardRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });

  if (updates.status === "confirmed") {
    const cardSnap = await getDoc(dateCardRef);
    if (cardSnap.exists()) {
      const cardData = cardSnap.data() as DateCard;
      const [user1, user2] = cardData.users;
      
      await sendNotification(user1, {
        title: "Date Confirmed!",
        body: "Your date has been confirmed by both parties.",
        type: "date",
        anchor: "/dates",
      });
      await sendNotification(user2, {
        title: "Date Confirmed!",
        body: "Your date has been confirmed by both parties.",
        type: "date",
      anchor: "/dates",
      });
    }
  }
}

/**
 * Messaging
 */
export async function sendMessage(
  fromUid: string,
  toUid: string,
  text: string
) {
  const message: Message = {
    fromUid,
    toUid,
    text,
    createdAt: Date.now(),
    read: false,
  };

  const ref = doc(collection(db, "users", fromUid, "messages"));
  await setDoc(ref, message);

  const ref2 = doc(collection(db, "users", toUid, "messages"));
  await setDoc(ref2, message);

  await sendNotification(toUid, {
    title: "New Message",
    body: `You have a new message from ${fromUid}`,
    type: "message",
    anchor: "/chat",
  });
}

/**
 * Real-time unread notifications count
 */
export function onUnreadNotificationsCount(
  uid: string,
  cb: (count: number) => void
) {
  const q = query(
    collection(db, "users", uid, "notifications"),
    where("read", "==", false)
  );
  return onSnapshot(q, (snap) => cb(snap.size));
}

/**
 * Verification helpers
 */
export async function getUserVerificationStatus(
  uid: string
): Promise<VerificationStatus> {
  const snap = await fetchUserDocSnapshot(uid);
  if (!snap.exists()) return "pending";

  const data = snap.data() as DocumentData;
  return data.verification?.verificationStatus || "pending";
}

export async function updateVerificationStatus(
  uid: string,
  status: VerificationStatus,
  notes?: string
) {
  const ref = getUserDocRef(uid);
  await updateDoc(ref, {
    "verification.verificationStatus": status,
    "verification.verificationNotes": notes,
    updatedAt: serverTimestamp(),
  });

  await sendNotification(uid, {
    title: "Verification Update",
    body: `Your verification status has been updated to: ${status}`,
    type: "verification",
    anchor: "/profile",
  });
}

/**
 * Clean up old dates
 */
export async function cleanupOldDates(uid: string) {
  const dateCardsRef = collection(db, "dateCards");
  const q = query(dateCardsRef, where("users", "array-contains", uid));
  const querySnapshot = await getDocs(q);
  
  const currentTime = Date.now();
  const batch = writeBatch(db);
  
  querySnapshot.docs.forEach(doc => {
    const card = doc.data() as DateCard;
    if (new Date(card.time).getTime() <= currentTime - 2 * 60 * 60 * 1000) {
      batch.delete(doc.ref);
    }
  });
  
  await batch.commit();
}


