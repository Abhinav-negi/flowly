"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import  LogoutButton  from "@/components/dashboard/LogoutButton";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
// import { Menu } from "lucide-react";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
  { name: "Verification", href: "/verification" },
  { name: "Matches", href: "/matches" },
  { name: "Notifications", href: "/notifications" },
  { name: "Settings", href: "/settings" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6 font-medium">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-4 py-2 rounded-md transition ${
                isActive
                  ? "bg-[#FAF7F5]"
                  : "hover:underline underline-offset-4 decoration-[#E05265]"
              } text-[#E05265]`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Navigation */}
<div className="md:hidden">
  <Sheet>
    <SheetTrigger asChild>
      <button
        className="w-12 h-12 rounded-full bg-[#FAF7F5] flex flex-col justify-center items-center gap-1 p-2 hover:scale-105 transition-transform"
        aria-label="Open Menu"
      >
        {/* Hamburger Lines */}
        <span className="block w-6 h-0.5 bg-[#E05265] rounded"></span>
        <span className="block w-6 h-0.5 bg-[#E05265] rounded"></span>
        <span className="block w-6 h-0.5 bg-[#E05265] rounded"></span>
      </button>
    </SheetTrigger>

    <SheetContent side="right" className="w-64 p-4 flex flex-col h-full bg-white">
          <SheetHeader className="hidden">
    <SheetTitle className="sr-only hidden">Main Navigation</SheetTitle> 
    {/* sr-only hides it visually but keeps it accessible */}
  </SheetHeader>
      {/* User Info */}
      {user && (
        <div className="mb-6 p-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-[#E05265]">{user.displayName || "User"}</h2>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      )}

      {/* Navigation Links */}
      <div className="flex flex-col gap-3 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md transition ${
                isActive
                  ? "bg-[#FAF7F5]"
                  : "hover:underline underline-offset-4 decoration-[#E05265]"
              } text-[#E05265]`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="mt-auto flex justify-center pt-4 border-t border-gray-200">
        <LogoutButton />
      </div>
    </SheetContent>
  </Sheet>
</div>

    </>
  );
}
