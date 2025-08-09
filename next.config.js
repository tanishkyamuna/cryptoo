/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.coingecko.com', 'coin-images.coingecko.com'],
  },
  // Optimize for Telegram Web Apps
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'ALLOWALL',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' https://web.telegram.org https://telegram.org https://*.telegram.org",
          },
        ],
      },
    ]
  },
  // Environment variables are now handled in src/lib/config.ts
  // This allows the app to work with missing APIs in development
  trailingSlash: false,
  poweredByHeader: false,
}

module.exports = nextConfig
