"use client";

import Header from "@/components/header";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Perks from "@/components/Perks";
import HowItWorks from "@/components/HowItWorks";
import Footerz from "@/components/Footerz";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col items-center text-6xl mt-10 md:mt-0 font-bold justify-center w-full bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6] mx-auto"
      >
        <Image
          src="/assets/logo/heart-big.png"
          alt="Flowly Heart Logo"
          width={500}
          height={500}
          priority
          className=" mt-10  w-[500px] sm:mt-0 md:w-[500px] lg:w-[600px] h-auto"
        />

        <h1
          id="perks"
          className="text-[#E05265]  text-center leading-snug font-secondary mb-5 text-2xl sm:text-3xl md:text-4xl"
        >
          Find Love Beyond First Sight
        </h1>

        <p
          className="text-center leading-snug font-app font-light mb-5 text-base sm:text-lg md:text-xl lg:text-2xl w-[90%] sm:w-[80%] md:w-[70%] lg:w-[50%] mx-auto"
        >
          Experience the thrill of genuine connection through conversation, not
          photos. Flowly brings together local singles who value personality
          over appearance, creating meaningful relationships one conversation at
          a time.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col justify-center items-center space-y-2">
          <Link href="/sign-up" aria-label="Start your story on Flowly">
            <Button className="bg-[#E05265] text-[18px] w-[150px] h-[45px] sm:w-[180px] sm:h-[50px] md:w-[200px] md:h-[55px] lg:w-[225px] lg:h-[59px] hover:bg-pink-600 text-white px-3 py-1">
              Start Your Story
            </Button>
          </Link>
          <p className="font-extralight text-[1rem] text-[#7C706A]">
            Maybe this is meant to be
          </p>
        </div>
        <Perks />
      </section>

      <HowItWorks />

      {/* Secondary CTA */}
      <section
        id="cta"
        className="flex flex-col items-center justify-center w-full bg-[#ECCFC6] mx-auto px-4 py-20 text-center"
      >
        <h2 className="font-bold font-secondary mt-20 text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
          Ready to Find Your Match?
        </h2>

        <p className="mt-6 sm:mt-10 text-lg sm:text-xl md:text-2xl font-light text-[#7c706a] w-full sm:w-[80%] md:w-[60%] lg:w-[50%] mx-auto">
          Join thousands of singles who are discovering genuine connections
          through personality-first dating. Your perfect match is waiting.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-10 mb-20">
          <Link href="/sign-up" aria-label="Sign up to Flowly">
            <Button className="bg-[#E05265] text-[18px] w-[150px] h-[45px] sm:w-[180px] sm:h-[50px] md:w-[200px] md:h-[55px] lg:w-[225px] lg:h-[59px] hover:bg-pink-600 text-white px-3 py-1">
              Sign Up
            </Button>
          </Link>

          <Link href="#how-it-works" aria-label="Learn how Flowly works">
            <Button
              variant="outline"
              className="border-[#E05265] bg-[#ECCFC6] hover:bg-white text-[16px] sm:text-[18px] w-[150px] h-[45px] sm:w-[180px] sm:h-[50px] md:w-[200px] md:h-[55px] lg:w-[225px] lg:h-[59px] px-3 py-1"
            >
              Learn More
            </Button>
          </Link>
        </div>
      </section>

      <Footerz />
    </div>
  );
}
