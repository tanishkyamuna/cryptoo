'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { HomePage } from '@/components/pages/home-page'
import { CoinsPage } from '@/components/pages/coins-page'
import { CoinDetailPage } from '@/components/pages/coin-detail-page'
import { SignalsPage } from '@/components/pages/signals-page'
import { SubscriptionPage } from '@/components/pages/subscription-page'
import { AccountPage } from '@/components/pages/account-page'
import { CPAPage } from '@/components/pages/cpa-page'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'

export type PageType = 'home' | 'coins' | 'coin-detail' | 'signals' | 'subscription' | 'account' | 'cpa'

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home')
  const [selectedCoinId, setSelectedCoinId] = useState<string | null>(null)
  
  const { user: tgUser, isReady } = useTelegramWebApp()
  const { initializeUser, user } = useUserStore()

  // Initialize user when Telegram WebApp is ready
  useEffect(() => {
    if (isReady && tgUser && !user) {
      initializeUser(tgUser)
    }
  }, [isReady, tgUser, user, initializeUser])

  const handleCoinSelect = (coinId: string) => {
    setSelectedCoinId(coinId)
    setCurrentPage('coin-detail')
  }

  const handleNavigate = (page: PageType) => {
    setCurrentPage(page)
    if (page !== 'coin-detail') {
      setSelectedCoinId(null)
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />
      
      case 'coins':
        return (
          <CoinsPage 
            onCoinSelect={handleCoinSelect}
            onNavigate={handleNavigate}
          />
        )
      
      case 'coin-detail':
        return selectedCoinId ? (
          <CoinDetailPage 
            coinId={selectedCoinId}
            onBack={() => handleNavigate('coins')}
          />
        ) : (
          <CoinsPage 
            onCoinSelect={handleCoinSelect}
            onNavigate={handleNavigate}
          />
        )
      
      case 'signals':
        return <SignalsPage onNavigate={handleNavigate} />
      
      case 'subscription':
        return <SubscriptionPage onNavigate={handleNavigate} />
      
      case 'account':
        return <AccountPage onNavigate={handleNavigate} />
      
      case 'cpa':
        return <CPAPage onNavigate={handleNavigate} />
      
      default:
        return <HomePage onNavigate={handleNavigate} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="max-w-md mx-auto bg-slate-900/50 min-h-screen">
        {/* Main Content */}
        <main className="pb-20">
          {renderCurrentPage()}
        </main>

        {/* Bottom Navigation */}
        <Navigation 
          currentPage={currentPage}
          onNavigate={handleNavigate}
          isSubscribed={user?.subscription_status === 'active'}
        />
      </div>
    </div>
  )
}
