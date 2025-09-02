"use client";
import { useState } from "react";
import { UserProfile } from "@/lib/types/userProfile";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface LocationSectionProps {
  profile: UserProfile;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
}

interface GeocodeApiSuccessResponse {
  location: string;
  formatted: string | null;
  components?: Record<string, string>;
}

interface GeocodeApiErrorResponse {
  error: string;
  details?: string;
}

type GeocodeApiResponse = GeocodeApiSuccessResponse | GeocodeApiErrorResponse;

interface IPApiResponse {
  city?: string;
  country?: string;
  error?: boolean;
}

export const LocationSection = ({ profile, setProfile }: LocationSectionProps) => {
  const [locLoading, setLocLoading] = useState<boolean>(false);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 60000,
        }
      );
    });
  };

  const isSuccessResponse = (response: GeocodeApiResponse): response is GeocodeApiSuccessResponse => {
    return 'location' in response && !('error' in response);
  };

  const fetchWithRetry = async (
    latitude: number, 
    longitude: number, 
    retries = 3
  ): Promise<GeocodeApiResponse> => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(
          `/api/reverse-geocode?lat=${latitude}&lng=${longitude}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 429) {
          const waitTime = Math.pow(2, i) * 1000;
          console.log(`Rate limited, waiting ${waitTime}ms before retry ${i + 1}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json() as GeocodeApiResponse;
        return data;
      } catch (error) {
        if (i === retries - 1) throw error;
        const waitTime = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
    throw new Error('All retries failed');
  };

  const getIPBasedLocation = async (): Promise<string | null> => {
    try {
      const ipResponse = await fetch('https://ipapi.co/json/');
      if (ipResponse.ok) {
        const ipData = await ipResponse.json() as IPApiResponse;
        if (ipData.city && ipData.country && !ipData.error) {
          return `${ipData.city}, ${ipData.country}`;
        }
      }
    } catch (error) {
      console.warn('IP-based location fallback failed:', error);
    }
    return null;
  };

  const fetchLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser");
      return;
    }

    setLocLoading(true);

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      let locationName: string | null = null;

      // Try primary geocoding API
      try {
        const data = await fetchWithRetry(latitude, longitude);
        
        if (isSuccessResponse(data)) {
          locationName = data.location || data.formatted || null;
        } else {
          console.warn('Geocoding API returned error:', data.error);
        }
      } catch (error) {
        console.warn('Primary geocoding failed:', error);
      }

      // Fallback to IP-based location if primary fails
      if (!locationName) {
        locationName = await getIPBasedLocation();
      }

      // Final fallback to coordinates
      if (!locationName) {
        locationName = `${latitude.toFixed(3)}, ${longitude.toFixed(3)}`;
      }

      setProfile((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          lat: latitude,
          lng: longitude,
          location: locationName,
        };
      });

    } catch (error) {
      console.error("Location fetch error:", error);
      
      let errorMessage = "Failed to fetch location";
      
      if (error instanceof Error) {
        if (error.message.includes("User denied")) {
          errorMessage = "Location access denied. Please allow location access and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Location request timed out. Please try again.";
        } else if (error.message.includes("429")) {
          errorMessage = "Location service is temporarily busy. Please try again in a moment.";
        } else if (error.message.includes("500")) {
          errorMessage = "Location service is temporarily unavailable. You can enter your location manually.";
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLocLoading(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setProfile((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        location: e.target.value,
      };
    });
  };

  const handleTextareaInput = (e: React.FormEvent<HTMLTextAreaElement>): void => {
    const target = e.currentTarget;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  return (
    <div>
      <label className="block text-gray-700 font-medium mb-1">Location</label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Textarea
          value={profile?.location || ""}
          onChange={handleLocationChange}
          placeholder="City, Country (or click 'Use My Location')"
          className="bg-[#FAF7F5] flex-1 resize-none min-h-[44px] sm:min-h-[38px] leading-snug"
          rows={1}
          onInput={handleTextareaInput}
        />
        <Button
          type="button"
          onClick={fetchLocation}
          disabled={locLoading}
          className="bg-[#E05265] hover:bg-[#E05265]/90 text-white sm:w-auto w-full disabled:opacity-50"
        >
          {locLoading ? "Fetching..." : "Use My Location"}
        </Button>
      </div>

      {profile?.lat && profile?.lng && (
        <div className="mt-1 text-xs text-gray-500">
          Coordinates: {profile.lat.toFixed(4)}, {profile.lng.toFixed(4)}
        </div>
      )}
    </div>
  );
};