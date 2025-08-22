"use client";

import { Button } from "@/components/ui/button";

interface StatusCardProps {
  title: string;
  status: "Incomplete" | "Pending" | "Completed" | "Locked";
  link: string;
  actionLabel?: string; // optional action button
  onAction?: () => void;
}

export default function StatusCard({ title, status, link, actionLabel, onAction }: StatusCardProps) {
  const statusColors = {
    Completed: "bg-green-50",
    Pending: "bg-yellow-50",
    Incomplete: "bg-red-50",
    Locked: "bg-gray-100",
  };

  return (
    <div className={`p-4 rounded-xl shadow-md ${statusColors[status]}`}>
      <h2 className="font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 font-medium text-gray-600">{status}</p>

      {actionLabel && onAction && (
        <Button className="mt-4 bg-[#E05265] text-white" onClick={onAction}>
          {actionLabel}
        </Button>
      )}

      <a href={link} className="mt-4 block text-[#E05265] font-semibold hover:underline">
        Go to section
      </a>
    </div>
  );
}
