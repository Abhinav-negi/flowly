"use client"; // if using Next.js App Router (13+)

import React from "react";

function openSocialLink(appLink: string, webLink: string, delay = 500) {
  if (typeof window === "undefined") return;

  // Try to open app link
  window.location.href = appLink;

  // Fallback to web after delay
  setTimeout(() => {
    window.location.href = webLink;
  }, delay);
}

export default function SocialLinks() {
  return (
    <div className="flex gap-4 mb-4">
      <a
        href="https://twitter.com/flowly" // fallback for right-click / SEO
        onClick={(e) => {
          e.preventDefault(); // prevent default link navigation
          openSocialLink(
            "twitter://user?screen_name=flowly",
            "https://twitter.com/flowly"
          );
        }}
        aria-label="Follow Flowly on Twitter"
        className="text-[#7c706a] cursor-pointer"
      >
        Twitter
      </a>

      <a
        href="https://www.instagram.com/flowwithflowly/" // fallback for right-click / SEO
        onClick={(e) => {
          e.preventDefault();
          openSocialLink(
            "instagram://user?username=flowwithflowly",
            "https://www.instagram.com/flowwithflowly/"
          );
        }}
        aria-label="Follow Flowly on Instagram"
        className="text-[#7c706a] cursor-pointer"
      >
        Instagram
      </a>
    </div>
  );
}
