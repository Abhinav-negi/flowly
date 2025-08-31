"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PreferencesForm from "@/components/preferenceform";

interface PreferencesWrapperProps {
  onComplete?: () => void; // callback after completion
}

export default function PreferencesWrapper({ onComplete }: PreferencesWrapperProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsPreferences, setNeedsPreferences] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(currentUser);

      try {
        const ref = doc(db, "users", currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();
          setNeedsPreferences(!data.preferencesCompleted);
        } else {
          setNeedsPreferences(true);
        }
      } catch (err) {
        console.error("Error loading preferences:", err);
        setNeedsPreferences(true);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF7F5]">
        <p className="text-lg text-gray-600">Loading preferences...</p>
      </div>
    );
  }

  if (needsPreferences && user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF7F5] to-[#EFD9D1]">
        <PreferencesForm user={user} onComplete={onComplete} />
      </div>
    );
  }

  return null; // nothing if already completed
}
