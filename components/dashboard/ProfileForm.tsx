"use client";

import { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { getProfile, updateProfile } from "@/lib/services/profileService";
import {
  UserProfile,
  Gender,
  DietaryPreference,
} from "@/lib/types/userProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// --- Helper: calculate age from DOB
function calculateAge(dob: string): number | undefined {
  if (!dob) return undefined;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return undefined;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age >= 0 ? age : undefined;
}

export default function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // --- Fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        router.replace("/sign-in");
        return;
      }
      setUid(user.uid);
      const data = await getProfile(user.uid);
      if (data) {
        setProfile({
          ...data,
          age: data.dob ? calculateAge(data.dob) : undefined,
          interests: data.interests || [],
          hobbies: data.hobbies || [],
          dateCards: data.dateCards || [],
        });
      } else {
        setProfile({
          userId: user.uid,
          name: user.displayName || "",
          email: user.email || "",
          interests: [],
          hobbies: [],
          dateCards: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          verification: {
            photoVerified: false,
            idVerified: false,
            verificationStatus: "pending",
          },
          inQueue: false,
          queueTimer: 0,
          matchedUsers: [],
          likesSent: [],
          likesReceived: [],
          mobileNumber: "",
          instagramHandle: "",
          age: undefined,
          dob: "",
          gender: undefined,
          dietaryPreference: undefined,
          workLifeStatus: undefined,
          studyField: "",
          bio: "",
          profession: undefined,
          institute: "",
          course: "",
          location: "",
          datingPreference: undefined,
        } as UserProfile);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  // --- Save profile
  async function handleSave() {
    if (!uid || !profile) return;
    setLoading(true);
    const profileToSave: Partial<UserProfile> = {};
    Object.entries(profile).forEach(([key, value]) => {
      if (value !== undefined) profileToSave[key as keyof UserProfile] = value;
    });
    try {
      await updateProfile(uid, profileToSave);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
    setLoading(false);
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return null;

  const handleInputChange =
    (field: keyof UserProfile) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setProfile((prev) => ({ ...prev!, [field]: e.target.value }));
    };

  const handleArrayAdd =
    (field: "interests" | "hobbies") =>
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
        e.preventDefault();
        const val = e.currentTarget.value.trim();
        setProfile((prev) => ({
          ...prev!,
          [field]: prev![field]!.includes(val)
            ? prev![field]!
            : [...prev![field]!, val],
        }));
        e.currentTarget.value = "";
      }
    };

  const handleArrayRemove = (field: "interests" | "hobbies", index: number) => {
    setProfile((prev) => ({
      ...prev!,
      [field]: prev![field]!.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {saved && <p className="text-green-600 font-semibold">Saved!</p>}

      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Full Name
        </label>
        <Input
          value={profile.name || ""}
          onChange={handleInputChange("name")}
          className="bg-[#FAF7F5]"
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <Input value={profile.email || ""} className="bg-[#FAF7F5]" disabled />
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Mobile</label>
        <Input
          value={profile.mobileNumber || ""}
          onChange={handleInputChange("mobileNumber")}
          className="bg-[#FAF7F5]"
          placeholder="Phone number"
        />
      </div>

      {/* Instagram */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Instagram Handle
        </label>
        <Input
          value={profile.instagramHandle || ""}
          onChange={handleInputChange("instagramHandle")}
          className="bg-[#FAF7F5]"
          placeholder="@yourhandle"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Location</label>
        <Input
          value={profile.location || ""}
          onChange={handleInputChange("location")}
          className="bg-[#FAF7F5]"
          placeholder="City, Country"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Gender</label>
        <select
          className="w-full p-2 rounded bg-white border"
          value={profile.gender || ""}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev!,
              gender: e.target.value as Gender,
            }))
          }
        >
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* DOB */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Date of Birth
        </label>
        <Input
          type="date"
          value={profile.dob || ""}
          onChange={(e) => {
            const dob = e.target.value;
            const age = calculateAge(dob);
            setProfile((prev) => ({ ...prev!, dob, age }));
          }}
          className="bg-[#FAF7F5]"
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Age</label>
        <Input
          value={profile.age?.toString() || ""}
          disabled
          className="bg-[#FAF7F5] text-gray-500"
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Bio</label>
        <textarea
          rows={3}
          value={profile.bio || ""}
          onChange={handleInputChange("bio")}
          placeholder="Write something about yourself..."
          className="w-full p-2 rounded bg-[#FAF7F5] border"
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {profile.interests!.map((i, idx) => (
            <div
              key={idx}
              className="flex items-center bg-[#FAF7F5] px-3 py-1 rounded-full border text-sm"
            >
              {i}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-red-500 font-bold"
                onClick={() => handleArrayRemove("interests", idx)}
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <Input
          placeholder="Type an interest and press Enter"
          className="bg-[#FAF7F5]"
          onKeyDown={handleArrayAdd("interests")}
        />
      </div>

      {/* Profession */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Profession
        </label>
        <select
          className="w-full p-2 rounded bg-white border"
          value={profile.profession || ""}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev!,
              profession: e.target.value as "student" | "job",
            }))
          }
        >
          <option value="">Select...</option>
          <option value="student">Student</option>
          <option value="job">Job</option>
        </select>
      </div>

      {/* Student Fields */}
      {profile.profession === "student" && (
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Institute
            </label>
            <Input
              value={profile.institute || ""}
              onChange={handleInputChange("institute")}
              className="bg-[#FAF7F5]"
              placeholder="Your institute"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Course
            </label>
            <Input
              value={profile.course || ""}
              onChange={handleInputChange("course")}
              className="bg-[#FAF7F5]"
              placeholder="Your course/program"
            />
          </div>
        </div>
      )}

      {/* Dating Preference */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Dating Preference
        </label>
        <select
          className="w-full p-2 rounded bg-white border"
          value={profile.datingPreference || ""}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev!,
              datingPreference: e.target.value as "split" | "full",
            }))
          }
        >
          <option value="">Select...</option>
          <option value="split">Split the bill</option>
          <option value="full">Pay the full bill</option>
        </select>
      </div>

      {/* Dietary Preference */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">
          Dietary Preference
        </label>
        <select
          className="w-full p-2 rounded bg-white border"
          value={profile.dietaryPreference || ""}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev!,
              dietaryPreference: e.target.value as DietaryPreference,
            }))
          }
        >
          <option value="">Select...</option>
          <option value="veg">Veg</option>
          <option value="non-veg">Non-Veg</option>
          <option value="vegan">Vegan</option>
          <option value="other">Other</option>
        </select>
      </div>

 

      {/* Save Button */}
      <Button
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-[#E05265] hover:bg-[#E05265]/90 text-white mt-6"
      >
        Save All
      </Button>
    </div>
  );
}
