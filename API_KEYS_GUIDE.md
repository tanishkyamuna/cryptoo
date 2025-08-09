# API Keys Setup Guide

This guide will help you obtain all the necessary API keys for CryptoQuiver.

## 1. Telegram Bot Setup

### Where to get it:
- Go to [BotFather](https://t.me/botfather) on Telegram
- Send `/newbot` command
- Follow the instructions to create your bot
- You'll receive a bot token and username

### Setup:
```env
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_username_without_@
```

**Example:** If your bot is `@cryptoquiver_bot`, use: `NEXT_PUBLIC_TELEGRAM_BOT_NAME=cryptoquiver_bot`

---

## 2. CoinGecko API

### Where to get it:
- Visit [CoinGecko API](https://www.coingecko.com/en/api)
- Click "Get Your API Key"
- Sign up for a free account
- Free tier includes: 30 calls/minute, 10,000 calls/month

### Setup:
```env
COINGECKO_API_KEY=CG-your-api-key-here
```

**Note:** Free tier is sufficient for development and testing.

---

## 3. CryptoPanic API

### Where to get it:
- Visit [CryptoPanic API](https://cryptopanic.com/developers/api/)
- Sign up for a free account
- Go to your dashboard to get the API key
- Free tier includes: 2000 requests/day

### Setup:
```env
CRYPTOPANIC_API_KEY=your-cryptopanic-key-here
```

---

## 4. NowPayments API (Optional - for crypto payments)

### Where to get it:
- Visit [NowPayments](https://nowpayments.io/)
- Sign up for an account
- Complete KYC verification (for production)
- Get API key from dashboard
- For testing, you can use sandbox environment

### Setup:
```env
NOWPAYMENTS_API_KEY=your-nowpayments-key
NOWPAYMENTS_CALLBACK_URL=https://your-domain.com/api/payment/callback
```

**For development:**
```env
NOWPAYMENTS_CALLBACK_URL=http://localhost:3000/api/payment/callback
```

---

## Quick Start (Minimum Required)

For development, you only need:

1. **Telegram Bot** (Required)
2. **CoinGecko API** (Required for crypto data)

CryptoPanic and NowPayments can be added later when you need news and payment features.

## Example .env.local file:

```env
# Required
NEXT_PUBLIC_TELEGRAM_BOT_NAME=your_bot_username
COINGECKO_API_KEY=CG-your-coingecko-key

# Optional (can be added later)
CRYPTOPANIC_API_KEY=your-cryptopanic-key
NOWPAYMENTS_API_KEY=your-nowpayments-key
NOWPAYMENTS_CALLBACK_URL=http://localhost:3000/api/payment/callback

# App configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Testing Without All APIs

The app is designed to work with mock data if APIs are not available. You can start development with just the Telegram bot setup and add other APIs later.

## Security Notes

1. Never commit `.env.local` to version control
2. Use different API keys for development and production
3. Set up proper rate limiting in production
4. For NowPayments, always use sandbox for testing
