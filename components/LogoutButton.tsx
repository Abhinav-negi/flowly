"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase"; // adjust path if needed
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // redirect to login page
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full py-2 px-4 mt-4 bg-[#E05265] text-white rounded-lg hover:bg-pink-600 transition-colors"
    >
      Logout
    </button>
  );
}
