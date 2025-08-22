export type DietaryPreference = "veg" | "non-veg" | "vegan" | "other";
export type WorkLifeStatus = "job" | "student" | "exam" | "other";
export type Gender = "male" | "female" | "other";
export type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";

export interface Verification {
  photoVerified: boolean;
  idVerified: boolean;
  verificationStatus: VerificationStatus;

  idDocUrl?: string;
  livePhotoUrl?: string;
}

export interface DateCard {
  matchUid: string;
  time: string;          // e.g., ISO string
  location: string;
  userAccepted?: boolean;
  otherAccepted?: boolean;
  confirmed?: boolean;
  revealAt?: number;      // timestamp when date info is revealed
  appealRequest?: {       // optional: for proposing new date/time
    proposedTime: string;
    status: "pending" | "accepted" | "rejected";
  };
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
  location?: string;
  gender?: Gender;
  interestedIn?: Gender[];
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
  queueTimer: number;           // countdown timer in seconds
  matchedUsers: string[];
  likesSent: string[];
  likesReceived: string[];
  dateCards?: DateCard[];

  // Additional optional fields for profile and notifications
  profileComplete?: boolean;     // computed or stored: essential fields completed
  notifyBeforeMinutes?: number;  // notify before a date
}
