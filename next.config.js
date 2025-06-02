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
};

module.exports = nextConfig;
