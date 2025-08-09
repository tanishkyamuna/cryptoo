// Environment variables configuration
// This file helps ensure the app works even with missing API keys during development

export const config = {
  // Required for Telegram integration
  telegramBotName: process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || '',
  
  // API Keys (optional in development, app will use mock data)
  coinGeckoApiKey: process.env.COINGECKO_API_KEY || '',
  cryptoPanicApiKey: process.env.CRYPTOPANIC_API_KEY || '',
  nowPaymentsApiKey: process.env.NOWPAYMENTS_API_KEY || '',
  nowPaymentsCallbackUrl: process.env.NOWPAYMENTS_CALLBACK_URL || 'http://localhost:3000/api/payment/callback',
  
  // App configuration
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  
  // Development flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
}

// Validation for production deployment
export function validateProductionConfig() {
  const missing = []
  
  if (!config.telegramBotName) missing.push('NEXT_PUBLIC_TELEGRAM_BOT_NAME')
  if (!config.coinGeckoApiKey) missing.push('COINGECKO_API_KEY')
  
  if (missing.length > 0 && config.isProduction) {
    console.warn('⚠️  Missing required environment variables for production:', missing.join(', '))
    console.warn('ℹ️  The app will use mock data. See API_KEYS_GUIDE.md for setup instructions.')
  }
  
  return missing.length === 0
}

// Check if API features are available
export const features = {
  realTimeData: !!config.coinGeckoApiKey,
  newsFeeds: !!config.cryptoPanicApiKey,
  payments: !!config.nowPaymentsApiKey,
  telegram: !!config.telegramBotName,
}

// Run validation on import
if (typeof window === 'undefined') {
  validateProductionConfig()
}
