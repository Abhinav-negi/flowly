// components/ProfilePreview.tsx
import { FaHeart, FaMusic, FaFilm, FaCoffee } from "react-icons/fa";

const ProfilePreview = () => {
  return (
    <div className="min-h-screen mt-6 ">
      <div className="max-w-sm mx-auto bg-white rounded-lg shadow p-6 border border-gray-200 space-y-12">
 
      <h2 className="text-center text-xl font-semibold text-gray-800 mb-2">
        Profile Preview
      </h2>
      <p className="text-center text-gray-600 font-medium">
        Your Personality Shines
      </p>
      <p className="text-center text-sm text-gray-500 mb-6">
        No photos needed - we focus on who you really are
      </p>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Interests</span>
          <FaHeart className="text-[#E05265] text-xl" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Music Taste</span>
          <FaMusic className="text-[#E05265] text-xl" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Movie Preferences</span>
          <FaFilm className="text-[#E05265] text-xl" />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-700">Date Style</span>
          <FaCoffee className="text-[#E05265] text-xl" />
        </div>
      </div>
      </div>

    </div>
  );
};

export default ProfilePreview;
