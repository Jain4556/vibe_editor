import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   images: {
    domains: ["avatars.githubusercontent.com"], // ✅ ADD THIS
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
