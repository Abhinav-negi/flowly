import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"], // Allow Firebase Storage images
  },
};

export default nextConfig;
