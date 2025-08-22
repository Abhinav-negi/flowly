// lib/services/userService.ts

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
        verificationStatus: "pending",
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
 * Find matches
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

    // gender filter
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
 * Mark a match
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
  return {
    uid,
    name: data.name ?? "",
    email: data.email,
    dateCards: Array.isArray(data.dateCards) ? data.dateCards : [],
  };
}

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
