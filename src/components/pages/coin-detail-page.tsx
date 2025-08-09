'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Star, TrendingUp, TrendingDown, ExternalLink, Share } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { CoinDetail } from '@/types'

interface CoinDetailPageProps {
  coinId: string
  onBack: () => void
}

export function CoinDetailPage({ coinId, onBack }: CoinDetailPageProps) {
  const [coinDetail, setCoinDetail] = useState<CoinDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'news' | 'analysis'>('overview')
  
  const { hapticFeedback } = useTelegramWebApp()
  const { addToWatchlist, removeFromWatchlist, watchlist, isSubscribed } = useUserStore()

  useEffect(() => {
    // Mock data for development
    setTimeout(() => {
      const mockCoinDetail: CoinDetail = {
        id: coinId,
        symbol: 'btc',
        name: 'Bitcoin',
        description: {
          en: 'Bitcoin is the first successful internet money based on peer-to-peer technology; whereby no central bank or authority is involved in the transaction and production of the Bitcoin currency.'
        },
        image: {
          thumb: 'https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png',
          small: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
          large: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
        },
        market_cap_rank: 1,
        coingecko_rank: 1,
        market_data: {
          current_price: { usd: 67420.50 },
          market_cap: { usd: 1328439872615 },
          total_volume: { usd: 28439627384 },
          high_24h: { usd: 68250.80 },
          low_24h: { usd: 66180.20 },
          price_change_24h: 1240.30,
          price_change_percentage_24h: 1.87,
          price_change_percentage_7d: -2.45,
          price_change_percentage_30d: 8.92,
          price_change_percentage_1y: 145.67,
          market_cap_change_24h: 24439627384,
          market_cap_change_percentage_24h: 1.87,
          circulating_supply: 19697093,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: { usd: 73738 },
          ath_change_percentage: { usd: -8.57 },
          ath_date: { usd: '2024-03-14T07:10:36.635Z' },
          atl: { usd: 67.81 },
          atl_change_percentage: { usd: 99900.5 },
          atl_date: { usd: '2013-07-06T00:00:00.000Z' }
        },
        links: {
          homepage: ['https://bitcoin.org'],
          blockchain_site: ['https://blockchair.com/bitcoin'],
          official_forum_url: ['https://bitcointalk.org'],
          chat_url: [],
          announcement_url: [],
          twitter_screen_name: 'bitcoin',
          facebook_username: '',
          telegram_channel_identifier: '',
          subreddit_url: 'https://www.reddit.com/r/Bitcoin/',
          repos_url: {
            github: ['https://github.com/bitcoin/bitcoin'],
            bitbucket: []
          }
        }
      }
      setCoinDetail(mockCoinDetail)
      setLoading(false)
    }, 1000)
  }, [coinId])

  const isInWatchlist = watchlist.some(item => item.coin_id === coinId)

  const handleWatchlistToggle = () => {
    if (!coinDetail) return
    
    hapticFeedback('impact', 'medium')
    
    if (isInWatchlist) {
      removeFromWatchlist(coinId)
    } else {
      addToWatchlist(coinId, coinDetail.symbol, coinDetail.name)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 6 : 2
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(0)}`
  }

  const formatSupply = (supply: number) => {
    if (supply >= 1e9) return `${(supply / 1e9).toFixed(2)}B`
    if (supply >= 1e6) return `${(supply / 1e6).toFixed(2)}M`
    if (supply >= 1e3) return `${(supply / 1e3).toFixed(2)}K`
    return supply.toFixed(0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-300 mt-4">Loading coin details...</p>
        </div>
      </div>
    )
  }

  if (!coinDetail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400">Failed to load coin details</p>
          <Button onClick={onBack} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const priceChangeColor = coinDetail.market_data.price_change_percentage_24h > 0 
    ? 'text-green-400' 
    : 'text-red-400'

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleWatchlistToggle}
            className={`p-2 rounded-lg transition-all ${
              isInWatchlist
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }`}
          >
            <Star size={20} fill={isInWatchlist ? 'currentColor' : 'none'} />
          </button>
          
          <button className="p-2 rounded-lg bg-white/10 backdrop-blur-lg border border-white/20 text-white hover:bg-white/20">
            <Share size={20} />
          </button>
        </div>
      </div>

      {/* Coin Header */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={coinDetail.image.large}
            alt={coinDetail.name}
            className="w-16 h-16 rounded-full"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">{coinDetail.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300 uppercase font-medium">
                {coinDetail.symbol}
              </span>
              <span className="px-2 py-1 bg-primary-600/20 text-primary-300 text-xs rounded-full">
                Rank #{coinDetail.market_cap_rank}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <div className="text-3xl font-bold text-white mb-1">
              {formatPrice(coinDetail.market_data.current_price.usd)}
            </div>
            <div className={`flex items-center text-lg ${priceChangeColor}`}>
              {coinDetail.market_data.price_change_percentage_24h > 0 ? (
                <TrendingUp size={20} />
              ) : (
                <TrendingDown size={20} />
              )}
              <span className="ml-1">
                {Math.abs(coinDetail.market_data.price_change_percentage_24h).toFixed(2)}%
              </span>
              <span className="ml-2 text-gray-400">
                ({coinDetail.market_data.price_change_24h > 0 ? '+' : ''}
                {formatPrice(coinDetail.market_data.price_change_24h)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'news', label: 'News', premium: true },
          { key: 'analysis', label: 'Analysis', premium: true }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            disabled={tab.premium && !isSubscribed}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            } ${tab.premium && !isSubscribed ? 'opacity-50' : ''}`}
          >
            {tab.label}
            {tab.premium && !isSubscribed && (
              <span className="ml-1 text-xs">🔒</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Market Stats */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Market Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-gray-400 text-sm">Market Cap</div>
                <div className="text-white font-semibold">
                  {formatMarketCap(coinDetail.market_data.market_cap.usd)}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">24h Volume</div>
                <div className="text-white font-semibold">
                  {formatMarketCap(coinDetail.market_data.total_volume.usd)}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Circulating Supply</div>
                <div className="text-white font-semibold">
                  {formatSupply(coinDetail.market_data.circulating_supply)}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-sm">Max Supply</div>
                <div className="text-white font-semibold">
                  {coinDetail.market_data.max_supply 
                    ? formatSupply(coinDetail.market_data.max_supply)
                    : '∞'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Price Performance */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">Price Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h High</span>
                <span className="text-white font-semibold">
                  {formatPrice(coinDetail.market_data.high_24h.usd)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">24h Low</span>
                <span className="text-white font-semibold">
                  {formatPrice(coinDetail.market_data.low_24h.usd)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">All Time High</span>
                <span className="text-white font-semibold">
                  {formatPrice(coinDetail.market_data.ath.usd)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">7d Change</span>
                <span className={coinDetail.market_data.price_change_percentage_7d > 0 ? 'text-green-400' : 'text-red-400'}>
                  {coinDetail.market_data.price_change_percentage_7d.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4">About {coinDetail.name}</h3>
            <p className="text-gray-300 leading-relaxed">
              {coinDetail.description.en.substring(0, 300)}...
            </p>
            
            {/* Links */}
            <div className="mt-4 flex flex-wrap gap-2">
              {coinDetail.links.homepage[0] && (
                <a
                  href={coinDetail.links.homepage[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-600/20 text-primary-300 rounded-lg text-sm hover:bg-primary-600/30"
                >
                  <ExternalLink size={14} />
                  <span>Website</span>
                </a>
              )}
              {coinDetail.links.repos_url.github[0] && (
                <a
                  href={coinDetail.links.repos_url.github[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 px-3 py-1 bg-gray-600/20 text-gray-300 rounded-lg text-sm hover:bg-gray-600/30"
                >
                  <ExternalLink size={14} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'news' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {isSubscribed ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-white mb-2">Latest News</h3>
              <p className="text-gray-400">News integration coming soon...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
              <p className="text-gray-400 mb-4">Upgrade to access real-time news and analysis</p>
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600">
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'analysis' && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          {isSubscribed ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-white mb-2">Technical Analysis</h3>
              <p className="text-gray-400">Advanced charts and indicators coming soon...</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-white mb-2">Premium Feature</h3>
              <p className="text-gray-400 mb-4">Upgrade to access technical analysis and charts</p>
              <Button className="bg-gradient-to-r from-primary-500 to-primary-600">
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
