"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from "react";

interface OtpDialogProps {
  open: boolean;
  onClose: () => void;
  onVerify: (otp: string) => void;
}

export function OtpDialog({ open, onClose, onVerify }: OtpDialogProps) {
  const [otp, setOtp] = useState("");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter OTP</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          <button
            className="rounded bg-blue-600 text-white p-2"
            onClick={() => onVerify(otp)}
          >
            Verify OTP
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
