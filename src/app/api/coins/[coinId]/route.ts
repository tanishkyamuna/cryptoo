import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

const MOCK_COIN_DETAIL = {
  id: 'bitcoin',
  symbol: 'btc',
  name: 'Bitcoin',
  image: {
    thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
    small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
  },
  market_data: {
    current_price: {
      usd: 43250.00
    },
    total_value_locked: null,
    mcap_to_tvl_ratio: null,
    fdv_to_tvl_ratio: null,
    roi: null,
    ath: {
      usd: 69045.00
    },
    ath_change_percentage: {
      usd: -37.42
    },
    ath_date: {
      usd: '2021-11-10T14:24:11.849Z'
    },
    atl: {
      usd: 67.81
    },
    atl_change_percentage: {
      usd: 63671.89
    },
    atl_date: {
      usd: '2013-07-06T00:00:00.000Z'
    },
    market_cap: {
      usd: 845123456789
    },
    market_cap_rank: 1,
    fully_diluted_valuation: {
      usd: 908456789123
    },
    total_volume: {
      usd: 25123456789
    },
    high_24h: {
      usd: 44150.00
    },
    low_24h: {
      usd: 42890.00
    },
    price_change_24h: 1025.50,
    price_change_percentage_24h: 2.43,
    price_change_percentage_7d: 5.67,
    price_change_percentage_14d: -2.34,
    price_change_percentage_30d: 12.45,
    price_change_percentage_60d: -8.76,
    price_change_percentage_200d: 45.67,
    price_change_percentage_1y: 134.56,
    market_cap_change_24h: 18456789123,
    market_cap_change_percentage_24h: 2.23,
    price_change_24h_in_currency: {
      usd: 1025.50
    },
    price_change_percentage_1h_in_currency: {
      usd: 0.45
    },
    price_change_percentage_24h_in_currency: {
      usd: 2.43
    },
    price_change_percentage_7d_in_currency: {
      usd: 5.67
    },
    price_change_percentage_14d_in_currency: {
      usd: -2.34
    },
    price_change_percentage_30d_in_currency: {
      usd: 12.45
    },
    price_change_percentage_60d_in_currency: {
      usd: -8.76
    },
    price_change_percentage_200d_in_currency: {
      usd: 45.67
    },
    price_change_percentage_1y_in_currency: {
      usd: 134.56
    },
    total_supply: 21000000,
    max_supply: 21000000,
    circulating_supply: 19656250,
    last_updated: new Date().toISOString()
  },
  description: {
    en: 'Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency. It was created by an anonymous individual/group under the name, Satoshi Nakamoto. The source code is available publicly as an open source project, anybody can look at it and be part of the developmental process.'
  },
  links: {
    homepage: ['https://bitcoin.org/', '', ''],
    blockchain_site: [
      'https://blockchair.com/bitcoin/',
      'https://btc.com/',
      'https://btc.tokenview.com/',
      '',
      '',
      '',
      '',
      '',
      '',
      ''
    ],
    official_forum_url: ['https://bitcointalk.org/', '', ''],
    chat_url: ['', '', ''],
    announcement_url: ['', ''],
    twitter_screen_name: 'bitcoin',
    facebook_username: 'bitcoins',
    bitcointalk_thread_identifier: null,
    telegram_channel_identifier: '',
    subreddit_url: 'https://www.reddit.com/r/Bitcoin/',
    repos_url: {
      github: ['https://github.com/bitcoin/bitcoin', 'https://github.com/bitcoin/bips'],
      bitbucket: []
    }
  }
}

async function fetchRealCoinDetail(coinId: string) {
  if (!config.coinGeckoApiKey || config.coinGeckoApiKey === 'demo_key_for_development') {
    return {
      ...MOCK_COIN_DETAIL,
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1)
    }
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`,
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
    console.error('Error fetching coin detail from CoinGecko:', error)
    return {
      ...MOCK_COIN_DETAIL,
      id: coinId,
      name: coinId.charAt(0).toUpperCase() + coinId.slice(1)
    }
  }
}

export async function GET(
  request: Request,
  { params }: { params: { coinId: string } }
) {
  try {
    const coinId = params.coinId

    if (!coinId) {
      return NextResponse.json(
        { success: false, error: 'Coin ID is required' },
        { status: 400 }
      )
    }

    const coinDetail = await fetchRealCoinDetail(coinId)

    return NextResponse.json({
      success: true,
      data: coinDetail,
      meta: {
        usingMockData: !config.coinGeckoApiKey || config.coinGeckoApiKey === 'demo_key_for_development'
      }
    })
  } catch (error) {
    console.error('Error in coin detail API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch coin detail',
        data: MOCK_COIN_DETAIL
      },
      { status: 500 }
    )
  }
}
