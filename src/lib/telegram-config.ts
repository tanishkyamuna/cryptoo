// Telegram Web App specific configuration
export const TELEGRAM_CONFIG = {
  // Ensure the app works properly within Telegram's iframe
  initData: {
    required: false, // Allow development without Telegram
    validate: process.env.NODE_ENV === 'production'
  },
  
  // Security headers for iframe embedding
  frameOptions: 'ALLOWALL',
  
  // CSP for Telegram domains
  contentSecurityPolicy: "frame-ancestors 'self' https://web.telegram.org https://telegram.org https://*.telegram.org",
  
  // Telegram Web App API
  script: 'https://telegram.org/js/telegram-web-app.js',
  
  // Development settings
  development: {
    mockUser: true,
    enableTestButtons: true
  }
}

// Vercel deployment settings
export const VERCEL_CONFIG = {
  regions: ['iad1'], // US East for better global performance
  framework: 'nextjs',
  buildCommand: 'npm run build',
  outputDirectory: '.next'
}
