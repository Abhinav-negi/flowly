// components/StopwatchTimer.tsx
import React from "react";

interface StopwatchTimerProps {
  size?: number;
  duration?: number; // seconds for full rotation
}

const StopwatchTimer: React.FC<StopwatchTimerProps> = ({
  size = 150,
  duration = 5, // slower rotation
}) => {
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size + 15, // extra space for crown connected to circle
      }}
    >
      {/* Stopwatch crown - connected T knob */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: center - 10,
          width: 20,
          height: 12, // shorter knob
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Horizontal bar of T */}
        <div
          style={{
            width: 20,
            height: 4,
            backgroundColor: "#E05265",
            borderRadius: 2,
          }}
        ></div>
        {/* Short vertical stem connected to circle */}
        <div
          style={{
            width: 6,
            height: 8,
            backgroundColor: "#E05265",
            marginTop: -1,
            borderRadius: 3,
          }}
        ></div>
      </div>

      {/* Circle background */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#FAF7F5",
          border: "4px solid #E05265",
          marginTop: 12, // crown connects seamlessly
        }}
      ></div>

      {/* Rotating stick */}
      <div
        style={{
          position: "absolute",
          width: "4px",
          height: radius,
          backgroundColor: "#E05265",
          top: 12 + center - radius,
          left: center - 2,
          transformOrigin: `50% ${radius}px`,
          animation: `rotateStick ${duration}s linear infinite`,
        }}
      ></div>

      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          width: "8px",
          height: "8px",
          backgroundColor: "#E05265",
          borderRadius: "50%",
          top: 12 + center - 4,
          left: center - 4,
        }}
      ></div>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes rotateStick {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default StopwatchTimer;
