'use client'

import { useState } from 'react'
import { User, Crown, Calendar, Settings, LogOut, Download, Bell, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'

interface AccountPageProps {
  onNavigate: (page: PageType) => void
}

export function AccountPage({ onNavigate }: AccountPageProps) {
  const [showSettings, setShowSettings] = useState(false)
  
  const { user: telegramUser, hapticFeedback, showConfirm } = useTelegramWebApp()
  const { 
    user, 
    subscription, 
    isSubscribed, 
    watchlist, 
    premiumAccess,
    clearUserData 
  } = useUserStore()

  const handleLogout = async () => {
    hapticFeedback('impact', 'medium')
    const confirmed = await showConfirm('Are you sure you want to logout?')
    
    if (confirmed) {
      clearUserData()
      // In a real app, you might want to redirect or show a logout message
    }
  }

  const handleExportData = () => {
    hapticFeedback('impact', 'light')
    
    if (!isSubscribed) {
      onNavigate('subscription')
      return
    }

    // Mock export functionality
    const exportData = {
      user: user,
      watchlist: watchlist,
      subscription: subscription,
      exportedAt: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `cryptoquiver-data-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getDaysUntilExpiry = () => {
    if (!subscription?.expires_at) return 0
    const expiry = new Date(subscription.expires_at)
    const now = new Date()
    const diffTime = expiry.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {telegramUser?.first_name} {telegramUser?.last_name}
        </h1>
        {telegramUser?.username && (
          <p className="text-gray-300">@{telegramUser.username}</p>
        )}
      </div>

      {/* Subscription Status */}
      <div className={`rounded-2xl p-6 mb-6 border ${
        isSubscribed 
          ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
          : 'bg-white/10 border-white/20'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {isSubscribed ? (
              <Crown className="text-yellow-400" size={24} />
            ) : (
              <User className="text-gray-400" size={24} />
            )}
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isSubscribed ? 'Premium Member' : 'Free Account'}
              </h3>
              <p className="text-gray-300 text-sm">
                {isSubscribed 
                  ? `${subscription?.type === 'yearly' ? 'Annual' : 'Monthly'} Subscription`
                  : 'Basic features available'
                }
              </p>
            </div>
          </div>
          
          {!isSubscribed && (
            <Button
              onClick={() => onNavigate('subscription')}
              size="sm"
              className="bg-gradient-to-r from-primary-500 to-primary-600"
            >
              Upgrade
            </Button>
          )}
        </div>

        {isSubscribed && subscription && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-gray-400 text-sm">Expires</div>
              <div className="text-white font-medium">
                {formatDate(subscription.expires_at)}
              </div>
            </div>
            <div>
              <div className="text-gray-400 text-sm">Days Left</div>
              <div className="text-white font-medium">
                {getDaysUntilExpiry()} days
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Star className="text-yellow-400" size={20} />
            <div>
              <div className="text-lg font-bold text-white">{watchlist.length}</div>
              <div className="text-gray-300 text-sm">Watchlist</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
          <div className="flex items-center space-x-3">
            <Calendar className="text-blue-400" size={20} />
            <div>
              <div className="text-lg font-bold text-white">
                {user ? Math.floor((Date.now() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 0}
              </div>
              <div className="text-gray-300 text-sm">Days Active</div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Features Status */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Feature Access</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Trading Signals</span>
            <div className={`px-2 py-1 rounded-lg text-xs ${
              premiumAccess.signals ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {premiumAccess.signals ? 'Active' : 'Locked'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Advanced Charts</span>
            <div className={`px-2 py-1 rounded-lg text-xs ${
              premiumAccess.advancedCharts ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {premiumAccess.advancedCharts ? 'Active' : 'Locked'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Price Alerts</span>
            <div className={`px-2 py-1 rounded-lg text-xs ${
              premiumAccess.alerts ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {premiumAccess.alerts ? 'Active' : 'Locked'}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Data Export</span>
            <div className={`px-2 py-1 rounded-lg text-xs ${
              premiumAccess.export ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
            }`}>
              {premiumAccess.export ? 'Active' : 'Locked'}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
        
        <button
          onClick={() => onNavigate('coins')}
          className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-left hover:bg-white/20 transition-all"
        >
          <div className="flex items-center space-x-3">
            <Star className="text-yellow-400" size={20} />
            <div>
              <div className="text-white font-medium">Manage Watchlist</div>
              <div className="text-gray-400 text-sm">Add or remove coins from your watchlist</div>
            </div>
          </div>
        </button>

        <button
          onClick={handleExportData}
          className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-left hover:bg-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Download className="text-blue-400" size={20} />
              <div>
                <div className="text-white font-medium">Export Data</div>
                <div className="text-gray-400 text-sm">Download your account data</div>
              </div>
            </div>
            {!isSubscribed && (
              <div className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                Premium
              </div>
            )}
          </div>
        </button>

        {isSubscribed && (
          <button
            onClick={() => onNavigate('subscription')}
            className="w-full bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-left hover:bg-white/20 transition-all"
          >
            <div className="flex items-center space-x-3">
              <Settings className="text-gray-400" size={20} />
              <div>
                <div className="text-white font-medium">Manage Subscription</div>
                <div className="text-gray-400 text-sm">View billing and subscription details</div>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">User ID</span>
            <span className="text-white font-mono text-sm">{telegramUser?.id}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Language</span>
            <span className="text-white">{telegramUser?.language_code?.toUpperCase() || 'EN'}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Telegram Premium</span>
            <span className={telegramUser?.is_premium ? 'text-green-400' : 'text-gray-400'}>
              {telegramUser?.is_premium ? 'Yes' : 'No'}
            </span>
          </div>
          
          {user && (
            <div className="flex justify-between">
              <span className="text-gray-400">Member Since</span>
              <span className="text-white">{formatDate(user.created_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        variant="outline"
        className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
      >
        <LogOut size={16} className="mr-2" />
        Logout
      </Button>

      {/* App Info */}
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>CryptoQuiver v1.0.0</p>
        <p>Made with ❤️ for Telegram</p>
      </div>
    </div>
  )
}
