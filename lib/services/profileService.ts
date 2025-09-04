import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { updateDoc, serverTimestamp, doc, getDoc ,getDocFromServer} from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { getUserDocRef, fetchUserDocSnapshot, docSnapToUserProfile } from "./firestoreUser";
import type { UserProfile } from "@/lib/types/userProfile";

/**
 * Fetch profile with better debugging and cache handling
 */
export async function getProfile(uid: string): Promise<UserProfile | null> {
  try {
    console.log("🔍 getProfile called for uid:", uid);
    
    // Method 1: Use your existing function
    const snap = await fetchUserDocSnapshot(uid);
    const profile1 = docSnapToUserProfile(uid, snap);
    console.log("📄 Method 1 (existing) result:", {
      exists: snap.exists(),
      testCompleted: profile1?.testCompleted,
      preferencesCompleted: profile1?.preferencesCompleted,
      personalityType: profile1?.personalityType
    });

    // Method 2: Direct getDoc call for comparison
    const userRef = doc(db, 'users', uid);
    const directSnap = await getDoc(userRef);
    
    console.log("📄 Method 2 (direct) raw data:", directSnap.exists() ? directSnap.data() : 'Document does not exist');
    
    if (directSnap.exists()) {
      const rawData = directSnap.data();
      console.log("🔍 Raw testCompleted value:", rawData.testCompleted);
      console.log("🔍 Raw preferencesCompleted value:", rawData.preferencesCompleted);
      console.log("🔍 Raw testCompleted type:", typeof rawData.testCompleted);
      console.log("🔍 Raw preferencesCompleted type:", typeof rawData.preferencesCompleted);
      
      // Create profile directly from raw data as fallback
      const directProfile: UserProfile = {
        userId: uid,
        email: rawData.email || '',
        name: rawData.name || '',
        location: rawData.location || '',
        verification: rawData.verification || {
          photoVerified: false,
          idVerified: false,
          verificationStatus: 'pending' as const
        },
        inQueue: rawData.inQueue || false,
        queueTimer: rawData.queueTimer || 0,
        matchedUsers: rawData.matchedUsers || [],
        likesSent: rawData.likesSent || [],
        likesReceived: rawData.likesReceived || [],
        // Personality test fields - direct mapping
        testCompleted: rawData.testCompleted,
        personalityType: rawData.personalityType,
        scores: rawData.scores,
        completedAt: rawData.completedAt,
        skippedAt: rawData.skippedAt,
        // ✅ CRITICAL: Ensure preferencesCompleted is mapped correctly
        preferencesCompleted: rawData.preferencesCompleted,
        // Other optional fields
        profilePicture: rawData.profilePicture,
        mobileNumber: rawData.mobileNumber,
        instagramHandle: rawData.instagramHandle,
        age: rawData.age,
        lat: rawData.lat,
        lng: rawData.lng,
        gender: rawData.gender,
        // interestedIn: rawData.interestedIn,
        dietaryPreference: rawData.dietaryPreference,
        workLifeStatus: rawData.workLifeStatus,
        studyField: rawData.studyField,
        interests: rawData.interests,
        hobbies: rawData.hobbies,
        dob: rawData.dob,
        bio: rawData.bio,
        profession: rawData.profession,
        institute: rawData.institute,
        course: rawData.course,
        datingPreference: rawData.datingPreference,
        profileComplete: rawData.profileComplete,
        notifyBeforeMinutes: rawData.notifyBeforeMinutes,
        createdAt: rawData.createdAt,
        updatedAt: rawData.updatedAt,
        // dateCards: rawData.dateCards
      };
      
      console.log("📄 Direct profile testCompleted:", directProfile.testCompleted);
      console.log("📄 Direct profile preferencesCompleted:", directProfile.preferencesCompleted);
      
      // ✅ ALWAYS use direct profile since Method 1 has mapping issues
      console.log("✅ Using direct profile to ensure correct field mapping");
      return directProfile;
    }
    
    // Return null if document doesn't exist
    return null;
    
  } catch (error) {
    console.error("❌ Error in getProfile:", error);
    return null;
  }
}

/**
 * Update profile
 */
export async function updateProfile(
  uid: string,
  data: Partial<UserProfile>
): Promise<void> {
  const userRef = getUserDocRef(uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Upload profile photo
 */
export async function uploadProfilePhoto(uid: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `users/${uid}/profile/profile.${ext}`;
  const sRef = storageRef(storage, path);
  await uploadBytes(sRef, file);
  const url = await getDownloadURL(sRef);

  const userRef = getUserDocRef(uid);
  await updateDoc(userRef, { profilePicture: url, updatedAt: serverTimestamp() });

  return url;
}

/**
 * Get fresh profile data directly from server (bypassing cache)
 */
export async function getProfileFromServer(uid: string): Promise<UserProfile | null> {
  try {
    console.log("🌐 Fetching fresh profile data from server for uid:", uid);
    
    const userRef = doc(db, 'users', uid);
    
    // ✅ Force fetch from server, not cache
    const docSnap = await getDocFromServer(userRef);
    
    if (!docSnap.exists()) {
      console.log("❌ User document does not exist");
      return null;
    }

    const data = docSnap.data();
    console.log("📄 Fresh server data:", {
      testCompleted: data.testCompleted,
      personalityType: data.personalityType,
      preferencesCompleted: data.preferencesCompleted,
      name: data.name
    });

    const profile: UserProfile = {
      userId: uid,
      email: data.email || '',
      name: data.name || '',
      location: data.location || '',
      verification: data.verification || {
        photoVerified: false,
        idVerified: false,
        verificationStatus: 'pending' as const
      },
      inQueue: data.inQueue || false,
      queueTimer: data.queueTimer || 0,
      matchedUsers: data.matchedUsers || [],
      likesSent: data.likesSent || [],
      likesReceived: data.likesReceived || [],
      
      // ✅ Personality test fields
      testCompleted: data.testCompleted,
      personalityType: data.personalityType,
      scores: data.scores,
      completedAt: data.completedAt,
      skippedAt: data.skippedAt,
      
      // ✅ Preferences field - ensure it's mapped correctly
      preferencesCompleted: data.preferencesCompleted,
      
      // Other fields
      profilePicture: data.profilePicture,
      mobileNumber: data.mobileNumber,
      instagramHandle: data.instagramHandle,
      age: data.age,
      lat: data.lat,
      lng: data.lng,
      gender: data.gender,
      // interestedIn: data.interestedIn,
      dietaryPreference: data.dietaryPreference,
      workLifeStatus: data.workLifeStatus,
      studyField: data.studyField,
      interests: data.interests,
      hobbies: data.hobbies,
      dob: data.dob,
      bio: data.bio,
      profession: data.profession,
      institute: data.institute,
      course: data.course,
      datingPreference: data.datingPreference,
      profileComplete: data.profileComplete,
      notifyBeforeMinutes: data.notifyBeforeMinutes,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      // dateCards: data.dateCards
    };

    console.log("✅ Fresh profile created with testCompleted:", profile.testCompleted);
    console.log("✅ Fresh profile created with preferencesCompleted:", profile.preferencesCompleted);
    return profile;

  } catch (error) {
    console.error("❌ Error fetching fresh profile:", error);
    return null;
  }
}