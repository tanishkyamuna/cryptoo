import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

// Mock data for development when API key is not available
const MOCK_COINS = [
  {
    id: 'bitcoin',
    symbol: 'btc',
    name: 'Bitcoin',
    image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    current_price: 43250.00,
    market_cap: 845123456789,
    market_cap_rank: 1,
    fully_diluted_valuation: 908456789123,
    total_volume: 25123456789,
    high_24h: 44150.00,
    low_24h: 42890.00,
    price_change_24h: 1025.50,
    price_change_percentage_24h: 2.43,
    market_cap_change_24h: 18456789123,
    market_cap_change_percentage_24h: 2.23,
    circulating_supply: 19656250,
    total_supply: 21000000,
    max_supply: 21000000,
    ath: 69045.00,
    ath_change_percentage: -37.42,
    ath_date: '2021-11-10T14:24:11.849Z',
    atl: 67.81,
    atl_change_percentage: 63671.89,
    atl_date: '2013-07-06T00:00:00.000Z',
    last_updated: new Date().toISOString()
  },
  {
    id: 'ethereum',
    symbol: 'eth',
    name: 'Ethereum',
    image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    current_price: 2650.00,
    market_cap: 318456789123,
    market_cap_rank: 2,
    fully_diluted_valuation: 318456789123,
    total_volume: 15789456123,
    high_24h: 2715.00,
    low_24h: 2620.00,
    price_change_24h: 45.50,
    price_change_percentage_24h: 1.75,
    market_cap_change_24h: 5456789123,
    market_cap_change_percentage_24h: 1.74,
    circulating_supply: 120280000,
    total_supply: 120280000,
    max_supply: null,
    ath: 4878.26,
    ath_change_percentage: -45.65,
    ath_date: '2021-11-10T14:24:19.604Z',
    atl: 0.432979,
    atl_change_percentage: 612023.89,
    atl_date: '2015-10-20T00:00:00.000Z',
    last_updated: new Date().toISOString()
  },
  {
    id: 'solana',
    symbol: 'sol',
    name: 'Solana',
    image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png',
    current_price: 98.50,
    market_cap: 43456789123,
    market_cap_rank: 5,
    fully_diluted_valuation: 55789456123,
    total_volume: 2456789123,
    high_24h: 102.30,
    low_24h: 96.80,
    price_change_24h: -2.15,
    price_change_percentage_24h: -2.14,
    market_cap_change_24h: -956789123,
    market_cap_change_percentage_24h: -2.15,
    circulating_supply: 441234567,
    total_supply: 566234567,
    max_supply: null,
    ath: 259.96,
    ath_change_percentage: -62.11,
    ath_date: '2021-11-06T21:54:35.825Z',
    atl: 0.500801,
    atl_change_percentage: 19565.89,
    atl_date: '2020-05-11T19:35:23.449Z',
    last_updated: new Date().toISOString()
  }
]

async function fetchRealCoins(page = 1, perPage = 50) {
  if (!config.coinGeckoApiKey || config.coinGeckoApiKey === 'demo_key_for_development') {
    return MOCK_COINS
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=24h`,
      {
        headers: {
          'X-CG-Demo-API-Key': config.coinGeckoApiKey,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error)
    return MOCK_COINS
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '50')

    const coins = await fetchRealCoins(page, perPage)

    return NextResponse.json({
      success: true,
      data: coins,
      meta: {
        page,
        perPage,
        usingMockData: !config.coinGeckoApiKey || config.coinGeckoApiKey === 'demo_key_for_development'
      }
    })
  } catch (error) {
    console.error('Error in coins API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch coins data',
        data: MOCK_COINS
      },
      { status: 500 }
    )
  }
}
