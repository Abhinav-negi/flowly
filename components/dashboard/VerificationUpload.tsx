"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function VerificationUpload() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");

  function onPick() {
    fileRef.current?.click();
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  }

  async function onUpload() {
    // TODO: upload to Firebase Storage at path: /users/{uid}/ids/{filename}
    alert("Mock upload complete (wire to Storage next).");
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="font-medium mb-2">Upload ID Document</p>
      <p className="text-sm text-gray-600 mb-3">
        Acceptable: Aadhaar, Driver’s License, Passport (JPEG/PNG/PDF).
      </p>

      <input ref={fileRef} type="file" className="hidden" onChange={onChange} />
      <div className="flex items-center gap-3">
        <Button variant="outline" type="button" onClick={onPick}>
          Choose File
        </Button>
        <span className="text-sm text-gray-700 line-clamp-1">
          {fileName || "No file chosen"}
        </span>
      </div>

      <div className="mt-4">
        <Button onClick={onUpload} className="bg-[#E05265] hover:bg-[#E05265]/90">
          Upload
        </Button>
      </div>
    </div>
  );
}
