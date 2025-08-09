'use client'

import { useState, useEffect, useCallback } from 'react'
import { TrendingUp, TrendingDown, Clock, Target, Shield, AlertTriangle, Lock, Filter, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'

interface SignalsPageProps {
  onNavigate: (page: PageType) => void
}

export function SignalsPage({ onNavigate }: SignalsPageProps) {
  const { hapticFeedback } = useTelegramWebApp()
  const { premiumAccess, user, setSubscription } = useUserStore()
  const [loading, setLoading] = useState(false)

  // Enable premium access for testing
  const enablePremiumForTesting = () => {
    if (user) {
      const mockSubscription = {
        id: 'test_sub',
        user_id: user.id,
        type: 'monthly' as const,
        status: 'active' as const,
        payment_method: 'usdt' as const,
        amount: 9.99,
        currency: 'USDT',
        starts_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        payment_details: {
          payment_id: 'test_payment',
          address: 'test_address'
        }
      }
      setSubscription(mockSubscription)
    }
  }

  if (!premiumAccess.signals) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Trading Signals</h1>
          <p className="text-gray-400">Professional trading recommendations</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-8 text-center space-y-4">
          <Lock className="w-16 h-16 text-blue-400 mx-auto" />
          <h3 className="text-xl font-semibold text-white">Premium Feature</h3>
          <p className="text-gray-400">
            Get access to professional trading signals with entry points, targets, and risk management.
          </p>
          <ul className="text-left text-gray-300 space-y-2 max-w-sm mx-auto">
            <li className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              Buy/Sell recommendations
            </li>
            <li className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-400" />
              Entry & target prices
            </li>
            <li className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-400" />
              Stop-loss levels
            </li>
            <li className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              Real-time updates
            </li>
          </ul>
          <Button 
            onClick={() => {
              hapticFeedback('impact')
              onNavigate('subscription')
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
          >
            Upgrade to Premium
          </Button>
          
          {/* Temporary test button for development */}
          <Button 
            onClick={enablePremiumForTesting}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold mt-2"
          >
            Enable Premium (Test)
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="text-gray-300 mt-4">Loading trading signals...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Trading Signals</h1>
          <p className="text-gray-400">Professional recommendations</p>
        </div>
        <Button
          onClick={() => setLoading(!loading)}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
        >
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      <div className="bg-gray-800/50 rounded-xl p-8 text-center">
        <TrendingUp className="w-16 h-16 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-3">
          Trading Signals Coming Soon
        </h3>
        <p className="text-gray-400">
          Advanced trading signals with AI-powered recommendations will be available here.
        </p>
      </div>
    </div>
  )
}
