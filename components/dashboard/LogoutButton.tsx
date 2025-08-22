"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut(auth);
    router.replace("/auth/sign-in");
  }

  return (
    <Button className="bg-[#E05265] hover:bg-pink-600 w-full" onClick={handleLogout} variant="destructive">
      Logout
    </Button>
  );
}
