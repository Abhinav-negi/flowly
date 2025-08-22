"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, ShieldCheck, Heart, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import type { UserProfile as UserProfileType } from "@/lib/types/userProfile";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function DashboardHome() {
  const { profile, loading: authLoading } = useAuth();
  const [userName, setUserName] = useState<string>("User");
  const [showTodo, setShowTodo] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);

  // Set user name
  useEffect(() => {
    if (profile?.name) setUserName(profile.name);
  }, [profile]);

  // Fetch dynamic notifications count
  useEffect(() => {
    if (!profile?.userId) return;
    const q = query(collection(db, "users", profile.userId, "notifications"), where("read", "==", false));
    const unsub = onSnapshot(q, (snap) => {
      setNotifications(snap.size);
    });
    return () => unsub();
  }, [profile]);

  if (authLoading) return <p>Loading...</p>;

  // Compute profile completion
  const todoItems = getTodoItems(profile);
  const completedSections = 4 - todoItems.length; // 4 key sections
  const progressPercentage = Math.round((completedSections / 4) * 100);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
      <main className="flex-1 w-11/12 max-w-6xl mx-auto py-10 space-y-10">
        {/* Welcome Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome back, <span className="text-[#E05265]">{userName}</span>
            </h1>


            <p className="text-gray-600">Your profile is {progressPercentage}% complete</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div
                className="bg-[#E05265] h-2 rounded-full transition-all"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Conditional Action Button */}
          {progressPercentage < 100 ? (
            <Button
              className="bg-[#E05265] hover:bg-pink-600 text-white rounded-xl shadow-md"
              onClick={() => setShowTodo(!showTodo)}
            >
              What Needs To Be Done
            </Button>
          ) : (
            <Button className="bg-[#E05265] hover:bg-pink-600 text-white rounded-xl shadow-md">
              All Set 🎉
            </Button>
          )}
        </div>

        {/* Todo Popup */}
        {showTodo && (
          <div className="fixed right-5 top-24 w-80 bg-white shadow-lg rounded-xl p-4 z-50 border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-800">Profile To-Do</h3>
              <button onClick={() => setShowTodo(false)}>×</button>
            </div>
            <ul className="space-y-2 text-gray-600">
              {todoItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {todoItems.length === 0 && <li>All done! ✅</li>}
            </ul>
          </div>
        )}

        {/* Status Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {getStatusCards(profile, notifications).map((card) => (
            <div
              key={card.title}
              className="p-6 rounded-2xl shadow-md border space-y-3 bg-[#FAF7F5] hover:shadow transition flex flex-col"
            >
              <div className="flex items-center gap-3">
                {card.icon}
                <h2 className="font-semibold text-lg text-gray-800">{card.title}</h2>
              </div>
              <p className="mt-2 text-sm font-medium text-gray-600">{card.status}</p>
              <Link
                href={card.link}
                className="mt-auto inline-block text-[#E05265] font-semibold hover:underline"
              >
                Go to section →
              </Link>
            </div>
          ))}
        </div>

        {/* Next Steps / Tips */}
        <div className="mt-10 bg-white rounded-2xl shadow-md p-6">
          {progressPercentage === 100 ? (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">You&apos;re All Set 🎉</h2>
              <ul className="space-y-3 text-gray-600">
                <li>💘 Start applying for matches when ready</li>
                <li>⏳ Wait for responses and keep an eye on updates</li>
                <li>🔔 Check notifications regularly for new matches</li>
              </ul>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Next Steps for You</h2>
              <ul className="space-y-3 text-gray-600">
                {todoItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------------- Helper Functions ----------------

function getStatusCards(profile: UserProfileType | null, notifications: number) {
  return [
    {
      title: "Profile",
      status: profile ? (isProfileComplete(profile) ? "Completed" : "Incomplete") : "Incomplete",
      link: "/profile",
      icon: <User className="w-6 h-6 text-[#E05265]" />,
    },
    {
      title: "Account Verification",
      status: profile?.verification?.idVerified ? "Verified" : "Pending",
      link: "/verification",
      icon: <ShieldCheck className="w-6 h-6 text-[#E05265]" />,
    },
    {
      title: "Matches",
      status: "Locked",
      link: "/matches",
      icon: <Heart className="w-6 h-6 text-[#E05265]" />,
    },
    {
      title: "Notifications",
      status: notifications > 0 ? `${notifications} New` : "None",
      link: "/notifications",
      icon: <Bell className="w-6 h-6 text-[#E05265]" />,
    },
  ];
}

function getTodoItems(profile: UserProfileType | null) {
  if (!profile) return ["Complete profile details", "Verify ID"];
  const todos: string[] = [];
  if (!profile.name) todos.push("Add your full name");
  if (!profile.mobileNumber) todos.push("Add mobile number");
  if (!profile.verification?.idVerified) todos.push("Verify your ID");
  return todos;
}

function isProfileComplete(profile: UserProfileType | null) {
  if (!profile) return false;
  return !!profile.name && !!profile.mobileNumber && !!profile.verification?.idVerified;
}
