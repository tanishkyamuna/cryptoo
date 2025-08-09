import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Coin, CoinDetail, CoinFilters, SortOption, NewsArticle, ChartData, TechnicalIndicator } from '@/types'

interface CoinsState {
  // Coins data
  coins: Coin[]
  coinDetail: CoinDetail | null
  loading: boolean
  error: string | null
  
  // Search and filters
  searchTerm: string
  filters: CoinFilters
  sortOption: SortOption
  
  // Categories and trending
  categories: string[]
  trendingCoins: string[]
  newCoins: string[]
  
  // Selected coin data
  selectedCoinId: string | null
  coinNews: NewsArticle[]
  chartData: ChartData | null
  technicalIndicators: TechnicalIndicator | null
  
  // Actions
  setCoins: (coins: Coin[]) => void
  setCoinDetail: (coinDetail: CoinDetail | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setSearchTerm: (term: string) => void
  setFilters: (filters: Partial<CoinFilters>) => void
  setSortOption: (sort: SortOption) => void
  setSelectedCoin: (coinId: string | null) => void
  setCoinNews: (news: NewsArticle[]) => void
  setChartData: (data: ChartData | null) => void
  setTechnicalIndicators: (indicators: TechnicalIndicator | null) => void
  setTrendingCoins: (coinIds: string[]) => void
  setNewCoins: (coinIds: string[]) => void
  getFilteredCoins: () => Coin[]
  clearCoinData: () => void
}

export const useCoinsStore = create<CoinsState>()(
  persist(
    (set, get) => ({
      // Initial state
      coins: [],
      coinDetail: null,
      loading: false,
      error: null,
      searchTerm: '',
      filters: {},
      sortOption: { field: 'market_cap_rank', direction: 'asc' },
      categories: [],
      trendingCoins: [],
      newCoins: [],
      selectedCoinId: null,
      coinNews: [],
      chartData: null,
      technicalIndicators: null,

      // Actions
      setCoins: (coins: Coin[]) => {
        set({ coins, error: null })
      },

      setCoinDetail: (coinDetail: CoinDetail | null) => {
        set({ coinDetail })
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      setSearchTerm: (term: string) => {
        set({ searchTerm: term })
      },

      setFilters: (newFilters: Partial<CoinFilters>) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters }
        }))
      },

      setSortOption: (sort: SortOption) => {
        set({ sortOption: sort })
      },

      setSelectedCoin: (coinId: string | null) => {
        set({ 
          selectedCoinId: coinId,
          coinNews: [],
          chartData: null,
          technicalIndicators: null
        })
      },

      setCoinNews: (news: NewsArticle[]) => {
        set({ coinNews: news })
      },

      setChartData: (data: ChartData | null) => {
        set({ chartData: data })
      },

      setTechnicalIndicators: (indicators: TechnicalIndicator | null) => {
        set({ technicalIndicators: indicators })
      },

      setTrendingCoins: (coinIds: string[]) => {
        set({ trendingCoins: coinIds })
      },

      setNewCoins: (coinIds: string[]) => {
        set({ newCoins: coinIds })
      },

      getFilteredCoins: () => {
        const state = get()
        let filtered = [...state.coins]

        // Search filter
        if (state.searchTerm) {
          const search = state.searchTerm.toLowerCase()
          filtered = filtered.filter(coin =>
            coin.name.toLowerCase().includes(search) ||
            coin.symbol.toLowerCase().includes(search)
          )
        }

        // Price filters
        if (state.filters.price_min !== undefined) {
          filtered = filtered.filter(coin => coin.current_price >= state.filters.price_min!)
        }
        if (state.filters.price_max !== undefined) {
          filtered = filtered.filter(coin => coin.current_price <= state.filters.price_max!)
        }

        // Market cap filters
        if (state.filters.market_cap_min !== undefined) {
          filtered = filtered.filter(coin => coin.market_cap >= state.filters.market_cap_min!)
        }
        if (state.filters.market_cap_max !== undefined) {
          filtered = filtered.filter(coin => coin.market_cap <= state.filters.market_cap_max!)
        }

        // Volume filter
        if (state.filters.volume_min !== undefined) {
          filtered = filtered.filter(coin => coin.total_volume >= state.filters.volume_min!)
        }

        // 24h change filters
        if (state.filters.change_24h_min !== undefined) {
          filtered = filtered.filter(coin => coin.price_change_percentage_24h >= state.filters.change_24h_min!)
        }
        if (state.filters.change_24h_max !== undefined) {
          filtered = filtered.filter(coin => coin.price_change_percentage_24h <= state.filters.change_24h_max!)
        }

        // Trending filter
        if (state.filters.is_trending) {
          filtered = filtered.filter(coin => state.trendingCoins.includes(coin.id))
        }

        // New coins filter
        if (state.filters.is_new) {
          filtered = filtered.filter(coin => state.newCoins.includes(coin.id))
        }

        // Sorting
        filtered.sort((a, b) => {
          const { field, direction } = state.sortOption
          let aValue: number
          let bValue: number

          switch (field) {
            case 'market_cap_rank':
              aValue = a.market_cap_rank || 9999
              bValue = b.market_cap_rank || 9999
              break
            case 'current_price':
              aValue = a.current_price
              bValue = b.current_price
              break
            case 'price_change_percentage_24h':
              aValue = a.price_change_percentage_24h
              bValue = b.price_change_percentage_24h
              break
            case 'total_volume':
              aValue = a.total_volume
              bValue = b.total_volume
              break
            case 'market_cap':
              aValue = a.market_cap
              bValue = b.market_cap
              break
            default:
              aValue = 0
              bValue = 0
          }

          if (direction === 'asc') {
            return aValue - bValue
          } else {
            return bValue - aValue
          }
        })

        return filtered
      },

      clearCoinData: () => {
        set({
          coins: [],
          coinDetail: null,
          loading: false,
          error: null,
          searchTerm: '',
          filters: {},
          selectedCoinId: null,
          coinNews: [],
          chartData: null,
          technicalIndicators: null
        })
      }
    }),
    {
      name: 'cryptoquiver-coins-storage',
      partialize: (state) => ({
        searchTerm: state.searchTerm,
        filters: state.filters,
        sortOption: state.sortOption,
        trendingCoins: state.trendingCoins,
        newCoins: state.newCoins
      })
    }
  )
)
