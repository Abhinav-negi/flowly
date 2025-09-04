import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  DocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import type { UserProfile } from "../types/userProfile";

/**
 * Firestore doc ref for user
 */
export function getUserDocRef(uid: string) {
  return doc(db, "users", uid);
}

/**
 * Fetch a user doc snapshot
 */
export async function fetchUserDocSnapshot(
  uid: string
): Promise<DocumentSnapshot<DocumentData>> {
  return await getDoc(getUserDocRef(uid));
}

/**
 * Convert a user doc snapshot into UserProfile
 */
export function docSnapToUserProfile(
  uid: string,
  snap: DocumentSnapshot<DocumentData>
): UserProfile | null {
  if (!snap.exists()) return null;

  const data = snap.data()!;

  return {
    userId: uid,
    email: data.email ?? "",
    name: data.name ?? "",
    profilePicture: data.profilePicture ?? data.photoURL,
    mobileNumber: data.mobileNumber ?? data.mobile,
    instagramHandle: data.instagramHandle ?? "",
    age: data.age ?? undefined,
    dob: data.dob ?? undefined,
    bio: data.bio ?? "",
    profession: data.profession ?? undefined,
    institute: data.institute ?? undefined,
    course: data.course ?? undefined,
    datingPreference: data.datingPreference ?? undefined,
    location: data.location ?? "",
    lat: data.lat ?? undefined,
    lng: data.lng ?? undefined,
    gender: data.gender,
    dietaryPreference: data.dietaryPreference,
    workLifeStatus: data.workLifeStatus,
    studyField: data.studyField,
    interests: Array.isArray(data.interests) ? data.interests : [],
    hobbies: Array.isArray(data.hobbies) ? data.hobbies : [],

    // Fixed timestamps
    createdAt: data.createdAt?.toMillis?.() ?? Date.now(),
    updatedAt: data.updatedAt?.toMillis?.() ?? Date.now(),

    verification: data.verification ?? {
      photoVerified: false,
      idVerified: false,
      verificationStatus: "pending" as const,
    },
    inQueue: data.inQueue ?? false,
    queueTimer: data.queueTimer ?? 0,
    matchedUsers: Array.isArray(data.matchedUsers) ? data.matchedUsers : [],
    likesSent: Array.isArray(data.likesSent) ? data.likesSent : [],
    likesReceived: Array.isArray(data.likesReceived) ? data.likesReceived : [],
    // dateCards: Array.isArray(data.dateCards) ? data.dateCards : [],

    // Additional optional fields
    profileComplete: data.profileComplete ?? undefined,
    notifyBeforeMinutes: data.notifyBeforeMinutes ?? undefined,

    // Personality Test Fields
    testCompleted: data.testCompleted ?? undefined,
    personalityType: data.personalityType ?? null,
    scores: data.scores ?? null,
    completedAt: data.completedAt ?? undefined,
    skippedAt: data.skippedAt ?? undefined,

    // Preferences & Lifestyle fields - mapping to the structure defined in UserProfile
    preferences: {
      interestedIn: data.preferences?.interestedIn ?? 
                   data.interestedIn ?? 
                   "everyone",
      distancePreference: data.preferences?.distancePreference ?? 
                         data.distancePreference ?? 
                         25,
      lifestyle: {
        workout: data.preferences?.lifestyle?.workout ?? 
                data.workout ?? 
                undefined,
        drinking: data.preferences?.lifestyle?.drinking ?? 
                 data.drinking ?? 
                 undefined,
        smoking: data.preferences?.lifestyle?.smoking ?? 
                data.smoking ?? 
                undefined,
        education: data.preferences?.lifestyle?.education ?? 
                  data.education ?? 
                  undefined,
        lookingFor: data.preferences?.lifestyle?.lookingFor ?? 
                   data.lookingFor ?? 
                   undefined,
        height: data.preferences?.lifestyle?.height ?? 
               data.height ?? 
               undefined,
        religion: data.preferences?.lifestyle?.religion ?? 
                 data.religion ?? 
                 undefined,
      }
    },

    ageRangePreference: data.ageRangePreference ?? (
      data.minAge && data.maxAge ? {
        minAge: data.minAge,
        maxAge: data.maxAge
      } : undefined
    ),
    preferencesCompleted: data.preferencesCompleted ?? false,
  };
}