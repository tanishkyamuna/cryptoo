'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Signal, CreditCard, Star, ArrowRight, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'

interface HomePageProps {
  onNavigate: (page: PageType) => void
}

export function HomePage({ onNavigate }: HomePageProps) {
  const { user, hapticFeedback } = useTelegramWebApp()
  const { isSubscribed, premiumAccess } = useUserStore()
  const [greeting, setGreeting] = useState('')

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const handleFeatureClick = (page: PageType) => {
    hapticFeedback('impact', 'light')
    onNavigate(page)
  }

  const features = [
    {
      title: 'Explore Coins',
      description: 'Discover trending cryptocurrencies with real-time data',
      icon: TrendingUp,
      action: () => handleFeatureClick('coins'),
      gradient: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      title: 'Trading Signals',
      description: 'Get professional trading recommendations',
      icon: Signal,
      action: () => handleFeatureClick('signals'),
      gradient: 'from-purple-500 to-pink-500',
      available: true,
      premium: true
    },
    {
      title: 'Premium Access',
      description: 'Unlock advanced features and insights',
      icon: Star,
      action: () => handleFeatureClick('subscription'),
      gradient: 'from-yellow-500 to-orange-500',
      available: true
    },
    {
      title: 'Earn Rewards',
      description: 'Complete tasks and earn premium access',
      icon: Zap,
      action: () => handleFeatureClick('cpa'),
      gradient: 'from-green-500 to-emerald-500',
      available: true
    }
  ]

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            CryptoQuiver
          </h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full mx-auto" />
        </div>
        
        <p className="text-lg text-gray-300">
          {greeting}, {user?.first_name || 'Trader'}! 👋
        </p>
        <p className="text-gray-400 mt-1">
          Your crypto trading companion in Telegram
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Account Status</h3>
            <p className="text-gray-300 text-sm">
              {isSubscribed ? 'Premium Active' : 'Free Account'}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isSubscribed 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
              : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
          }`}>
            {isSubscribed ? '✨ Premium' : '🆓 Free'}
          </div>
        </div>
        
        {!isSubscribed && (
          <Button
            onClick={() => handleFeatureClick('subscription')}
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700"
          >
            Upgrade to Premium
            <ArrowRight size={16} className="ml-2" />
          </Button>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-white">1,000+</div>
          <div className="text-gray-300 text-sm">Coins Tracked</div>
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="text-2xl font-bold text-white">24/7</div>
          <div className="text-gray-300 text-sm">Market Updates</div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white mb-4">Features</h2>
        
        {features.map((feature, index) => {
          const Icon = feature.icon
          const isPremiumLocked = feature.premium && !isSubscribed
          
          return (
            <div
              key={index}
              onClick={feature.action}
              className={`
                relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300
                bg-white/10 backdrop-blur-lg border border-white/20
                hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]
                ${isPremiumLocked ? 'opacity-75' : ''}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient}`}>
                  <Icon size={24} className="text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-white">
                      {feature.title}
                    </h3>
                    {feature.premium && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full border border-yellow-500/30">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mt-1">
                    {feature.description}
                  </p>
                </div>
                
                <ArrowRight size={20} className="text-gray-400" />
              </div>
              
              {isPremiumLocked && (
                <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <CreditCard size={24} className="text-yellow-400 mx-auto mb-2" />
                    <p className="text-yellow-300 text-sm font-medium">Premium Required</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Welcome Message for New Users */}
      {!isSubscribed && (
        <div className="mt-8 bg-gradient-to-r from-primary-500/20 to-purple-500/20 backdrop-blur-lg rounded-2xl p-6 border border-primary-500/30">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Welcome to CryptoQuiver! 🚀
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Start exploring crypto markets and get access to premium trading signals
            </p>
            <div className="flex space-x-3">
              <Button
                onClick={() => handleFeatureClick('coins')}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10"
              >
                Explore Coins
              </Button>
              <Button
                onClick={() => handleFeatureClick('subscription')}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600"
              >
                Go Premium
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
