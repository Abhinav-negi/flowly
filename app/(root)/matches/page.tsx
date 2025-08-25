"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getUserProfile,
  setUserInQueue,
  respondToDate,
} from "@/lib/services/userService";
import { UserProfile, DateCard } from "@/lib/types/userProfile";
import PinkCircularLoader from "@/components/PinkCircularLoader";

export default function MatchesPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileSummary, setShowProfileSummary] = useState(false);

  const [showVerificationPopup, setShowVerificationPopup] = useState(false);

  // Decline reason state
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [activeCard, setActiveCard] = useState<DateCard | null>(null);

  const openDeclineModal = (card: DateCard) => {
    setActiveCard(card);
    setDeclineReason("");
    setShowDeclineModal(true);
  };

  const submitDecline = async () => {
    if (!user || !activeCard) return;
    if (!declineReason.trim()) {
      alert("Please provide a reason for declining.");
      return;
    }
    await respondToDate(
      user.userId,
      activeCard.matchUid,
      "decline",
      declineReason.trim()
    );
    const updated = await getUserProfile(user.userId);
    if (updated) setUser(updated);
    setShowDeclineModal(false);
    setActiveCard(null);
    setDeclineReason("");
  };

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
    await setUserInQueue(user.userId, true);
    const updatedProfile = await getUserProfile(user.userId);
    if (updatedProfile) {
      setUser(updatedProfile);
      setShowProfileSummary(false);
    }
  };

  const handleAccept = async (card: DateCard) => {
    if (!user) return;
    await respondToDate(user.userId, card.matchUid, "accept");
    const updatedProfile = await getUserProfile(user.userId);
    if (updatedProfile) setUser(updatedProfile);
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <p className="text-center mt-10">User not found.</p>;

  const incompleteFields = getIncompleteFields(user);

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6] flex flex-col items-center">
      <h1 className="text-3xl font-bold text-center font-secondary mb-6">
        Your Upcoming Dates
      </h1>

      {/* Verification Required Pop-up */}
      {showVerificationPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md text-[#E05265] space-y-4">
            <h2 className="text-xl font-semibold font-secondary text-center">
              Complete Your Verification
            </h2>
            <p className="text-center ">
              You must complete your ID and photo verification before joining
              the queue.
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

      {/* Pre-Queue Profile Summary Popup */}
      {showProfileSummary && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-[#E05265] text-center">
              Confirm Your Profile
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {user.name || "Not provided"}
              </p>
              <p>
                <strong>Age:</strong> {user.age || "Not provided"}
              </p>
              <p>
                <strong>Gender:</strong> {user.gender || "Not provided"}
              </p>
              <p>
                <strong>Location:</strong> {user.location || "Not provided"}
              </p>
              <p>
                <strong>Interests:</strong>{" "}
                {user.interests?.join(", ") || "Not provided"}
              </p>
              <p>
                <strong>Hobbies:</strong>{" "}
                {user.hobbies?.join(", ") || "Not provided"}
              </p>
              <p>
                <strong>Bio:</strong> {user.bio || "Not provided"}
              </p>
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

      {/* Queue Loader (only if no cards) */}
      {user.inQueue && (!user.dateCards || user.dateCards.length === 0) && (
        <section className="bg-white shadow rounded-xl p-6 mb-6 flex flex-col items-center space-y-4 w-full max-w-md">
          <h2 className="text-xl font-semibold text-[#E05265]">
            We&apos;re finding your perfect match
          </h2>
          <p className="text-gray-600 text-center">
            Please wait while we match you based on your interests.
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "50px",
            }}
          >
            <PinkCircularLoader size={100} />
          </div>
        </section>
      )}

      {/* Join Queue Button */}
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
        user.dateCards.map((card, idx) => {
          const youDeclined = card.declined && card.declinedBy === user.userId;

          return (
            <div
              key={idx}
              className="bg-white shadow-lg rounded-2xl p-6 mb-4 flex flex-col space-y-3 w-full max-w-md border border-pink-200"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-[#E05265]">
                  Match Found 🎉
                </h2>
                {card.confirmed && (
                  <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                    CONFIRMED
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1 text-sm">
                <p>
                  <strong>Match ID:</strong> {card.matchUid}
                </p>
                <p>
                  <strong>Date:</strong> {card.time}
                </p>
                <p>
                  <strong>Location:</strong> {card.location}
                </p>
                <p>
                  <strong>Description:</strong> {card.description}
                </p>
                {card.specialInstructions && (
                  <p>
                    <strong>Instructions:</strong> {card.specialInstructions}
                  </p>
                )}
              </div>

              {/* Status */}
              {card.declined ? (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-red-700 text-sm">
                  {youDeclined ? (
                    <>
                      <p className="font-semibold">You declined this date.</p>
                      {card.declineReason && (
                        <p>Reason: {card.declineReason}</p>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">
                        The other person declined this date.
                      </p>
                      {card.declineReason && (
                        <p>Reason: {card.declineReason}</p>
                      )}
                    </>
                  )}
                </div>
              ) : card.confirmed ? (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-green-700 text-sm">
                  ✅ Date Confirmed! Meet at <strong>{card.location}</strong>
                </div>
              ) : card.userAccepted ? (
                <div className="rounded-lg border border-[#ECCFC6] bg-[#FAF7F5] p-3 text-[#e1ab9b] text-sm">
                  Waiting for the other user to accept...
                </div>
              ) : card.otherAccepted ? (
                <div className="rounded-lg border border-[#ECCFC6] bg-[#FAF7F5] p-3 text-[#e1ab9b] text-sm">
                  The other user accepted. Please respond.
                </div>
              ) : (
                <div className="text-gray-500 text-sm">
                  Please respond to this date.
                </div>
              )}

              {/* Actions (hidden if declined or confirmed or already accepted) */}
              {!card.declined && !card.confirmed && !card.userAccepted && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleAccept(card)}
                    className="group inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#FF8FA3] to-[#E05265] text-white font-semibold px-5 py-2 shadow-md hover:shadow-lg active:scale-[.98] transition"
                  >
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Accept
                  </button>

                  <button
                    onClick={() => openDeclineModal(card)}
                    className="inline-flex items-center justify-center rounded-xl border-2 border-[#E05265]/40 text-[#E05265] font-semibold px-5 py-2 hover:bg-[#E05265]/5 active:scale-[.98] transition"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-gray-500">No upcoming dates yet.</p>
      )}

      {/* Decline Reason Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-[#E05265] text-center">
              Why are you rejecting this date?
            </h3>
            <p className="mt-2 text-sm text-gray-600 text-center">
              Please share a short reason. This helps us improve your future
              matches.
            </p>

            <textarea
              className="mt-4 w-full rounded-lg border p-3 text-sm outline-none focus:ring-2 focus:ring-[#E05265]/40"
              rows={4}
              placeholder="e.g., timing doesn’t work, not my vibe, location too far…"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setShowDeclineModal(false);
                  setActiveCard(null);
                  setDeclineReason("");
                }}
                className="rounded-xl border border-gray-300 bg-white px-5 py-2 font-semibold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitDecline}
                className="rounded-xl bg-red-500 px-5 py-2 font-semibold text-white hover:bg-red-600"
              >
                Submit Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
