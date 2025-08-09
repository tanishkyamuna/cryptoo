import { NextResponse } from 'next/server'
import { config } from '@/lib/config'

const MOCK_NEWS = [
  {
    id: 1,
    title: 'Bitcoin Price Surges as Institutional Adoption Grows',
    summary: 'Major financial institutions continue to embrace Bitcoin, driving price momentum.',
    url: 'https://example.com/news/1',
    source: 'CoinDesk',
    published_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    currencies: ['BTC'],
    kind: 'news'
  },
  {
    id: 2,
    title: 'Ethereum Network Upgrade Shows Promising Results',
    summary: 'Latest Ethereum improvement proposal demonstrates significant performance gains.',
    url: 'https://example.com/news/2',
    source: 'Decrypt',
    published_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    currencies: ['ETH'],
    kind: 'news'
  },
  {
    id: 3,
    title: 'Solana DeFi Ecosystem Reaches New Milestone',
    summary: 'Total value locked in Solana DeFi protocols hits record high.',
    url: 'https://example.com/news/3',
    source: 'The Block',
    published_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    currencies: ['SOL'],
    kind: 'news'
  },
  {
    id: 4,
    title: 'Crypto Market Analysis: Bulls vs Bears',
    summary: 'Technical analysis suggests continued volatility in the coming weeks.',
    url: 'https://example.com/news/4',
    source: 'CoinTelegraph',
    published_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
    currencies: ['BTC', 'ETH'],
    kind: 'news'
  },
  {
    id: 5,
    title: 'New DeFi Protocol Launches with Innovative Features',
    summary: 'Revolutionary lending protocol introduces novel mechanisms for yield generation.',
    url: 'https://example.com/news/5',
    source: 'DeFi Pulse',
    published_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    currencies: ['ETH', 'USDC'],
    kind: 'news'
  }
]

async function fetchRealNews(currencies?: string[], page = 1) {
  if (!config.cryptoPanicApiKey) {
    return {
      results: MOCK_NEWS.filter(news => 
        !currencies || currencies.length === 0 || 
        news.currencies.some(currency => currencies.includes(currency.toUpperCase()))
      ),
      next: null
    }
  }

  try {
    const currencyParam = currencies && currencies.length > 0 
      ? `&currencies=${currencies.join(',').toUpperCase()}`
      : ''
    
    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${config.cryptoPanicApiKey}&kind=news&page=${page}${currencyParam}`,
      {
        headers: {
          'User-Agent': 'CryptoQuiver/1.0',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`CryptoPanic API error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching from CryptoPanic:', error)
    return {
      results: MOCK_NEWS,
      next: null
    }
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currencies = searchParams.get('currencies')?.split(',').filter(Boolean)
    const page = parseInt(searchParams.get('page') || '1')

    const newsData = await fetchRealNews(currencies, page)

    return NextResponse.json({
      success: true,
      data: newsData.results || [],
      pagination: {
        page,
        hasNext: !!newsData.next
      },
      meta: {
        usingMockData: !config.cryptoPanicApiKey
      }
    })
  } catch (error) {
    console.error('Error in news API:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news data',
        data: MOCK_NEWS
      },
      { status: 500 }
    )
  }
}
