import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TelegramUser, User, Subscription, WatchlistItem } from '@/types'

interface UserState {
  // User data
  user: User | null
  telegramUser: TelegramUser | null
  
  // Subscription data
  subscription: Subscription | null
  isSubscribed: boolean
  
  // Watchlist
  watchlist: WatchlistItem[]
  
  // Premium features access
  premiumAccess: {
    signals: boolean
    advancedCharts: boolean
    export: boolean
    alerts: boolean
  }
  
  // Actions
  initializeUser: (tgUser: TelegramUser) => void
  updateUser: (userData: Partial<User>) => void
  setSubscription: (subscription: Subscription | null) => void
  addToWatchlist: (coinId: string, coinSymbol: string, coinName: string) => void
  removeFromWatchlist: (coinId: string) => void
  updateWatchlistAlert: (coinId: string, targetPrice?: number, alertEnabled?: boolean) => void
  clearUserData: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      telegramUser: null,
      subscription: null,
      isSubscribed: false,
      watchlist: [],
      premiumAccess: {
        signals: false,
        advancedCharts: false,
        export: false,
        alerts: false
      },

      // Actions
      initializeUser: (tgUser: TelegramUser) => {
        set((state) => {
          const user: User = {
            id: Date.now(), // This would come from your backend
            telegram_id: tgUser.id,
            first_name: tgUser.first_name,
            last_name: tgUser.last_name,
            username: tgUser.username,
            language_code: tgUser.language_code,
            is_premium: tgUser.is_premium,
            subscription_status: 'none',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }

          return {
            ...state,
            telegramUser: tgUser,
            user
          }
        })
      },

      updateUser: (userData: Partial<User>) => {
        set((state) => ({
          ...state,
          user: state.user ? { ...state.user, ...userData } : null
        }))
      },

      setSubscription: (subscription: Subscription | null) => {
        set((state) => {
          const isSubscribed = subscription?.status === 'active' && 
                              new Date(subscription.expires_at) > new Date()
          
          const premiumAccess = isSubscribed ? {
            signals: true,
            advancedCharts: true,
            export: true,
            alerts: true
          } : {
            signals: false,
            advancedCharts: false,
            export: false,
            alerts: false
          }

          return {
            ...state,
            subscription,
            isSubscribed,
            premiumAccess,
            user: state.user ? {
              ...state.user,
              subscription_status: isSubscribed ? 'active' : 'none',
              subscription_type: subscription?.type,
              subscription_expires_at: subscription?.expires_at
            } : null
          }
        })
      },

      addToWatchlist: (coinId: string, coinSymbol: string, coinName: string) => {
        set((state) => {
          const existingItem = state.watchlist.find(item => item.coin_id === coinId)
          if (existingItem) return state

          const newItem: WatchlistItem = {
            id: `watchlist_${Date.now()}`,
            user_id: state.user?.id || 0,
            coin_id: coinId,
            coin_symbol: coinSymbol,
            coin_name: coinName,
            alert_enabled: false,
            created_at: new Date().toISOString()
          }

          return {
            ...state,
            watchlist: [...state.watchlist, newItem]
          }
        })
      },

      removeFromWatchlist: (coinId: string) => {
        set((state) => ({
          ...state,
          watchlist: state.watchlist.filter(item => item.coin_id !== coinId)
        }))
      },

      updateWatchlistAlert: (coinId: string, targetPrice?: number, alertEnabled?: boolean) => {
        set((state) => ({
          ...state,
          watchlist: state.watchlist.map(item => 
            item.coin_id === coinId 
              ? { 
                  ...item, 
                  target_price: targetPrice !== undefined ? targetPrice : item.target_price,
                  alert_enabled: alertEnabled !== undefined ? alertEnabled : item.alert_enabled
                }
              : item
          )
        }))
      },

      clearUserData: () => {
        set({
          user: null,
          telegramUser: null,
          subscription: null,
          isSubscribed: false,
          watchlist: [],
          premiumAccess: {
            signals: false,
            advancedCharts: false,
            export: false,
            alerts: false
          }
        })
      }
    }),
    {
      name: 'cryptoquiver-user-storage',
      partialize: (state) => ({
        user: state.user,
        telegramUser: state.telegramUser,
        subscription: state.subscription,
        isSubscribed: state.isSubscribed,
        watchlist: state.watchlist,
        premiumAccess: state.premiumAccess
      })
    }
  )
)
