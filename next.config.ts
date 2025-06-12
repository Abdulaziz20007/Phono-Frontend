import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ["chelak.s3.eu-central-1.amazonaws.com", "localhost"],
  },
};

export default nextConfig;
