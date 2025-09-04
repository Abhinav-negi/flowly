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
export interface Message {
  fromUid: string;
  toUid: string;
  text: string;
  createdAt: number;
  read: boolean;
}

// Updated types for the new architecture

export interface Match {
  id: string;
  users: [string, string]; // [user1Id, user2Id]
  createdAt: number;
  status: "active" | "ended" | "blocked";
  createdBy: "admin" | "system";
}

export interface DateCard {
  id: string;
  matchId: string;
  users: [string, string]; // [user1Id, user2Id]
  time: string; // ISO string
  location: string;
  description: string;
  specialInstructions?: string;

  // Response tracking
  responses: {
    [userId: string]: {
      status: "pending" | "accepted" | "declined";
      respondedAt?: number;
      declineReason?: string;
    };
  };

  // Overall status
  status: "pending" | "confirmed" | "cancelled" | "completed";
  confirmedAt?: number;
  cancelledAt?: number;

  // Reveal timing
  revealAt?: number;
  isRevealed: boolean;

  // Appeal/rescheduling
  appealRequest?: {
    requestedBy: string;
    proposedTime: string;
    proposedLocation?: string;
    status: "pending" | "accepted" | "rejected";
    createdAt: number;
  };

  createdAt: number;
  updatedAt: number;
}

export interface UserProfile {
  // Remove dateCards from user profile
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
  queueTimer: number;
  matchedUsers: string[];
  likesSent: string[];
  likesReceived: string[];

  profileComplete?: boolean;
  notifyBeforeMinutes?: number;

  createdAt?: number;
  updatedAt?: number;

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

  preferences?: {
    interestedIn: "men" | "women" | "everyone";
    distancePreference: number;
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
      height?: string;
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
