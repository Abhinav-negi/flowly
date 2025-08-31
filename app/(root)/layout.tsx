"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/dashboard/navigation";
import FooterApp from "@/components/dashboard/Footerapp";
import PersonalityTestWrapper from "@/components/PersonalityTestWrapper";
import {
  getProfile,
  getProfileFromServer,
} from "@/lib/services/profileService";
import { UserProfile } from "@/lib/types/userProfile";
import OnboardingWrapper from "@/components/OnboardingWrapper";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [showPersonalityTest, setShowPersonalityTest] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const router = useRouter();

  // Function to fetch and update profile
  const fetchProfile = async (
    currentUser: User,
    forceRefresh: boolean = false
  ) => {
    try {
      console.log(
        "🔄 Fetching profile for user:",
        currentUser.uid,
        forceRefresh ? "(FORCE REFRESH)" : ""
      );

      
      // Use getProfileFromServer after personality test completion to bypass cache
      const userProfile = forceRefresh
        ? await getProfileFromServer(currentUser.uid)
        : await getProfile(currentUser.uid);

      console.log("📄 Profile data received:", {
        testCompleted: userProfile?.testCompleted,
        preferencesCompleted: userProfile?.preferencesCompleted,
        personalityType: userProfile?.personalityType,
        name: userProfile?.name,
      });

      setProfile(userProfile);

      // Determine if we should show personality test
      const shouldShowTest = !userProfile?.testCompleted;
      console.log("🎯 Should show test:", shouldShowTest);
      setShowPersonalityTest(shouldShowTest);

      // Gate order: Onboarding first. If done, then Personality Test.
      // Fix: Handle undefined preferencesCompleted by treating it as false
      const needsOnboarding = userProfile?.preferencesCompleted !== true;
      console.log("have user filled the preference form : ", userProfile?.preferencesCompleted);
      console.log("needsOnboarding : ", needsOnboarding);
      setShowOnboarding(needsOnboarding);
    } catch (error) {
      console.error("❌ Error fetching profile:", error);
      // If profile doesn't exist or error occurs, show test
      setShowPersonalityTest(true);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/");
        return;
      }

      setUser(currentUser);
      await fetchProfile(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleOnboardingComplete = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 1000));
      await fetchProfile(user, true);
    } finally {
      setLoading(false);
    }
  };
  
  const handlePersonalityTestComplete = async () => {
    console.log("🎉 Personality test completed, refreshing profile...");

    if (user) {
      try {
        setLoading(true);

        // Wait longer to ensure Firebase write is complete
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Force refresh profile from server (bypass cache)
        await fetchProfile(user, true);

        console.log("✅ Profile refreshed successfully");
      } catch (error) {
        console.error("❌ Error refreshing profile:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF7F5]">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  // 👉 Render the gating overlays first:
  if (showOnboarding) {
    return <OnboardingWrapper onComplete={handleOnboardingComplete} />;
  }
  // Show personality test as overlay only if not completed
  if (showPersonalityTest) {
    console.log(
      "🧪 Showing personality test - profile?.testCompleted:",
      profile?.testCompleted
    );
    return (
      <PersonalityTestWrapper onComplete={handlePersonalityTestComplete} />
    );
  }

  console.log(
    "🏠 Showing main dashboard - test completed:",
    profile?.testCompleted
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 sm:gap-3 items-center">
            <Image
              src="/assets/logo/heart.png"
              alt="logo"
              height={36}
              width={36}
            />
            <h1 className="text-[#E05265] font-secondary font-bold text-xl sm:text-2xl md:text-3xl">
              Flowly
            </h1>
          </div>
          <Navigation />
        </div>
      </header>

      {/* Notifications Modal */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-72 sm:w-80 bg-white p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Notifications</h3>
              <Button
                variant="ghost"
                onClick={() => setNotificationsOpen(false)}
              >
                Close
              </Button>
            </div>
            <ul className="space-y-2 min-h-[150px] flex flex-col justify-center">
              <li className="p-2 border rounded bg-gray-100">
                Profile verification pending
              </li>
              <li className="p-2 border rounded bg-gray-100">
                New match available
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20 sm:pt-20 md:pt-15 lg:pt-15 bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
        {children}
      </main>

      {/* Footer */}
      <FooterApp />
    </div>
  );
}