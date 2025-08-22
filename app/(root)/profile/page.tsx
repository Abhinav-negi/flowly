"use client";

import ProfileForm from "@/components/dashboard/ProfileForm";
import ProfilePreview from "@/components/filler";

export default function ProfilePage() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#FAF7F5]">
      <section className="flex-1 w-11/12 max-w-6xl mx-auto py-10 space-y-10">
        <h1 className="text-3xl font-secondary text-gray-800 mb-6">Profile</h1>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Profile Form */}
          <div className="w-full md:w-1/2">
            <ProfileForm />
          </div>

          {/* Profile Preview */}
          <div className="w-full md:w-1/2">
            <ProfilePreview />
          </div>
        </div>
      </section>
    </div>
  );
}
