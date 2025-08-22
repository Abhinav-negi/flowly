import React from "react";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import Footerz from "@/components/Footerz";


function Layout({children}:{children : React.ReactNode}){

    return (
        <div className="flex flex-col min-h-screen bg-[#FAF7F5]">
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 ">
        {/* Logo + Brand */}
        <div className="flex gap-3 items-center">
          <Image
            src="/assets/logo/heart.png"
            alt="logo"
            height={40}
            width={40}
          />
          <h1 className="text-[#E05265] font-secondary font-bold text-2xl md:text-3xl">
            Flowly
          </h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[#E05265] font-medium">
          <a href="#home" className="hover:text-pink-600 transition">Home</a>
          <a href="#perks" className="hover:text-pink-600 transition">Perks</a>
          <a href="#how-it-works" className="hover:text-pink-600 transition">How It Works</a>
          {/* <a href="#cta" className="hover:text-pink-600 transition">Get Started</a> */}
          <a href="#contact" className="hover:text-pink-600 transition">Contact</a>

          {/* <Button className="bg-[#E05265] hover:bg-pink-600">Sign Up</Button>
          <Button variant="outline" className="border-[#E05265] text-[#a08286] hover:bg-pink-50">
            Sign In
          </Button> */}
        </nav>

        {/* Mobile CTA */}
        <div className="flex justify-center  md:hidden items-center gap-2">
          {/* <Button className="bg-[#E05265] hover:bg-pink-600 text-white px-3 py-1">
            Sign Up
          </Button> */}
                 <h1
          id="perks"
          className="text-[#E05265] text-center  font-secondary 
                text-[1rem]  "
        >
          Find Love Beyond First Sight
        </h1>
        </div>
      </div>
    </header>



<section className="flex w-[90%] sm:w-[70%] md:w-[50%] lg:w-[30%] my-20 mx-auto text-center">
  {children}
</section>


<Footerz/>

        </div>
    )
}

export default Layout;