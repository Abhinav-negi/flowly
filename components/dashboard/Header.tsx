"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-sm z-50">
      <div className="max-w-11/12 mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo + Brand */}
        <div className="flex gap-3 items-center">
          <Image src="/assets/logo/heart.png" alt="logo" width={40} height={40} />
          <h1 className="text-[#E05265] font-secondary font-bold text-2xl md:text-3xl">Flowly</h1>
        </div>

        {/* Notifications */}
        <Button onClick={() => setNotificationsOpen(!notificationsOpen)}>
          Notifications
        </Button>

        {/* Notification Modal */}
        {notificationsOpen && (
          <div className="fixed inset-0 bg-black/30 flex justify-end z-50">
            <div className="w-80 bg-white p-4 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Notifications</h3>
                <Button variant="ghost" onClick={() => setNotificationsOpen(false)}>Close</Button>
              </div>
              <ul className="space-y-2">
                <li className="p-2 border rounded bg-gray-100">Profile verification pending</li>
                <li className="p-2 border rounded bg-gray-100">New match available</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
