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

  async headers() {
    return [
      {
        // Apply to all routes
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
  reactStrictMode: false

  /* config options here */
  // reactCompiler: true,
};

export default nextConfig;
