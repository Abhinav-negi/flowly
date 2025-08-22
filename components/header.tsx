"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-[92%] mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Brand */}
        <div className="flex gap-3 items-center">
          <Image
            src="/assets/logo/heart.png"
            alt="Flowly Logo"
            height={40}
            width={40}
            priority
          />
          <h1 className="text-[#E05265] font-secondary font-bold text-2xl md:text-3xl">
            Flowly
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[#E05265] font-medium">
          <Link href="#home" aria-label="Go to Home">Home</Link>
          <Link href="#perks" aria-label="See Perks">Perks</Link>
          <Link href="#how-it-works" aria-label="Learn How Flowly Works">How It Works</Link>
          <Link href="#cta" aria-label="Get Started">Get Started</Link>
          <Link href="#contact" aria-label="Contact Flowly">Contact</Link>

          <Link href="/sign-up" aria-label="Sign Up">
            <Button className="bg-[#E05265] hover:bg-pink-600 text-white">
              Sign Up
            </Button>
          </Link>
          <Link href="/sign-in" aria-label="Sign In">
            <Button
              variant="outline"
              className="border-[#E05265] text-[#a08286] hover:bg-pink-50"
            >
              Sign In
            </Button>
          </Link>
        </nav>

        {/* Mobile CTA */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/sign-up" aria-label="Sign Up">
            <Button className="bg-[#E05265] hover:bg-pink-600 text-white px-3 py-1">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
