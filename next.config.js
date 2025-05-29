/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    // Disable React Server Components
    serverActions: false,
    serverComponentsExternalPackages: [],
  },
};

module.exports = nextConfig;
