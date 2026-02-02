import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'leitesculinaria.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all for development flexibility if desired, or explicitly list
      },
    ],
  },
};

export default nextConfig;
