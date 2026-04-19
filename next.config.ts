import type { NextConfig } from "next";
import { DEMO_NEXTAUTH_SECRET } from "./lib/auth/constants";

const nextConfig: NextConfig = {
  env: {
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET?.trim() || DEMO_NEXTAUTH_SECRET,
    NEXTAUTH_URL:
      process.env.NEXTAUTH_URL?.trim() || "http://localhost:3000",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
