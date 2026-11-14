import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // The dashboard route folder was renamed from the typo "deshboard".
  async redirects() {
    return [
      {
        source: "/deshboard",
        destination: "/dashboard",
        permanent: true,
      },
      {
        source: "/deshboard/:path*",
        destination: "/dashboard/:path*",
        permanent: true,
      },
    ];
  },
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
