/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com', 'coin-images.coingecko.com'],
  },
  // Environment variables are now handled in src/lib/config.ts
  // This allows the app to work with missing APIs in development
}

module.exports = nextConfig
