"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export default function LivePhoto() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hasStream, setHasStream] = useState(false);
  const [shot, setShot] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setHasStream(true);
        }
      } catch (e) {
        console.error(e);
      }
    })();
    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  function capture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/png");
    setShot(dataUrl);
  }

  async function upload() {
    // TODO: convert dataURL -> Blob and upload to Storage: /users/{uid}/live/selfie.png
    alert("Mock upload complete (wire to Storage next).");
  }

  return (
    <div className="rounded-lg border bg-white p-4">
      <p className="font-medium mb-2">Live Photo</p>
      <div className="grid gap-3">
        <video ref={videoRef} className="w-full rounded bg-black/5" muted playsInline />
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2">
          <Button onClick={capture} disabled={!hasStream} variant="outline">
            Capture
          </Button>
          <Button onClick={upload} disabled={!shot} className="bg-[#E05265] hover:bg-[#E05265]/90">
            Upload
          </Button>
        </div>
        {shot && (
          <img
            src={shot}
            alt="Captured selfie"
            className="mt-2 rounded border"
          />
        )}
      </div>
    </div>
  );
}
