"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthForm } from "@/components/authform";

const SignIn = () => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  // Redirect if already logged in
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        setChecking(false);
      }
    });
    return () => unsub();
  }, [router]);

  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Checking session...
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
        Sign in to continue your Flowly journey and reconnect with your
        community.
      </p>

      <AuthForm mode="signin" />
    </div>
  );
};

export default SignIn;
