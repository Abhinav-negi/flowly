"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getUserProfile, setUserInQueue } from "@/lib/services/userService";
import { UserProfile } from "@/lib/types/userProfile";
import PinkCircularLoader from "@/components/PinkCircularLoader";

export default function MatchesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSummary, setShowProfileSummary] = useState(false);

  // ✅ new state for unverified pop-up
  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.replace("/sign-in");
        return;
      }

      const profile = await getUserProfile(currentUser.uid);
      if (!profile) {
        router.replace("/profile");
        return;
      }

      setUser(profile);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const getIncompleteFields = (u: UserProfile) => {
    const fields: string[] = [];
    if (!u.age) fields.push("Age");
    if (!u.gender) fields.push("Gender");
    if (!u.location) fields.push("Location");
    if (!u.interests || u.interests.length === 0) fields.push("Interests");
    if (!u.hobbies || u.hobbies.length === 0) fields.push("Hobbies");
    if (!u.bio) fields.push("Bio");
    if (!u.profession) fields.push("Profession");
    return fields;
  };

  const handleJoinQueue = async () => {
    if (!user) return;

    // ✅ show pop-up instead of alert
    if (
      !user.verification.idVerified ||
      !user.verification.photoVerified ||
      user.verification.verificationStatus !== "verified"
    ) {
      setShowVerificationPopup(true);
      return;
    }

    setShowProfileSummary(true);
  };

  const confirmJoinQueue = async () => {
    if (!user) return;
    await setUserInQueue(user.userId, true); // no timer now
    const updatedProfile = await getUserProfile(user.userId);
    if (updatedProfile) {
      setUser(updatedProfile);
      setShowProfileSummary(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found.</p>;

  const incompleteFields = getIncompleteFields(user);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6] flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center font-secondary mb-6">
        Your Upcoming Dates
      </h1>

      {/* ===== Verification Required Pop-up ===== */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-[#E05265] space-y-4">
            <h2 className="text-xl font-semibold font-secondary text-center">
              Complete Your Verification
            </h2>
            <p className="text-center ">
              You must complete your ID and photo verification before joining the queue.
            </p>
            <div className="flex justify-center mt-4">
              <button
                className="px-4 py-2 bg-[#E05265] text-white font-semibold rounded hover:bg-pink-600"
                onClick={() => setShowVerificationPopup(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Pre-Queue Profile Summary Popup ===== */}
      {showProfileSummary && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-[#E05265] text-center">
              Confirm Your Profile
            </h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {user.name || "Not provided"}</p>
              <p><strong>Age:</strong> {user.age || "Not provided"}</p>
              <p><strong>Gender:</strong> {user.gender || "Not provided"}</p>
              <p><strong>Location:</strong> {user.location || "Not provided"}</p>
              <p><strong>Interests:</strong> {user.interests?.join(", ") || "Not provided"}</p>
              <p><strong>Hobbies:</strong> {user.hobbies?.join(", ") || "Not provided"}</p>
              <p><strong>Bio:</strong> {user.bio || "Not provided"}</p>
            </div>

            {incompleteFields.length > 0 && (
              <p className="text-sm text-gray-500">
                Fields left empty: {incompleteFields.join(", ")}
              </p>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => router.push("/profile")}
              >
                Edit Profile
              </button>
              <button
                className="px-4 py-2 bg-[#E05265] text-white rounded hover:bg-[#C04255]"
                onClick={confirmJoinQueue}
              >
                Confirm & Join Queue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Queue Card Section ===== */}
      {user.inQueue && (
        <section className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col items-center space-y-4 w-full max-w-md">
          <h2 className="text-xl font-semibold text-[#E05265]">
            We&apos;re finding your perfect match
          </h2>
          <p className="text-gray-600 text-center">
            Please wait while we match you based on your interests.
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
            <PinkCircularLoader size={100}  />
          </div>
        </section>
      )}

      {/* ===== Join Queue Button ===== */}
      {!user.inQueue && (
        <section className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col items-center space-y-4 w-full max-w-md">
          <h2 className="text-xl font-semibold font-secondary text-[#E05265]">
            Find Your Perfect Match
          </h2>
          <p className="text-gray-600 text-center">
            Complete your profile and verification to join the dating queue.
          </p>
          <button
            onClick={handleJoinQueue}
            className="px-6 py-2 bg-[#E05265] text-white rounded hover:bg-[#C04255]"
          >
            Join Queue
          </button>
        </section>
      )}

      {/* ===== Existing Date Cards ===== */}
      {user.dateCards && user.dateCards.length > 0 ? (
        user.dateCards.map((card, idx) => (
          <div
            key={idx}
            className="bg-white shadow rounded-xl p-6 mb-4 flex flex-col space-y-2 w-full max-w-md"
          >
            <h2 className="text-xl font-semibold">Match: {card.matchUid}</h2>
            <p><strong>Time:</strong> {card.time}</p>
            <p><strong>Location:</strong> {card.location}</p>

            {card.confirmed ? (
              <p className="text-green-600 font-semibold">
                Both agreed! Date is confirmed.
              </p>
            ) : card.userAccepted ? (
              <p className="text-blue-600 font-medium">
                Waiting for the other user to accept...
              </p>
            ) : (
              <p className="text-gray-500">Date pending confirmation...</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500">No upcoming dates yet.</p>
      )}
    </div>
  );
}
