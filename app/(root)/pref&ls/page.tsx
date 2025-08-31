"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase"; // Adjust import path as needed
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation"; // For navigation

interface PreferencesFormData {
  interestedIn: "men" | "women" | "everyone" | "";
  distancePreference: number;
  workout: "regularly" | "sometimes" | "never" | "";
  drinking: "yes" | "socially" | "no" | "";
  smoking: "yes" | "sometimes" | "no" | "";
  education: "high_school" | "in_college" | "bachelors" | "masters" | "phd" |"posgraduation" |"undergraduation"|"";
  lookingFor: "life_partner" | "casual" | "friendship" | "not_sure" | "";
  height: number;
  heightUnit: "cm" | "ft";
  religion:
    | "hindu"
    | "muslim"
    | "christian"
    | "sikh"
    | "buddhist"
    | "jain"
    | "other"
    | "";
  minAge: number;
  maxAge: number;
}

const PreferencesLifestyle = () => {
  const [formData, setFormData] = useState<PreferencesFormData>({
    interestedIn: "",
    distancePreference: 25,
    workout: "",
    drinking: "",
    smoking: "",
    education: "",
    lookingFor: "",
    height: 170,
    heightUnit: "cm",
    religion: "",
    minAge: 19,
    maxAge: 28,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      
      if (currentUser) {
        // Load existing preferences if available
        loadExistingPreferences(currentUser.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Load existing preferences from Firestore
  const loadExistingPreferences = async (userId: string) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        if (userData.preferences) {
          const prefs = userData.preferences;
          const lifestyle = prefs.lifestyle || {};
          
          // Parse height back to number
          let heightValue = 170;
          let heightUnitValue: "cm" | "ft" = "cm";
          
          if (lifestyle.height) {
            if (lifestyle.height.includes("cm")) {
              heightValue = parseInt(lifestyle.height);
              heightUnitValue = "cm";
            } else if (lifestyle.height.includes("'")) {
              // Parse feet and inches
              const feet = parseInt(lifestyle.height);
              const inches = lifestyle.height.includes("6") ? 0.5 : 0;
              heightValue = feet + inches;
              heightUnitValue = "ft";
            }
          }

          setFormData({
            interestedIn: prefs.interestedIn || "",
            distancePreference: prefs.distancePreference || 25,
            workout: lifestyle.workout || "",
            drinking: lifestyle.drinking || "",
            smoking: lifestyle.smoking || "",
            education: lifestyle.education || "",
            lookingFor: lifestyle.lookingFor || "",
            height: heightValue,
            heightUnit: heightUnitValue,
            religion: lifestyle.religion || "",
            minAge: userData.ageRangePreference?.minAge || 19,
            maxAge: userData.ageRangePreference?.maxAge || 28,
          });
        }
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const handleChange = <K extends keyof PreferencesFormData>(
    field: K,
    value: PreferencesFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };



  const handleSubmit = async () => {
    // Check if user is authenticated
    if (!user) {
      alert("Please log in to save your preferences");
      router.push("/login"); // Redirect to login page
      return;
    }

    // Check if at least basic preferences are filled
    const hasBasicPreferences = formData.interestedIn && formData.lookingFor && formData.religion;
    
    if (!hasBasicPreferences) {
      setSuccessMessage("");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert height to string format for storage
      const heightString = formData.heightUnit === "cm" 
        ? `${formData.height} cm`
        : `${Math.floor(formData.height)}'${formData.height % 1 === 0.5 ? "6" : "0"}"`;

      // Map education values to match UserProfile interface
      const educationMapping: Record<string, "high_school" | "college" | "bachelors" | "masters" | "phd"> = {
        "high_school": "high_school",
        "intermediate": "college",
        "ug": "bachelors",
        "pg": "masters", 
        "in_college": "college",
        "phd": "phd"
      };

      // Prepare the preferences object - only include filled fields
      const lifestyle: {
        workout?: "regularly" | "sometimes" | "never";
        drinking?: "yes" | "socially" | "no";
        smoking?: "yes" | "sometimes" | "no";
        education?: "high_school" | "college" | "bachelors" | "masters" | "phd";
        lookingFor?: "life_partner" | "casual" | "friendship" | "not_sure";
        height?: string;
        religion?: "hindu" | "muslim" | "christian" | "sikh" | "buddhist" | "jain" | "other";
      } = {};
      
      if (formData.workout) lifestyle.workout = formData.workout;
      if (formData.drinking) lifestyle.drinking = formData.drinking;
      if (formData.smoking) lifestyle.smoking = formData.smoking;
      if (formData.education) {
        lifestyle.education = educationMapping[formData.education] || "college";
      }
      if (formData.lookingFor) lifestyle.lookingFor = formData.lookingFor;
      if (formData.religion) lifestyle.religion = formData.religion;
      
      // Always include height
      lifestyle.height = heightString;

      // Only create preferences update if required fields are filled
      if (!formData.interestedIn || !formData.lookingFor || !formData.religion) {
        return;
      }

      const preferencesUpdate = {
        interestedIn: formData.interestedIn as "men" | "women" | "everyone",
        distancePreference: formData.distancePreference,
        lifestyle: lifestyle
      };

      // Prepare update object
      const updateData: {
        preferences: typeof preferencesUpdate;
        updatedAt: number;
        ageRangePreference?: {
          minAge: number;
          maxAge: number;
        };
        preferencesComplete?: boolean;
      } = {
        preferences: preferencesUpdate,
        updatedAt: Date.now(),
      };

      // Add age range preferences if they're different from defaults
      if (formData.minAge !== 19 || formData.maxAge !== 28) {
        updateData.ageRangePreference = {
          minAge: formData.minAge,
          maxAge: formData.maxAge
        };
      }

      // Mark preferences as complete if all required fields are filled
      const isComplete = formData.interestedIn && formData.lookingFor && 
                        formData.workout && formData.drinking && 
                        formData.smoking && formData.education && formData.religion;
      
      if (isComplete) {
        updateData.preferencesComplete = true;
      }

      // Update user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updateData);

      console.log("Preferences saved successfully:", preferencesUpdate);
      setSuccessMessage("Details updated successfully!");
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
      // Optional: Navigate to dashboard or next step
      // router.push('/dashboard');
      
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSuccessMessage("");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF7F5] to-[#EFD9D1] px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <h1 className="text-2xl font-bold text-[#E05265] mb-4">
            Authentication Required
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in to access your preferences and lifestyle settings.
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-[#E05265] text-white hover:bg-pink-600"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF7F5] to-[#EFD9D1] px-4 py-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 md:p-8 w-full max-w-xl shadow-2xl space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-[#E05265] text-center mb-6">
          Preferences & Lifestyle
        </h1>

        <p className="text-sm text-gray-600 text-center mb-4">
          Fill out the sections you want to share. You can save partial preferences and complete them later.
        </p>

        {/* Interested In */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Who are you interested in? <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(["men", "women", "everyone"] as const).map((val) => (
              <Button
                key={val}
                onClick={() => handleChange("interestedIn", val)}
                className={`${
                  formData.interestedIn === val
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Distance Preference */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            How far would you like your matches to be?
          </h2>
          <input
            type="range"
            min="1"
            max="150"
            value={formData.distancePreference}
            onChange={(e) =>
              handleChange("distancePreference", Number(e.target.value))
            }
            className="w-full accent-[#E05265]"
          />
          <p className="text-sm text-gray-600 mt-1">
            {formData.distancePreference} km
          </p>
        </div>

        {/* Age Range */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            What age range would you like to date?
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm block mb-1">Min Age</label>
              <input
                type="range"
                min="18"
                max="50"
                value={formData.minAge}
                onChange={(e) => {
                  const minAge = Number(e.target.value);
                  handleChange("minAge", minAge);
                  // Ensure max age is always >= min age
                  if (formData.maxAge < minAge) {
                    handleChange("maxAge", minAge);
                  }
                }}
                className="w-full accent-[#E05265]"
              />
              <p className="text-center text-sm">{formData.minAge}</p>
            </div>
            <div className="flex-1">
              <label className="text-sm block mb-1">Max Age</label>
              <input
                type="range"
                min="18"
                max="50"
                value={formData.maxAge}
                onChange={(e) => {
                  const maxAge = Number(e.target.value);
                  handleChange("maxAge", maxAge);
                  // Ensure min age is always <= max age
                  if (formData.minAge > maxAge) {
                    handleChange("minAge", maxAge);
                  }
                }}
                className="w-full accent-[#E05265]"
              />
              <p className="text-center text-sm">{formData.maxAge}</p>
            </div>
          </div>
        </div>

        {/* What are you looking for */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            What are you looking for? <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(["life_partner", "casual", "friendship", "not_sure"] as const).map(
              (opt) => (
                <Button
                  key={opt}
                  onClick={() => handleChange("lookingFor", opt)}
                  className={`${
                    formData.lookingFor === opt
                      ? "bg-[#E05265] text-white"
                      : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                  }`}
                >
                  {opt.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
                </Button>
              )
            )}
          </div>
        </div>

        {/* Workout */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            How often do you work out?
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(["regularly", "sometimes", "never"] as const).map((opt) => (
              <Button
                key={opt}
                onClick={() => handleChange("workout", opt)}
                className={`${
                  formData.workout === opt
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Drinking */}
        <div>
          <h2 className="text-lg font-semibold mb-2">How often do you drink?</h2>
          <div className="flex gap-2 flex-wrap">
            {(["yes", "socially", "no"] as const).map((opt) => (
              <Button
                key={opt}
                onClick={() => handleChange("drinking", opt)}
                className={`${
                  formData.drinking === opt
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Smoking */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Do you smoke?</h2>
          <div className="flex gap-2 flex-wrap">
            {(["yes", "sometimes", "no"] as const).map((opt) => (
              <Button
                key={opt}
                onClick={() => handleChange("smoking", opt)}
                className={`${
                  formData.smoking === opt
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            What is your education qualification?
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(
              [
                "high_school",
                "in_college",
                "bachelors",
                "masters",
                "phd",
                "posgraduation",
                "undergraduation"
              ] as const
            ).map((opt) => (
              <Button
                key={opt}
                onClick={() => handleChange("education", opt)}
                className={`${
                  formData.education === opt
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {opt.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        {/* Height */}
        <div>
          <h2 className="text-lg font-semibold mb-2">What is your height?</h2>
          <div className="flex gap-2 mb-2">
            <Button
              onClick={() => {
                const newUnit = "cm";
                if (formData.heightUnit !== newUnit) {
                  // Convert current height to cm
                  const newHeight = formData.heightUnit === "ft" 
                    ? Math.round(formData.height * 30.48)
                    : formData.height;
                  handleChange("height", newHeight);
                  handleChange("heightUnit", newUnit);
                }
              }}
              className={`${
                formData.heightUnit === "cm"
                  ? "bg-[#E05265] text-white"
                  : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
              }`}
            >
              cm
            </Button>
            <Button
              onClick={() => {
                const newUnit = "ft";
                if (formData.heightUnit !== newUnit) {
                  // Convert current height to feet
                  const newHeight = formData.heightUnit === "cm" 
                    ? Math.round((formData.height / 30.48) * 2) / 2 // Round to nearest 0.5
                    : formData.height;
                  handleChange("height", newHeight);
                  handleChange("heightUnit", newUnit);
                }
              }}
              className={`${
                formData.heightUnit === "ft"
                  ? "bg-[#E05265] text-white"
                  : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
              }`}
            >
              ft
            </Button>
          </div>
          <select
            value={formData.height}
            onChange={(e) => handleChange("height", Number(e.target.value))}
            className="w-full border rounded-xl p-2 bg-white"
          >
            {formData.heightUnit === "cm"
              ? Array.from({ length: 81 }, (_, i) => 140 + i).map((cm) => (
                  <option key={cm} value={cm}>
                    {cm} cm
                  </option>
                ))
              : Array.from({ length: 25 }, (_, i) => 4 + i * 0.5).map((ft) => (
                  <option key={ft} value={ft}>
                    {Math.floor(ft)}&apos; {ft % 1 === 0.5 ? "6" : "0"}&quot;
                  </option>
                ))}
          </select>
        </div>

        {/* Religion */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            What is your religion? <span className="text-red-500">*</span>
          </h2>
          <div className="flex gap-2 flex-wrap">
            {(
              ["hindu", "muslim", "christian", "sikh", "buddhist", "jain", "other"] as const
            ).map((opt) => (
              <Button
                key={opt}
                onClick={() => handleChange("religion", opt)}
                className={`${
                  formData.religion === opt
                    ? "bg-[#E05265] text-white"
                    : "bg-[#FAF7F5] text-[#7C706A] hover:bg-[#E05265]/10"
                }`}
              >
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
              {successMessage}
            </div>
          )}
          
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !formData.interestedIn || !formData.lookingFor || !formData.religion}
            className="w-full bg-[#E05265] text-white mt-6 hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Saving..." : "Save Preferences"}
          </Button>
          
          <p className="text-xs text-gray-500 text-center mt-2">
            * Required fields: Interested in, Looking for, and Religion. Other fields are optional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreferencesLifestyle;