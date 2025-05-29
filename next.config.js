/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    allowedDevOrigins: [
      "http://142.93.135.99:3000", // Your network IP
      // Add any other origins you use for development
    ],
  },
};

module.exports = nextConfig;
