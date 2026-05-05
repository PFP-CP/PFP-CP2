import type { NextConfig } from "next";

const nextConfig: NextConfig = {
   allowedDevOrigins: [
    "fragrant-defender-gusto.ngrok-free.dev",
  ],
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.template.net',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'wcnphqrchchdghpjolpa.supabase.co',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/**',
      },
    ],
    // Allow unoptimized images as a fallback for external/dynamic URLs
    unoptimized: process.env.NODE_ENV === 'development',
  },
};
export default nextConfig;
