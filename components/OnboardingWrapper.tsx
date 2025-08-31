"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getProfile } from "@/lib/services/profileService";
import OnboardingFlow from "@/components/OnboardingFlow";
import { saveOnboardingProfile, OnboardingPayload } from "@/lib/services/onboardingService";
import { UserProfile } from "@/lib/types/userProfile";

interface Props {
  onComplete: () => void;
}

export default function OnboardingWrapper({ onComplete }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }
      setUser(currentUser);
      try {
        const p = await getProfile(currentUser.uid);
        setProfile(p);
        // If already completed, bounce out
        if (p?.preferencesCompleted) {
          onComplete();
          return;
        }
      } catch (e) {
        console.error("OnboardingWrapper: getProfile error", e);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [router, onComplete]);

  const handleSave = async (payload: OnboardingPayload) => {
    if (!user) return;
    try {
      setSaving(true);
      await saveOnboardingProfile(user.uid, payload);
      // brief delay so cache/SSR/clients catch up
      await new Promise((r) => setTimeout(r, 800));
      onComplete();
    } catch (e) {
      console.error("Onboarding save error:", e);
      alert("Could not save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || saving) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#E05265] flex items-center justify-center">
        <div className="text-gray-700 text-lg">{saving ? "Saving..." : "Loading..."}</div>
      </div>
    );
  }

  return <OnboardingFlow onSubmit={handleSave} />;
}
