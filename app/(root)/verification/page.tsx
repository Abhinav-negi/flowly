"use client";

import React, { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import { Upload, Camera, ShieldCheck, X } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/services/profileService";
import { uploadIdCard, uploadSelfie, deleteFile } from "@/lib/verificationService";
import { UserProfile, Verification } from "@/lib/types/userProfile";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Image from "next/image";

export default function VerificationPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [selfieOpen, setSelfieOpen] = useState(false);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loadingId, setLoadingId] = useState(false);
  const [loadingSelfie, setLoadingSelfie] = useState(false);
  const [uid, setUid] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const auth = getAuth();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUid(user?.uid ?? null);
    });
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    if (!uid) return;
    const fetch = async () => {
      try {
        const userProfile = await getProfile(uid);
        const safeVerification: Verification =
          userProfile?.verification ?? {
            photoVerified: false,
            idVerified: false,
            verificationStatus: "pending",
          };
        setProfile(userProfile ? { ...userProfile, verification: safeVerification } : null);
      } catch (err) {
        console.error(err);
      }
    };
    fetch();
  }, [uid]);

  const handleIdUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!uid || !e.target.files?.[0]) return;
    try {
      setLoadingId(true);
      const file = e.target.files[0];

      if (profile?.verification?.idDocUrl) {
        await deleteFile(profile.verification.idDocUrl);
      }

      const url = await uploadIdCard(file);

      const updatedVerification: Verification = {
        ...(profile?.verification ?? {
          photoVerified: false,
          idVerified: false,
          verificationStatus: "pending",
        }),
        idVerified: true,
        idDocUrl: url,
        verificationStatus: "in_review",
      };

      await updateProfile(uid, { verification: updatedVerification, updatedAt: Date.now() });

      setProfile((prev) => (prev ? { ...prev, verification: updatedVerification } : prev));
      setStatusMessage("ID uploaded successfully!");
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to upload ID.");
    } finally {
      setLoadingId(false);
    }
  };

  const handleSelfieCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (!imageSrc) return;
    setSelfiePreview(imageSrc);
  };

  const handleSubmitSelfie = async () => {
    if (!uid || !selfiePreview) return;
    try {
      setLoadingSelfie(true);
      if (profile?.verification?.livePhotoUrl) {
        await deleteFile(profile.verification.livePhotoUrl);
      }

      const url = await uploadSelfie(selfiePreview);

      const updatedVerification: Verification = {
        ...(profile?.verification ?? {
          photoVerified: false,
          idVerified: false,
          verificationStatus: "pending",
        }),
        photoVerified: true,
        livePhotoUrl: url,
        verificationStatus: "in_review",
      };

      await updateProfile(uid, { verification: updatedVerification, updatedAt: Date.now() });

      setProfile((prev) => (prev ? { ...prev, verification: updatedVerification } : prev));
      setStatusMessage("Selfie uploaded successfully!");
      setSelfiePreview(null);
      setSelfieOpen(false);
    } catch (err) {
      console.error(err);
      setStatusMessage("Failed to upload selfie.");
    } finally {
      setLoadingSelfie(false);
    }
  };

  const getVerificationDisplay = (verification: Verification | undefined) => {
    if (!verification) return { text: "No documents submitted", style: "bg-gray-100 text-gray-800" };
    const hasAnyDoc = verification.idDocUrl || verification.livePhotoUrl;
    if (!hasAnyDoc) return { text: "No documents submitted", style: "bg-gray-100 text-gray-800" };
    const status = verification.verificationStatus || "in_review";
    if (status === "pending" || status === "in_review") {
      return { text: "Verification pending", style: "bg-yellow-100 text-yellow-800" };
    }
    if (status === "verified") return { text: "Verified", style: "bg-green-100 text-green-800" };
    if (status === "rejected") return { text: "Rejected", style: "bg-red-100 text-red-800" };
    return { text: "Unknown status", style: "bg-gray-100 text-gray-800" };
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
      <main className="flex-1 w-11/12 max-w-5xl mx-auto py-10 space-y-10">
        <h1 className="text-3xl font-bold text-gray-800 text-center sm:text-left">
          Account Verification
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* ID Upload */}
          <div className="p-6 rounded-2xl shadow-md border bg-white hover:shadow-lg flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Upload className="w-6 h-6 text-[#E05265]" />
              <h2 className="text-lg font-semibold text-gray-800">Upload ID Card</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Upload a valid government ID</p>

            {!profile?.verification?.idDocUrl && !loadingId && (
              <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-[#E05265] bg-[#FFF5F7] hover:bg-[#FFE4EA] text-[#E05265] text-sm font-medium transition">
                <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
                📂 Choose File
              </label>
            )}

            <div className="mt-2 flex flex-col items-start">
              {loadingId && <div className="w-32 h-20 rounded-md bg-gray-200 animate-pulse" />}
              {profile?.verification?.idDocUrl && !loadingId && (
                <Image
                  src={profile.verification.idDocUrl}
                  alt="ID Preview"
                  width={128}
                  height={80}
                  className="rounded-md object-cover"
                  onLoadingComplete={() => setLoadingId(false)}
                />
              )}
              {profile?.verification?.idDocUrl && !loadingId && (
                <p className="text-green-600 mt-1">ID uploaded successfully</p>
              )}
            </div>
          </div>

          {/* Live Selfie */}
          <div className="p-6 rounded-2xl shadow-md border bg-white hover:shadow-lg flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Camera className="w-6 h-6 text-[#E05265]" />
              <h2 className="text-lg font-semibold text-gray-800">Live Selfie</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Take a live selfie for verification</p>

            {!profile?.verification?.livePhotoUrl && !loadingSelfie && (
              <Button
                className="bg-[#E05265] text-white rounded-xl"
                onClick={() => setSelfieOpen(true)}
              >
                Take Selfie
              </Button>
            )}

            <div className="mt-2 flex flex-col items-start">
              {loadingSelfie && <div className="w-32 h-32 rounded-full bg-gray-200 animate-pulse" />}
              {profile?.verification?.livePhotoUrl && !loadingSelfie && (
                <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#E05265]">
                  <Image
                    src={profile.verification.livePhotoUrl}
                    alt="Selfie Preview"
                    width={128}
                    height={128}
                    className="object-cover"
                    onLoadingComplete={() => setLoadingSelfie(false)}
                  />
                </div>
              )}
              {profile?.verification?.livePhotoUrl && !loadingSelfie && (
                <p className="text-green-600 mt-1">Selfie uploaded successfully</p>
              )}
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="p-6 rounded-2xl shadow-md border bg-white">
          <div className="flex items-center gap-3 mb-3">
            <ShieldCheck className="w-6 h-6 text-[#E05265]" />
            <h2 className="text-lg font-semibold text-gray-800">Verification Status</h2>
          </div>
          <p className="text-sm text-gray-600">
            Current Status:{" "}
            <span
              className={`inline-block rounded px-2 py-0.5 ${getVerificationDisplay(profile?.verification).style}`}
            >
              {getVerificationDisplay(profile?.verification).text}
            </span>
          </p>
          {statusMessage && <p className="text-green-600 mt-2">{statusMessage}</p>}
        </div>
      </main>

      {/* Selfie Modal */}
      {selfieOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center relative w-11/12 sm:w-auto">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200"
              onClick={() => {
                setSelfieOpen(false);
                setSelfiePreview(null);
              }}
            >
              <X className="w-5 h-5" />
            </button>

            {!selfiePreview ? (
              <div className="w-64 h-64 overflow-hidden rounded-full border-4 border-[#E05265]">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
              </div>
            ) : (
              <div className="w-64 h-64 overflow-hidden rounded-full border-4 border-[#E05265] relative">
                <Image src={selfiePreview} alt="Selfie Preview" fill className="object-cover rounded-full" />
              </div>
            )}

            <div className="flex gap-4 mt-6 flex-wrap justify-center">
              {!selfiePreview ? (
                <Button onClick={handleSelfieCapture} className="bg-green-600 text-white rounded-xl">
                  Capture
                </Button>
              ) : (
                <>
                  <Button onClick={handleSubmitSelfie} className="bg-green-600 text-white rounded-xl">
                    Submit
                  </Button>
                  <Button
                    onClick={() => setSelfiePreview(null)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Retake
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
