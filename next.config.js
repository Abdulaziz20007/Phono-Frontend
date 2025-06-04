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
  // Configure which paths should be handled by which router
  // The excludePaths option is used to specify routes that don't exist in the Pages Router
  experimental: {
    ppr: true,
    missingSuspenseWithCSRBailout: false,
  },
  // Tell Next.js which pages to exclude from the Pages Router
  skipTrailingSlashRedirect: true,
  skipMiddlewareUrlNormalize: true,
  // These paths should be excluded from Pages Router processing
  // as they exist only in the App Router
  pageExtensions: ["tsx", "ts", "jsx", "js"],
};

module.exports = nextConfig;
