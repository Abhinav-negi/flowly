"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/dashboard/profile" },
  { name: "Verification", href: "/dashboard/verification" },
  { name: "Matches", href: "/dashboard/matches" },
  { name: "Notifications", href: "/dashboard/notifications" },
  { name: "Settings", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white p-4 shadow-md h-screen sticky top-0">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-2 rounded-md mb-2 transition ${
              isActive ? "bg-[#FAF7F5]" : "hover:underline underline-offset-4 decoration-[#E05265]"
            } text-[#E05265]`}
          >
            {item.name}
          </Link>
        );
      })}
    </aside>
  );
}
