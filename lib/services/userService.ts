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
  arrayUnion,
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
      dateCards: [],
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

  const currentTime = Date.now();
  const dateCards: DateCard[] = Array.isArray(data.dateCards)
    ? data.dateCards
        .filter(
          (card: DateCard) =>
            new Date(card.time).getTime() > currentTime - 2 * 60 * 60 * 1000
        )
        .map((card: DateCard) => ({
          ...card,
          isRevealed: currentTime >= (card.revealAt || 0),
        }))
    : [];

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

  const dateCard: DateCard = {
    matchUid,
    time: dateDetails.time,
    location: dateDetails.location,
    description: dateDetails.description,
    specialInstructions: dateDetails.specialInstructions,
    userAccepted: false,
    otherAccepted: false,
    confirmed: false,
    revealAt,
    createdAt: Date.now(),
    isRevealed: false,
  };

  const userRef = getUserDocRef(userUid);
  const matchRef = getUserDocRef(matchUid);

  await updateDoc(userRef, {
    dateCards: arrayUnion(dateCard),
    updatedAt: serverTimestamp(),
  });

  const reverseDateCard: DateCard = {
    ...dateCard,
    matchUid: userUid,
  };

  await updateDoc(matchRef, {
    dateCards: arrayUnion(reverseDateCard),
    updatedAt: serverTimestamp(),
  });

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

  return dateCard;
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
      await updateDateRevealStatus(userUid, matchUid, true);
      await updateDateRevealStatus(matchUid, userUid, true);

      await sendNotification(userUid, {
        title: "Date Details Revealed!",
        body: `Your date details are now available. The date is at ${new Date(
          dateTime
        ).toLocaleTimeString()}.`,
        type: "date_reveal",
        anchor: "/dates",
      });

      await sendNotification(matchUid, {
        title: "Date Details Revealed!",
        body: `Your date details are now available. The date is at ${new Date(
          dateTime
        ).toLocaleTimeString()}.`,
        type: "date_reveal",
        anchor: "/dates",
      });
    }, timeUntilReveal);
  }
}

/**
 * Update date reveal status
 */
async function updateDateRevealStatus(
  uid: string,
  matchUid: string,
  isRevealed: boolean
) {
  const userObj = await getUserWithDates(uid);
  if (!userObj) return;

  const updated = userObj.dateCards.map((card) =>
    card.matchUid === matchUid ? { ...card, isRevealed } : card
  );

  await updateDoc(getUserDocRef(uid), {
    dateCards: updated,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Update date card
 */
export async function updateDateCard(
  uid: string,
  matchUid: string,
  updates: Partial<DateCard>
) {
  const userObj = await getUserWithDates(uid);
  if (!userObj) return;

  const updated = userObj.dateCards.map((card) =>
    card.matchUid === matchUid ? { ...card, ...updates } : card
  );

  await updateDoc(getUserDocRef(uid), {
    dateCards: updated,
    updatedAt: serverTimestamp(),
  });

  if (updates.confirmed) {
    await sendNotification(uid, {
      title: "Date Confirmed!",
      body: `Your date with ${matchUid} is confirmed.`,
      type: "date",
      anchor: "/dates",
    });
    await sendNotification(matchUid, {
      title: "Date Confirmed!",
      body: `Your date with ${uid} is confirmed.`,
      type: "date",
      anchor: "/dates",
    });
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
  const userObj = await getUserWithDates(uid);
  if (!userObj) return;

  const currentTime = Date.now();
  const activeDateCards = userObj.dateCards.filter(
    (card) =>
      new Date(card.time).getTime() > currentTime - 2 * 60 * 60 * 1000
  );

  if (activeDateCards.length < userObj.dateCards.length) {
    await updateDoc(getUserDocRef(uid), {
      dateCards: activeDateCards,
      updatedAt: serverTimestamp(),
    });
  }
}

/**
 * Respond to a date (accept or decline) ✅ fixed version
 */
export const respondToDate = async (
  userId: string,
  matchUid: string,
  response: "accept" | "decline",
  reason?: string
) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return;

  const userData = userSnap.data() as UserProfile;

  const updatedCards = userData.dateCards?.map((card) => {
    if (card.matchUid === matchUid) {
      if (response === "accept") {
        card.userAccepted = true;
        card.declineReason = null; // clear any past rejection
      } else if (response === "decline") {
        card.userAccepted = false;
        card.declineReason = reason || "No reason provided";
      }
      card.confirmed = card.userAccepted && card.otherAccepted ? true : false;
    }
    return card;
  });

  await updateDoc(userRef, { dateCards: updatedCards, updatedAt: serverTimestamp() });

  // Notify other user
  await sendNotification(matchUid, {
    title: response === "accept" ? "Date Accepted" : "Date Declined",
    body:
      response === "accept"
        ? `${userData.name || "Your match"} accepted the date.`
        : `${userData.name || "Your match"} declined the date${
            reason ? `: "${reason}"` : "."
          }`,
    type: response === "accept" ? "date_accept" : "date_decline",
    anchor: "/dates",
  });
};
