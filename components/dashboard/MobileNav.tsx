"use client";

import Link from "next/link";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
    { name: "Preference & LifeStyle", href: "/pref&ls" },
 
  { href: "/dashboard/verification", label: "Verify" },
  { href: "/dashboard/matches", label: "Matches" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function MobileNav({ currentPath }: { currentPath: string | null }) {
  return (
    <div className="overflow-x-auto">
      <div className="flex gap-2 px-3 py-2">
        {links.map((l) => {
          const active = currentPath === l.href;
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`whitespace-nowrap rounded px-3 py-2 text-sm border ${
                active ? "bg-gray-100 font-medium" : "bg-white hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
