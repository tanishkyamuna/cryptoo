import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'CryptoQuiver API is running',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasBot: !!process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME,
      hasCoinGecko: !!process.env.COINGECKO_API_KEY,
      hasCryptoPanic: !!process.env.CRYPTOPANIC_API_KEY,
      hasNowPayments: !!process.env.NOWPAYMENTS_API_KEY,
    }
  })
}
