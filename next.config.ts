import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'media1.tenor.com',
      },
    ],
  },
};

export default nextConfig;
