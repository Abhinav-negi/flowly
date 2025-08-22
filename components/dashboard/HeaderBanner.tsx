"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function HeaderBanner() {
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) setDisplay(u.displayName || u.email || "User");
    });
    return () => unsub();
  }, []);

  const completion = 40; // TODO: calculate from profile/verification

  return (
    <div className="rounded-lg border bg-white p-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold">Hi {display} 👋</h2>
          <p className="text-sm text-gray-600">
            Complete your profile to unlock matches and start applying.
          </p>
        </div>
        <div className="min-w-[220px]">
          <p className="text-sm text-gray-600 mb-1">Profile completion</p>
          <div className="h-2 w-full rounded bg-gray-100">
            <div
              className="h-2 rounded bg-[#E05265]"
              style={{ width: `${completion}%` }}
            />
          </div>
          <p className="text-right text-xs text-gray-500 mt-1">{completion}%</p>
        </div>
      </div>
    </div>
  );
}
