"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { Button } from "@/components/ui/button";

interface PreferencesFormProps {
  user: User;
  onComplete?: () => void;
}

// Define strict types for all options
type InterestedIn = "men" | "women" | "everyone" | "";
type LookingFor = "life_partner" | "casual" | "friendship" | "not_sure" | "";
type Religion =
  | "hindu"
  | "muslim"
  | "christian"
  | "sikh"
  | "buddhist"
  | "jain"
  | "other"
  | "";
type Workout = "regularly" | "sometimes" | "never" | "";
type Drinking = "yes" | "socially" | "no" | "";
type Smoking = "yes" | "sometimes" | "no" | "";
type Education = "high_school" | "college" | "bachelors" | "masters" | "phd" | "";

export default function PreferencesForm({ user, onComplete }: PreferencesFormProps) {
  const [interestedIn, setInterestedIn] = useState<InterestedIn>("");
  const [lookingFor, setLookingFor] = useState<LookingFor>("");
  const [religion, setReligion] = useState<Religion>("");
  const [distancePreference, setDistancePreference] = useState<number>(25);
  const [workout, setWorkout] = useState<Workout>("");
  const [drinking, setDrinking] = useState<Drinking>("");
  const [smoking, setSmoking] = useState<Smoking>("");
  const [education, setEducation] = useState<Education>("");
  const [height, setHeight] = useState<string>("170 cm");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const requiredFilled = interestedIn && lookingFor && religion;

  const handleSubmit = async () => {
    if (!requiredFilled) return;

    setIsSubmitting(true);
    try {
      const ref = doc(db, "users", user.uid);
      await updateDoc(ref, {
        preferences: {
          interestedIn,
          distancePreference,
          lifestyle: {
            workout,
            drinking,
            smoking,
            education,
            lookingFor,
            height,
            religion,
          },
        },
        preferencesCompleted: true,
        updatedAt: Date.now(),
      });
      if (onComplete) onComplete();
    } catch (err) {
      console.error("Error saving preferences:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 w-full max-w-xl shadow-2xl space-y-6">
      <h1 className="text-2xl font-bold text-[#E05265] text-center">
        Set Your Preferences
      </h1>
      <p className="text-sm text-gray-600 text-center">
        Answer these to personalize your experience.
      </p>

      {/* Interested In */}
      <div>
        <h2 className="font-semibold mb-2">Who are you interested in? *</h2>
        <div className="flex gap-2 flex-wrap">
          {(["men", "women", "everyone"] as InterestedIn[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setInterestedIn(opt)}
              className={interestedIn === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Looking For */}
      <div>
        <h2 className="font-semibold mb-2">What are you looking for? *</h2>
        <div className="flex gap-2 flex-wrap">
          {(["life_partner", "casual", "friendship", "not_sure"] as LookingFor[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setLookingFor(opt)}
              className={lookingFor === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Religion */}
      <div>
        <h2 className="font-semibold mb-2">What is your religion? *</h2>
        <div className="flex gap-2 flex-wrap">
          {(["hindu", "muslim", "christian", "sikh", "buddhist", "jain", "other"] as Religion[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setReligion(opt)}
              className={religion === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Distance Preference */}
      <div>
        <h2 className="font-semibold mb-2">Preferred distance (km)</h2>
        <input
          type="range"
          min="1"
          max="150"
          value={distancePreference}
          onChange={(e) => setDistancePreference(Number(e.target.value))}
          className="w-full accent-[#E05265]"
        />
        <p>{distancePreference} km</p>
      </div>

      {/* Workout */}
      <div>
        <h2 className="font-semibold mb-2">Workout</h2>
        <div className="flex gap-2 flex-wrap">
          {(["regularly", "sometimes", "never"] as Workout[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setWorkout(opt)}
              className={workout === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Drinking */}
      <div>
        <h2 className="font-semibold mb-2">Drinking</h2>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "socially", "no"] as Drinking[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setDrinking(opt)}
              className={drinking === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Smoking */}
      <div>
        <h2 className="font-semibold mb-2">Smoking</h2>
        <div className="flex gap-2 flex-wrap">
          {(["yes", "sometimes", "no"] as Smoking[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setSmoking(opt)}
              className={smoking === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt}
            </Button>
          ))}
        </div>
      </div>

      {/* Education */}
      <div>
        <h2 className="font-semibold mb-2">Education</h2>
        <div className="flex gap-2 flex-wrap">
          {(["high_school", "college", "bachelors", "masters", "phd"] as Education[]).map((opt) => (
            <Button
              key={opt}
              onClick={() => setEducation(opt)}
              className={education === opt ? "bg-[#E05265] text-white" : "bg-[#FAF7F5]"}
            >
              {opt.replace("_", " ")}
            </Button>
          ))}
        </div>
      </div>

      {/* Height */}
      <div>
        <h2 className="font-semibold mb-2">Height</h2>
        <input
          type="text"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="w-full border p-2 rounded-lg"
          placeholder="e.g. 178 cm or 5'10"
        />
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!requiredFilled || isSubmitting}
        className="w-full bg-[#E05265] text-white mt-6"
      >
        {isSubmitting ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}
