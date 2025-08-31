import { doc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ArchetypeScores {
  A: number; // Adventurer
  N: number; // Nurturer
  T: number; // Thinker
  L: number; // Leader
  D: number; // Dreamer
  C: number; // Connector
}

/**
 * Save personality test results to user profile using updateDoc
 */
export async function savePersonalityTestResult(
  uid: string,
  personalityType: string,
  scores: ArchetypeScores
): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);

    const personalityData = {
      personalityType,
      scores,
      completedAt: Date.now(),
      testCompleted: true, // ✅ This is the key field
      updatedAt: serverTimestamp(),
    };

    console.log('🔄 Using updateDoc to save personality test:', personalityData);

    // ✅ Use updateDoc instead of setDoc with merge
    // This avoids the Firebase cache issue with merge operations
    await updateDoc(userRef, personalityData);

    console.log('✅ Personality test results saved with updateDoc');

    // Verify the write by reading back
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      console.log('🔍 Verification read after updateDoc - testCompleted:', data.testCompleted);
      console.log('🔍 Verification read after updateDoc - personalityType:', data.personalityType);
      
      if (!data.testCompleted) {
        throw new Error('Data verification failed - testCompleted not set properly');
      }
    } else {
      throw new Error('Document does not exist after write');
    }

  } catch (error) {
    console.error('❌ Error saving personality test results:', error);
    throw error;
  }
}

/**
 * Mark personality test as skipped
 */
export async function skipPersonalityTest(uid: string): Promise<void> {
  try {
    const userRef = doc(db, 'users', uid);

    await updateDoc(userRef, {
      testCompleted: true,
      personalityType: null,
      scores: null,
      skippedAt: Date.now(),
      updatedAt: serverTimestamp(),
    });

    console.log('✅ Personality test marked as skipped');
  } catch (error) {
    console.error('❌ Error skipping personality test:', error);
    throw error;
  }
}