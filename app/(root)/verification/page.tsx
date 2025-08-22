"use client";

import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Upload, Camera, ShieldCheck } from "lucide-react";
import { getProfile } from "@/lib/services/profileService";
import { uploadIdCard, uploadSelfie } from "@/lib/verificationService";
import { UserProfile, Verification } from "@/lib/types/userProfile";
import { getAuth } from "firebase/auth";
import Image from "next/image";

export default function VerificationPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selfieOpen, setSelfieOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const webcamRef = useRef<Webcam>(null);

  const auth = getAuth();
  const currentUser = auth.currentUser;

  // Fetch profile on mount
  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      try {
        const userProfile = await getProfile(currentUser.uid);
        setProfile(userProfile);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [currentUser]);

  // Handle ID upload
  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentUser || !e.target.files?.[0]) return;

    try {
      const file = e.target.files[0];
      const url = await uploadIdCard(file);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              verification: {
                ...prev.verification,
                idVerified: true,
                idDocUrl: url,
                verificationStatus: "in_review",
              },
            }
          : prev
      );

      setStatusMessage("ID uploaded successfully!");
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to upload ID.");
    }
  };

  // Handle selfie capture
  const handleSelfieCapture = async () => {
    if (!currentUser) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;

    try {
      const url = await uploadSelfie(imageSrc);

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              verification: {
                ...prev.verification,
                photoVerified: true,
                livePhotoUrl: url,
                verificationStatus: "in_review",
              },
            }
          : prev
      );

      setStatusMessage("Selfie uploaded successfully!");
      setSelfieOpen(false);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to upload selfie.");
    }
  };

  // Determine verification display
  const getVerificationDisplay = (verification: Verification | undefined) => {
    if (!verification) {
      return {
        text: "No documents submitted",
        style: "bg-gray-100 text-gray-800",
      };
    }

    if (!verification.idVerified && !verification.photoVerified) {
      return {
        text: "No documents submitted",
        style: "bg-gray-100 text-gray-800",
      };
    }

    if (
      (verification.idVerified || verification.photoVerified) &&
      (verification.verificationStatus === "pending" ||
        verification.verificationStatus === "in_review")
    ) {
      return {
        text: "Verification pending",
        style: "bg-yellow-100 text-yellow-800",
      };
    }

    if (verification.verificationStatus === "verified") {
      return { text: "Verified", style: "bg-green-100 text-green-800" };
    }

    if (verification.verificationStatus === "rejected") {
      return { text: "Rejected", style: "bg-red-100 text-red-800" };
    }

    return { text: "Unknown status", style: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-10 space-y-10">
        <h1 className="text-3xl font-bold text-gray-800">
          Account Verification
        </h1>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* ID Upload */}
          <div className="p-6 rounded-2xl shadow-md border bg-white hover:shadow-lg flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-[#E05265]" />
              <h2 className="text-lg font-semibold text-gray-800">
                Upload ID Card
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Upload a valid government ID
            </p>
            <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#E05265] bg-[#FFF5F7] hover:bg-[#FFE4EA] text-[#E05265] text-sm font-medium transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleIdUpload}
                className="hidden"
              />
              📂 Choose File
            </label>
            {profile?.verification?.idDocUrl && (
              <div className="mt-2 flex flex-col items-start">
                <Image
                  src={profile.verification.idDocUrl}
                  alt="ID Preview"
                  width={128} // equivalent to w-32
                  height={80} // equivalent to h-20
                  className="rounded-md object-cover"
                />
                <p className="text-green-600 mt-1">ID uploaded successfully</p>
              </div>
            )}
          </div>

          {/* Live Selfie */}
          <div className="p-6 rounded-2xl shadow-md border bg-white hover:shadow-lg flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-[#E05265]" />
              <h2 className="text-lg font-semibold text-gray-800">
                Live Selfie
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Take a live selfie for verification
            </p>
            <Button
              className="bg-[#E05265] text-white rounded-xl"
              onClick={() => setSelfieOpen(true)}
            >
              Take Selfie
            </Button>
            {profile?.verification?.livePhotoUrl && (
              <div className="mt-2 flex flex-col items-start">
                <Image
                  src={profile.verification.livePhotoUrl}
                  alt="Selfie Preview"
                  width={128} // w-32
                  height={128} // h-32
                  className="rounded-full border-2 border-[#E05265] object-cover"
                />
                <p className="text-green-600 mt-1">
                  Selfie uploaded successfully
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Verification Status */}
        <div className="p-6 rounded-2xl shadow-md border bg-white">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-[#E05265]" />
            <h2 className="text-lg font-semibold text-gray-800">
              Verification Status
            </h2>
          </div>
          <p className="text-sm text-gray-600">
            Current Status:{" "}
            <span
              className={`inline-block rounded px-2 py-0.5 ${
                getVerificationDisplay(profile?.verification).style
              }`}
            >
              {getVerificationDisplay(profile?.verification).text}
            </span>
          </p>
          {statusMessage && (
            <p className="text-green-600 mt-2">{statusMessage}</p>
          )}

          {/* Optional badges for uploaded docs */}
          <div className="flex gap-2 mt-3 flex-wrap">
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                profile?.verification?.idVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              ID
            </span>
            <span
              className={`px-2 py-1 rounded-full text-sm ${
                profile?.verification?.photoVerified
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Selfie
            </span>
          </div>
        </div>
      </main>

      {/* Selfie Modal */}
      {selfieOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center">
            <div className="w-64 h-64 overflow-hidden rounded-full border-4 border-[#E05265]">
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
                videoConstraints={{ facingMode: "user" }}
              />
            </div>
            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleSelfieCapture}
                className="bg-green-600 text-white rounded-xl"
              >
                Capture
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelfieOpen(false)}
                className="rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
