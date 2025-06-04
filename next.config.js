/** @type {import('next').NextConfig} */

const nextConfig = {
  // ...other config...
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  images: {
    domains: [
      "chelak.s3.eu-central-1.amazonaws.com",
      // add any other domains you need
    ],
  },
  // Configure page extensions to prevent conflicts between app/ and pages/
  pageExtensions: ["page.tsx", "page.ts", "page.jsx", "page.js"],
  // Explicitly handle app directory usage
  experimental: {
    appDir: true,
  },
};

module.exports = nextConfig;
