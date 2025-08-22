"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Navigation from "@/components/dashboard/navigation";
import FooterApp from "@/components/dashboard/Footerapp";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#FAF7F5]">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex gap-2 sm:gap-3 items-center">
            <Image src="/assets/logo/heart.png" alt="logo" height={36} width={36} />
            <h1 className="text-[#E05265] font-secondary font-bold text-xl sm:text-2xl md:text-3xl">
              Flowly
            </h1>
          </div>
          <Navigation />
        </div>
      </header>

      {/* Notifications Modal */}
      {notificationsOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
          <div className="w-72 sm:w-80 bg-white p-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Notifications</h3>
              <Button variant="ghost" onClick={() => setNotificationsOpen(false)}>
                Close
              </Button>
            </div>
            <ul className="space-y-2 min-h-[150px] flex flex-col justify-center">
              <li className="p-2 border rounded bg-gray-100">Profile verification pending</li>
              <li className="p-2 border rounded bg-gray-100">New match available</li>
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-20  sm:pt-20 md:pt-15 lg:pt-15 bg-gradient-to-b from-[#FAF7F5] to-[#ECCFC6]">
        {children}
      </main>

      {/* Footer */}
      <FooterApp />
    </div>
  );
}
