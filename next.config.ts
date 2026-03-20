import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "avatars.githubusercontent.com",
    },
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
  ],
},
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
