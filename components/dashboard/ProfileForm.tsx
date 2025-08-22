"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getProfile,
  updateProfile,
} from "@/lib/services/profileService";

import { UserProfile } from "@/lib/types/userProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// --- Helper: calculate age from DOB
function calculateAge(dob: string): number | undefined {
  if (!dob) return undefined;
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return undefined;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : undefined;
}

export default function ProfileForm() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Fetch profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        const data = await getProfile(user.uid);

        if (data) {
          const age = data.dob ? calculateAge(data.dob) : undefined;
          setProfile({ ...data, age });
        } else {
          // Create a complete UserProfile object with defaults
          setProfile({
            userId: user.uid,
            name: user.displayName || "",
            email: user.email || "",
            interests: [],
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
            dateCards: [],
            mobileNumber: "",
            instagramHandle: "",
            age: undefined,
            dob: "",
            gender: undefined,
            dietaryPreference: undefined,
            workLifeStatus: undefined,
            studyField: "",
            hobbies: [],
            bio: "",
            profession: undefined,
            institute: "",
            course: "",
            location: "",
            datingPreference: undefined,
          } as UserProfile);
        }
      } else {
        router.replace("/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  async function handleSave() {
    if (!uid || !profile) return;
    setLoading(true);

    // Remove undefined fields before saving
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

  return (
    <div className="space-y-6">
      {saved && (
        <p className="text-green-600 font-semibold">Saved!</p>
      )}

      {/* Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Full Name</label>
        <Input
          className="bg-[#FAF7F5]"
          value={profile.name || ""}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          placeholder="Your name"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Email</label>
        <Input className="bg-[#FAF7F5]" value={profile.email || ""} disabled />
      </div>

      {/* Mobile */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Mobile</label>
        <Input
          className="bg-[#FAF7F5]"
          value={profile.mobileNumber || ""}
          onChange={(e) =>
            setProfile({ ...profile, mobileNumber: e.target.value })
          }
          placeholder="Phone number"
        />
      </div>

      {/* Instagram Handle */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Instagram Handle</label>
        <Input
          className="bg-[#FAF7F5]"
          value={profile.instagramHandle || ""}
          onChange={(e) =>
            setProfile({ ...profile, instagramHandle: e.target.value })
          }
          placeholder="@yourhandle"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Location</label>
        <Input
          className="bg-[#FAF7F5]"
          value={profile.location || ""}
          onChange={(e) =>
            setProfile({ ...profile, location: e.target.value })
          }
          placeholder="City, Country"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Gender</label>
        <select
          className="w-full p-2 rounded bg-[#FAF7F5] border"
          value={profile.gender || "male"}
          onChange={(e) =>
            setProfile({
              ...profile,
              gender: e.target.value as "male" | "female" | "other",
            })
          }
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* DOB */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Date of Birth</label>
        <Input
          type="date"
          className="bg-[#FAF7F5]"
          value={profile.dob || ""}
          onChange={(e) => {
            const newDob = e.target.value;
            const newAge = calculateAge(newDob);
            setProfile({ ...profile, dob: newDob, age: newAge });
          }}
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Age</label>
        <Input
          className="bg-[#FAF7F5] text-gray-500"
          value={profile.age !== undefined ? profile.age.toString() : ""}
          disabled
        />
      </div>

      {/* Bio */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Bio</label>
        <textarea
          className="w-full p-2 rounded bg-[#FAF7F5] border"
          rows={3}
          value={profile.bio || ""}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          placeholder="Write something about yourself..."
        />
      </div>

      {/* Interests */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Interests</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {(profile.interests || []).map((interest, idx) => (
            <div
              key={idx}
              className="flex items-center bg-[#FAF7F5] px-3 py-1 rounded-full border text-sm"
            >
              {interest}
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-red-500 font-bold"
                onClick={() =>
                  setProfile({
                    ...profile,
                    interests: (profile.interests || []).filter((_, i) => i !== idx),
                  })
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>
        <Input
          className="bg-[#FAF7F5]"
          placeholder="Type an interest and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.currentTarget.value.trim() !== "") {
              e.preventDefault();
              const newInterest = e.currentTarget.value.trim();
              if (!(profile.interests || []).includes(newInterest)) {
                setProfile({
                  ...profile,
                  interests: [...(profile.interests || []), newInterest],
                });
              }
              e.currentTarget.value = "";
            }
          }}
        />
      </div>

      {/* Profession */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Profession</label>
        <select
          className="w-full p-2 rounded bg-[#FAF7F5] border"
          value={profile.profession || ""}
          onChange={(e) =>
            setProfile({ ...profile, profession: e.target.value as "student" | "job" })
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
            <label className="block text-gray-700 font-medium mb-1">Institute</label>
            <Input
              className="bg-[#FAF7F5]"
              value={profile.institute || ""}
              onChange={(e) => setProfile({ ...profile, institute: e.target.value })}
              placeholder="Your institute"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Course</label>
            <Input
              className="bg-[#FAF7F5]"
              value={profile.course || ""}
              onChange={(e) => setProfile({ ...profile, course: e.target.value })}
              placeholder="Your course/program"
            />
          </div>
        </div>
      )}

      {/* Dating Preference */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Dating Preference</label>
        <Select
          value={profile?.datingPreference || ""}
          onValueChange={(value) =>
            setProfile({ ...profile!, datingPreference: value as "split" | "full" })
          }
        >
          <SelectTrigger className="w-full bg-[#FAF7F5] border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#E05265]/50 focus:border-[#E05265] transition">
            <SelectValue placeholder="Choose your preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="split">Split the bill</SelectItem>
            <SelectItem value="full">Pay the full bill</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dietary Preference */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Dietary Preference</label>
        <Select
          value={profile?.dietaryPreference || ""}
          onValueChange={(value) =>
            setProfile({ ...profile!, dietaryPreference: value as "veg" | "non-veg" | "vegan" | "other" })
          }
        >
          <SelectTrigger className="w-full bg-[#FAF7F5] border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium focus:ring-2 focus:ring-[#E05265]/50 focus:border-[#E05265] transition">
            <SelectValue placeholder="Choose your dietary preference" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="veg">Veg</SelectItem>
            <SelectItem value="non-veg">Non-Veg</SelectItem>
            <SelectItem value="vegan">Vegan</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
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
