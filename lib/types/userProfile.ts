export type DietaryPreference = "veg" | "non-veg" | "vegan" | "other";
export type WorkLifeStatus = "job" | "student" | "exam" | "other";
export type Gender = "male" | "female" | "other";
export type VerificationStatus =
  | "pending"
  | "in_review"
  | "verified"
  | "rejected";

export interface Verification {
  photoVerified: boolean;
  idVerified: boolean;
  verificationStatus: VerificationStatus;
  idDocUrl?: string;
  livePhotoUrl?: string;
}

export interface AgeRangePreference {
  minAge: number;
  maxAge: number;
}

export interface DateCard {
  matchUid: string;
  time: string; // e.g., ISO string
  location: string;
  description: string;
  specialInstructions?: string;
  userAccepted?: boolean;
  otherAccepted?: boolean;
  confirmed?: boolean;
  revealAt?: number; // timestamp when date info is revealed
  appealRequest?: {
    // optional: for proposing new date/time
    proposedTime: string;
    status: "pending" | "accepted" | "rejected";
  };
  createdAt?: number;
  isRevealed: boolean;

  // ✅ Updated decline handling
  declined?: boolean;
  declinedBy?: string; // uid of the person who declined
  declineReason?: string | null; // reason text
  declinedAt?: number; // timestamp
}

export interface Message {
  fromUid: string;
  toUid: string;
  text: string;
  createdAt: number;
  read: boolean;
}

export interface UserProfile {
  userId: string;
  email: string;
  name: string;
  profilePicture?: string;
  mobileNumber?: string;
  instagramHandle?: string;
  age?: number;
  location: string;
  lat?: number;
  lng?: number;
  gender?: Gender;
  dietaryPreference?: DietaryPreference;
  workLifeStatus?: WorkLifeStatus;
  studyField?: string;
  interests?: string[];
  hobbies?: string[];
  dob?: string;
  bio?: string;
  profession?: "student" | "job";
  institute?: string;
  course?: string;
  datingPreference?: "split" | "full";

  verification: Verification;
  inQueue: boolean;
  queueTimer: number; // countdown timer in seconds
  matchedUsers: string[];
  likesSent: string[];
  likesReceived: string[];
  dateCards?: DateCard[];

  // Additional optional fields
  profileComplete?: boolean;
  notifyBeforeMinutes?: number;

  // Fixed: timestamps
  createdAt?: number;
  updatedAt?: number;

  // ✅ Personality Test Fields
  testCompleted?: boolean;
  personalityType?: string | null;
  scores?: {
    A: number;
    N: number;
    T: number;
    L: number;
    D: number;
    C: number;
  } | null;
  completedAt?: number;
  skippedAt?: number;

  // ✅ New Preferences & Lifestyle fields
  preferences?: {
    interestedIn: "men" | "women" | "everyone";
    distancePreference: number; // in km
    lifestyle: {
      workout?: "regularly" | "sometimes" | "never";
      drinking?: "yes" | "socially" | "no";
      smoking?: "yes" | "sometimes" | "no";
      education?:
        | "high_school"
        | "in_college"
        | "bachelors"
        | "masters"
        | "phd"
        | "posgraduation"
        | "undergraduation";
      lookingFor?: "life_partner" | "casual" | "friendship" | "not_sure";
      height?: string; // e.g., "5'10", "178 cm"
      religion?:
        | "hindu"
        | "muslim"
        | "christian"
        | "sikh"
        | "buddhist"
        | "jain"
        | "other";
    };
  };

  ageRangePreference?: AgeRangePreference;
  preferencesCompleted?: boolean;
}