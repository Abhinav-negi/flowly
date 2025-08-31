'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { getProfile } from '@/lib/services/profileService';
import { savePersonalityTestResult } from '@/lib/services/personalityService';
import PersonalityTest from './PersonalityTest';
import { UserProfile } from '@/lib/types/userProfile';

interface ArchetypeScores {
  A: number;
  N: number;
  T: number;
  L: number;
  D: number;
  C: number;
}

interface PersonalityTestWrapperProps {
  onComplete: () => void;
}

export default function PersonalityTestWrapper({ onComplete }: PersonalityTestWrapperProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace('/sign-in');
        return;
      }

      setUser(currentUser);

      try {
        const userProfile = await getProfile(currentUser.uid);
        setProfile(userProfile);

        // If test already completed → redirect to app
        if (userProfile?.testCompleted) {
          console.log("✅ Test already completed, calling onComplete");
          onComplete();
          return;
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, onComplete]);

  // Handle test completion - this is called when user clicks "Explore Flowly"
  const handleTestComplete = async (personalityType: string, scores: ArchetypeScores) => {
    if (!user || !personalityType) {
      console.error('No user or personality type found during test completion');
      return;
    }

    try {
      setSaving(true);
      console.log('🔄 Saving personality test result:', { personalityType, scores });

      // Save result in Firestore
      await savePersonalityTestResult(user.uid, personalityType, scores);
      console.log('✅ Personality test saved successfully');

      // Longer delay to ensure write completes and propagates
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Verify the save by fetching updated profile
      const updatedProfile = await getProfile(user.uid);
      console.log('🔍 Verification fetch - testCompleted:', updatedProfile?.testCompleted);

      if (updatedProfile?.testCompleted) {
        console.log('✅ Test completion verified, calling onComplete');
        onComplete();
      } else {
        console.warn('⚠️ Test completion not verified, retrying...');
        // Retry once more
        await new Promise(resolve => setTimeout(resolve, 1000));
        onComplete();
      }

    } catch (error) {
      console.error('❌ Error saving personality test:', error);
      alert('Error saving your results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center">
        <div className="text-gray-600 text-xl font-app">
          {saving ? 'Saving your results...' : 'Loading...'}
        </div>
      </div>
    );
  }

  return (
    <PersonalityTest onComplete={handleTestComplete} />
  );
}