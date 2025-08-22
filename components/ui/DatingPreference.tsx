"use client";

import React, { useState, useRef, useEffect } from "react";
import type { UserProfile } from "@/lib/services/profileService";

type Props = {
  profile: UserProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};

export default function DatingPreferencesDropdown({ profile, setProfile }: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function toggle() {
    setOpen((v) => !v);
  }

  function handleSelect(value: "split" | "full") {
    setProfile({ ...(profile || {}), datingPreference: value } as UserProfile);
    setOpen(false);
  }

  const currentLabel =
    profile?.datingPreference === "split"
      ? "Split the bill"
      : profile?.datingPreference === "full"
      ? "Pay the full bill"
      : "Choose your preference";

  return (
    <section className="bg-white shadow rounded-xl p-6">
      <h2 className="text-2xl font-secondary text-[#E05265] mb-2">
        Dating Preferences
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        How would you prefer to handle date expenses?
      </p>
      <p className="text-xs text-gray-500 mb-6">
        This helps us match you with someone who shares similar expectations
        about date dynamics.
      </p>

      <div className="max-w-xl">
        <div
          ref={containerRef}
          className={`border rounded-lg overflow-hidden transition-shadow duration-200 ${
            open ? "shadow-md" : "shadow-sm"
          }`}
        >
          {/* Trigger */}
          <button
            type="button"
            aria-expanded={open}
            onClick={toggle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-[#FAF7F5] hover:bg-[#FAF7F5]/95 focus:outline-none focus:ring-2 focus:ring-[#E05265]/20 focus:border-[#E05265] transition-colors"
          >
            <div className="flex items-center gap-3">
              {/* small icon */}
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/60 border border-gray-100">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#E05265]">
                  <path d="M12 3l7 4v6a7 7 0 0 1-7 7 7 7 0 0 1-7-7V7l7-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="text-left">
                <div className="text-xs text-gray-600">Choose your preference</div>
                <div className="text-sm font-medium text-gray-800">{currentLabel}</div>
              </div>
            </div>

            {/* chevron */}
            <svg
              className={`w-4 h-4 text-gray-500 transform transition-transform duration-300 ${
                open ? "rotate-180" : "rotate-0"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>

          {/* Animated content */}
          <div
            className={`px-2 transition-[max-height,opacity,transform] duration-300 ease-out overflow-hidden ${
              open ? "max-h-[220px] opacity-100 translate-y-0" : "max-h-0 opacity-0 translate-y-2"
            }`}
          >
            <ul role="list" className="py-2">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect("split")}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect("split")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-150 ${
                    profile?.datingPreference === "split"
                      ? "bg-[#E05265]/10 text-[#E05265] border border-[#E05265]/20"
                      : "hover:bg-[#FAF7F5]"
                  }`}
                >
                  {/* option icon */}
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white/60 border border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12h18" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M7 8v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M17 8v8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Split the bill</div>
                    <div className="text-xs text-gray-500">Share expenses fairly on dates</div>
                  </div>

                  {profile?.datingPreference === "split" && (
                    <div className="text-[#E05265] font-bold">✓</div>
                  )}
                </button>
              </li>

              <li className="mt-2">
                <button
                  type="button"
                  onClick={() => handleSelect("full")}
                  onKeyDown={(e) => e.key === "Enter" && handleSelect("full")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors duration-150 ${
                    profile?.datingPreference === "full"
                      ? "bg-[#E05265]/10 text-[#E05265] border border-[#E05265]/20"
                      : "hover:bg-[#FAF7F5]"
                  }`}
                >
                  <div className="w-9 h-9 flex items-center justify-center rounded-md bg-white/60 border border-gray-100">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                      <path d="M8 7h8v10H8z" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Pay the full bill</div>
                    <div className="text-xs text-gray-500">Prefer to cover the full expense</div>
                  </div>

                  {profile?.datingPreference === "full" && (
                    <div className="text-[#E05265] font-bold">✓</div>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
