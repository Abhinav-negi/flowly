"use client";

import { AuthForm } from "@/components/authform";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import React from "react";

const SignUp = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect if logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-[#E05265] text-center leading-snug font-secondary mb-5 
                text-2xl sm:text-3xl md:text-4xl "
      >
        Join Flowly
      </h1>

      <p className="text-[1rem] text-[#7C706A] font-light">
        Create your account and start connecting with genuine people in your
        local community. No photos, just authentic conversations.
      </p>

      <AuthForm mode="signup" />

      <div className="w-full flex flex-col max-w-md justify-center items-center text-center mx-auto mt-4 space-y-7 text-sm">
        {/* Privacy */}
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="h-5 w-5 text-blue-600"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l7 4v5a9 9 0 0 1-7 8 9 9 0 0 1-7-8V7l7-4z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span className="text-green-600 font-medium text-[1rem]">
            We respect your privacy
          </span>
        </div>

        {/* Community */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E05265]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              className="h-4 w-4"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Front person */}
              <circle cx="12" cy="8" r="3" />
              <path d="M8 20v-2a4 4 0 0 1 8 0v2" />

              {/* Left person */}
              <circle cx="5" cy="10" r="2" />
              <path d="M3 20v-2a3 3 0 0 1 3-3h1" />

              {/* Right person */}
              <circle cx="19" cy="10" r="2" />
              <path d="M17 20v-2a3 3 0 0 1 3-3h1" />
            </svg>
          </div>
          <span className="font-extralight text-[1rem] text-[#7C706A]">
            Meet people in your community
          </span>
        </div>

        {/* Heart / Personality */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E05265]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              className="h-4 w-4"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 21s-6-4.35-9-7.35C.67 11.33.67 7.67 3 5.34c2.34-2.34 6-2.34 8.34 0L12 6.66l.66-.66c2.34-2.34 6-2.34 8.34 0 2.33 2.33 2.33 5.99 0 8.31-3 3-9 7.35-9 7.35z" />
            </svg>
          </div>
          <span className="font-extralight text-[1rem] text-[#7C706A]">
            Find people by personality
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
