import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    // Allow remote profile images (e.g. Google account avatars).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
}

export default nextConfig
