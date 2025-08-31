import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/lib/types/userProfile";

type InterestedIn = "men" | "women" | "everyone";
type LookingFor = "life_partner" | "casual" | "friendship" | "not_sure";
type Religion = "hindu" | "muslim" | "christian" | "sikh" | "buddhist" | "jain" | "other";
type Workout = "regularly" | "sometimes" | "never";
type Drinking = "yes" | "socially" | "no";
type Smoking = "yes" | "sometimes" | "no";
type Education = "high_school" | "in_college" | "bachelors" | "masters" | "phd" |"posgraduation" |"undergraduation";
type Gender = "male" | "female" | "other";

export interface OnboardingPayload {
  name: string;
  gender: Gender;
  interestedIn: InterestedIn;
  lookingFor: LookingFor;
  religion: Religion;
  distancePreference: number; // km
  minAge: number;
  maxAge: number;
  heightString: string;      // "178 cm" or "5'6"
  // Optional lifestyle fields
  workout?: Workout;
  drinking?: Drinking;
  smoking?: Smoking;
  education?: Education;
}

export async function saveOnboardingProfile(uid: string, payload: OnboardingPayload): Promise<void> {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  const now = Date.now();

  const preferences: NonNullable<UserProfile["preferences"]> = {
    interestedIn: payload.interestedIn,
    distancePreference: payload.distancePreference,
    lifestyle: {
      workout: payload.workout,
      drinking: payload.drinking,
      smoking: payload.smoking,
      education: payload.education,
      lookingFor: payload.lookingFor,
      height: payload.heightString,
      religion: payload.religion,
    },
  };

  const toMerge: Partial<UserProfile> = {
    userId: uid,
    name: payload.name,
    gender: payload.gender,
    preferences,
    ageRangePreference: {
      minAge: payload.minAge,
      maxAge: payload.maxAge,
    },
    preferencesCompleted: true,
    updatedAt: now,
    createdAt: snap.exists() ? snap.data().createdAt ?? now : now,
  };

  // Merge; never overwrite whole doc; avoids “type overlap” issues.
  await setDoc(userRef, toMerge, { merge: true });
}
