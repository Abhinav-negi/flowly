"use client";

import { useState } from "react";
import { UserProfile } from "@/lib/types/userProfile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LocationSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

export const LocationSection = ({ profile, setProfile }: LocationSectionProps) => {
  const [locLoading, setLocLoading] = useState(false);

  const fetchLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    setLocLoading(true);

    const getCurrentPosition = (): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000,
          }
        );
      });
    };

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      const response = await fetch(
        `/api/reverse-geocode?lat=${latitude}&lng=${longitude}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setProfile((prev) => ({
        ...prev!,
        lat: latitude,
        lng: longitude,
        location: data.location || `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`,
      }));
    } catch (error) {
      console.error("Location fetch error:", error);
      alert(error instanceof Error ? error.message : "Failed to fetch location");
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Location</label>
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Auto-resizing textarea for long addresses */}
        <Textarea
          value={profile?.location || ""}
          readOnly
          placeholder="City, Country"
          className="bg-[#FAF7F5] flex-1 resize-none min-h-[44px] sm:min-h-[38px] leading-snug"
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto"; // reset first
            el.style.height = `${el.scrollHeight}px`; // expand to fit
          }}
        />
        <Button
          type="button"
          onClick={fetchLocation}
          disabled={locLoading}
          className="bg-[#E05265] hover:bg-[#E05265]/90 text-white sm:w-auto w-full"
        >
          {locLoading ? "Fetching..." : "Use My Location"}
        </Button>
      </div>

      {/* Debug info - optional */}
      {profile?.lat && profile?.lng && (
        <div className="mt-1 text-xs text-gray-500">
          Coordinates: {profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};
