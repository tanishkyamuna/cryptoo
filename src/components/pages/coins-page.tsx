'use client'

import { useState, useEffect } from 'react'
import { Search, TrendingUp, TrendingDown, Filter, Star, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'
import type { Coin } from '@/types'

interface CoinsPageProps {
  onCoinSelect: (coinId: string) => void
  onNavigate: (page: PageType) => void
}

export function CoinsPage({ onCoinSelect, onNavigate }: CoinsPageProps) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'trending' | 'gainers' | 'losers'>('all')
  
  const { hapticFeedback } = useTelegramWebApp()
  const { addToWatchlist, removeFromWatchlist, watchlist } = useUserStore()

  // Mock data for development
  useEffect(() => {
    setTimeout(() => {
      const mockCoins: Coin[] = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
          current_price: 67420.50,
          market_cap: 1328439872615,
          market_cap_rank: 1,
          total_volume: 28439627384,
          high_24h: 68250.80,
          low_24h: 66180.20,
          price_change_24h: 1240.30,
          price_change_percentage_24h: 1.87,
          market_cap_change_24h: 24439627384,
          market_cap_change_percentage_24h: 1.87,
          circulating_supply: 19697093,
          total_supply: 21000000,
          max_supply: 21000000,
          ath: 73738,
          ath_change_percentage: -8.57,
          ath_date: '2024-03-14T07:10:36.635Z',
          atl: 67.81,
          atl_change_percentage: 99900.5,
          atl_date: '2013-07-06T00:00:00.000Z',
          last_updated: '2024-07-31T12:00:00.000Z'
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
          current_price: 3340.75,
          market_cap: 401439872615,
          market_cap_rank: 2,
          total_volume: 18439627384,
          high_24h: 3450.80,
          low_24h: 3280.20,
          price_change_24h: 60.55,
          price_change_percentage_24h: 1.85,
          market_cap_change_24h: 7439627384,
          market_cap_change_percentage_24h: 1.89,
          circulating_supply: 120280392,
          total_supply: 120280392,
          ath: 4878.26,
          ath_change_percentage: -31.52,
          ath_date: '2021-11-10T14:24:19.604Z',
          atl: 0.432979,
          atl_change_percentage: 771900.2,
          atl_date: '2015-10-20T00:00:00.000Z',
          last_updated: '2024-07-31T12:00:00.000Z'
        },
        // Add more mock coins...
      ]
      setCoins(mockCoins)
      setLoading(false)
    }, 1500)
  }, [])

  const filteredCoins = coins.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    
    switch (filter) {
      case 'trending':
        return matchesSearch && coin.market_cap_rank <= 10
      case 'gainers':
        return matchesSearch && coin.price_change_percentage_24h > 0
      case 'losers':
        return matchesSearch && coin.price_change_percentage_24h < 0
      default:
        return matchesSearch
    }
  })

  const handleCoinClick = (coinId: string) => {
    hapticFeedback('impact', 'light')
    onCoinSelect(coinId)
  }

  const handleWatchlistToggle = (coin: Coin) => {
    hapticFeedback('impact', 'medium')
    const isInWatchlist = watchlist.some(item => item.coin_id === coin.id)
    
    if (isInWatchlist) {
      removeFromWatchlist(coin.id)
    } else {
      addToWatchlist(coin.id, coin.symbol, coin.name)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-300 mt-4">Loading coins data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Crypto Explorer 🚀
        </h1>
        <p className="text-gray-300">
          Discover and track cryptocurrency prices
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search coins..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-6 overflow-x-auto">
        {[
          { key: 'all', label: 'All' },
          { key: 'trending', label: 'Top 10' },
          { key: 'gainers', label: 'Gainers' },
          { key: 'losers', label: 'Losers' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              filter === tab.key
                ? 'bg-primary-600 text-white'
                : 'bg-white/10 text-gray-300 hover:bg-white/20'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Coins List */}
      <div className="space-y-3">
        {filteredCoins.map((coin) => {
          const isInWatchlist = watchlist.some(item => item.coin_id === coin.id)
          const isPositive = coin.price_change_percentage_24h > 0
          
          return (
            <div
              key={coin.id}
              className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 transition-all hover:bg-white/20"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="flex items-center space-x-3 flex-1 cursor-pointer"
                  onClick={() => handleCoinClick(coin.id)}
                >
                  <div className="relative">
                    <img
                      src={coin.image}
                      alt={coin.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">
                        {coin.market_cap_rank}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{coin.name}</h3>
                      <span className="text-gray-400 text-sm uppercase">
                        {coin.symbol}
                      </span>
                    </div>
                    <div className="text-gray-300 text-sm">
                      {formatMarketCap(coin.market_cap)}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-white font-semibold">
                    {formatPrice(coin.current_price)}
                  </div>
                  <div className={`flex items-center text-sm ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span className="ml-1">
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleWatchlistToggle(coin)}
                  className={`ml-3 p-2 rounded-lg transition-all ${
                    isInWatchlist
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-white/10 text-gray-400 hover:bg-white/20'
                  }`}
                >
                  <Star size={16} fill={isInWatchlist ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-12">
          <Search size={48} className="text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No coins found matching your search</p>
        </div>
      )}
    </div>
  )
}
