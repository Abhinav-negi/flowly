// lib/phoneAuthService.ts
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  PhoneAuthProvider,
  linkWithCredential,
  ConfirmationResult,
  User,
  ApplicationVerifier
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

let recaptchaVerifier: RecaptchaVerifier | null = null;
let confirmationResult: ConfirmationResult | null = null;

/**
 * Initializes or resets the Firebase reCAPTCHA verifier.
 * Must match the ID of the container in your JSX.
 */
export const initializeRecaptcha = (): RecaptchaVerifier => {
  // Clear previous instance
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch(e) {}
    recaptchaVerifier = null;
  }

  const container = document.getElementById('recaptcha-container');
  if (!container) throw new Error('reCAPTCHA container not found');

  recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    size: 'invisible',
    callback: (response: any) => console.log('reCAPTCHA solved:', response),
    'expired-callback': cleanupPhoneAuth,
    'error-callback': (err) => { console.error('reCAPTCHA error:', err); cleanupPhoneAuth(); }
  }, auth);

  return recaptchaVerifier;
};

/** Validates phone number in E.164 format (+1234567890) */
export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  const clean = phone.replace(/[\s\-\(\)]/g, '');
  return /^\+[1-9]\d{9,14}$/.test(clean);
};

/** Strips spaces, dashes, parentheses for Firebase phone auth */
export const formatPhoneNumber = (phone: string): string => phone.replace(/[\s\-\(\)]/g, '');

/**
 * Sends OTP to the given phone number.
 * Throws if invalid phone or Firebase fails.
 */
export const sendOtp = async (phoneNumber: string): Promise<void> => {
  if (!validatePhoneNumber(phoneNumber)) throw new Error('Invalid phone number');
  cleanupPhoneAuth();

  const formattedNumber = formatPhoneNumber(phoneNumber);
  const appVerifier: ApplicationVerifier = initializeRecaptcha();
  await appVerifier.render();

  try {
    confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
    console.log('OTP sent successfully');
  } catch (error) {
    console.error('Send OTP error:', error);
    throw error;
  }
};

/**
 * Verifies OTP code. Links to current user if logged in,
 * or signs in anonymously if not.
 */
export const verifyOtp = async (phoneNumber: string, otpCode: string): Promise<void> => {
  if (!confirmationResult) throw new Error('No OTP request in progress');
  const cleanOtp = otpCode.replace(/\D/g, '');
  if (cleanOtp.length !== 6) throw new Error('OTP must be 6 digits');

  const currentUser = auth.currentUser;

  try {
    if (currentUser) {
      const credential = PhoneAuthProvider.credential(confirmationResult.verificationId, cleanOtp);
      await linkWithCredential(currentUser, credential);
      await updateUserPhoneData(currentUser, phoneNumber);
    } else {
      const result = await confirmationResult.confirm(cleanOtp);
      if (result.user) await updateUserPhoneData(result.user, phoneNumber);
      else throw new Error('Verification failed');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    throw error;
  } finally {
    confirmationResult = null;
  }
};

/** Updates Firestore user document with phone info */
const updateUserPhoneData = async (user: User, phoneNumber: string) => {
  try {
    const userDocRef = doc(db, 'users', user.uid);
    const phoneData = {
      phoneNumber: formatPhoneNumber(phoneNumber),
      phoneVerified: true,
      phoneVerifiedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) await updateDoc(userDocRef, phoneData);
    else await setDoc(userDocRef, { 
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || null,
      photoURL: user.photoURL || null,
      createdAt: new Date().toISOString(),
      ...phoneData
    });
  } catch (error) {
    console.error('Error updating phone data:', error);
    throw error;
  }
};

/** Clears current OTP session and reCAPTCHA */
export const cleanupPhoneAuth = (): void => {
  if (recaptchaVerifier) {
    try { recaptchaVerifier.clear(); } catch(e) {}
  }
  recaptchaVerifier = null;
  confirmationResult = null;
};

/** Checks if current user has a verified phone */
export const isPhoneVerified = async (): Promise<boolean> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  const hasPhone = currentUser.providerData.some(p => p.providerId === 'phone');
  if (hasPhone) return true;

  const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
  return docSnap.exists() ? docSnap.data()?.phoneVerified === true : false;
};

/** Returns current user's phone number if available */
export const getCurrentUserPhone = async (): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  const phoneProvider = currentUser.providerData.find(p => p.providerId === 'phone');
  if (phoneProvider?.phoneNumber) return phoneProvider.phoneNumber;

  const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
  return docSnap.exists() ? docSnap.data()?.phoneNumber || null : null;
};

/** Returns true if OTP verification is in progress */
export const isOtpInProgress = (): boolean => confirmationResult !== null;

/** Alias to cleanup phone verification */
export const resetPhoneVerification = (): void => cleanupPhoneAuth();
