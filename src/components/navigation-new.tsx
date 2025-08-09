'use client'

import { Home, TrendingUp, Zap, CreditCard, User, Gift } from 'lucide-react'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import type { PageType } from '@/app/page'

interface NavigationProps {
  currentPage: PageType
  onNavigate: (page: PageType) => void
  isSubscribed: boolean
}

export function Navigation({ currentPage, onNavigate, isSubscribed }: NavigationProps) {
  const { hapticFeedback } = useTelegramWebApp()

  const handleNavigation = (page: PageType) => {
    hapticFeedback('selection')
    onNavigate(page)
  }

  const navItems = [
    {
      id: 'home' as PageType,
      icon: Home,
      label: 'Home',
      available: true
    },
    {
      id: 'coins' as PageType,
      icon: TrendingUp,
      label: 'Coins',
      available: true
    },
    {
      id: 'signals' as PageType,
      icon: Zap,
      label: 'Signals',
      available: true,
      premium: true
    },
    {
      id: 'subscription' as PageType,
      icon: CreditCard,
      label: 'Subscribe',
      available: true
    },
    {
      id: 'account' as PageType,
      icon: User,
      label: 'Account',
      available: true
    },
    {
      id: 'cpa' as PageType,
      icon: Gift,
      label: 'Rewards',
      available: true
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-lg border-t border-white/20 z-50">
      <div className="grid grid-cols-6 px-2 py-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPage === item.id
          const isPremiumLocked = item.premium && !isSubscribed
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              disabled={!item.available}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-primary-600/20 text-primary-300' 
                  : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }
                ${isPremiumLocked ? 'opacity-50' : ''}
                ${!item.available ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="relative">
                <Icon size={20} />
                {isPremiumLocked && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-black font-bold">!</span>
                  </div>
                )}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
