'use client'

import { useState } from 'react'
import { Crown, Check, Zap, TrendingUp, Bell, Download, Bitcoin, DollarSign, Clock, QrCode, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'
import type { Payment, Subscription } from '@/types'

interface SubscriptionPageProps {
  onNavigate: (page: PageType) => void
}

export function SubscriptionPage({ onNavigate }: SubscriptionPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [selectedPayment, setSelectedPayment] = useState<'usdt' | 'btc'>('usdt')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePayment, setActivePayment] = useState<Payment | null>(null)
  const [paymentStep, setPaymentStep] = useState<'select' | 'payment' | 'confirm'>('select')
  
  const { hapticFeedback, showAlert } = useTelegramWebApp()
  const { isSubscribed, subscription, user, setSubscription } = useUserStore()

  const plans = {
    monthly: {
      name: 'Monthly Premium',
      duration: '1 Month',
      price: {
        usdt: 9.99,
        btc: 0.00025
      },
      savings: null
    },
    yearly: {
      name: 'Yearly Premium',
      duration: '12 Months',
      price: {
        usdt: 99.99,
        btc: 0.0025
      },
      savings: '17% OFF',
      originalPrice: {
        usdt: 119.88,
        btc: 0.003
      }
    }
  }

  const features = [
    {
      icon: TrendingUp,
      title: 'Premium Trading Signals',
      description: 'Access to professional trading recommendations with entry/exit points'
    },
    {
      icon: Zap,
      title: 'Advanced Technical Analysis',
      description: 'RSI, MACD, Bollinger Bands, and more technical indicators'
    },
    {
      icon: Bell,
      title: 'Real-time Price Alerts',
      description: 'Custom price notifications for your watchlist coins'
    },
    {
      icon: Download,
      title: 'Export & Reports',
      description: 'Download trading data, signals, and analysis reports'
    }
  ]

  const handlePurchase = async () => {
    if (!user) {
      showAlert('Please login to continue')
      return
    }

    hapticFeedback('impact')
    setIsProcessing(true)

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: user.id,
          subscription_type: selectedPlan,
          payment_method: selectedPayment
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setActivePayment(data.data.payment)
        setPaymentStep('payment')
        hapticFeedback('notification', 'success')
      } else {
        showAlert(data.error || 'Failed to create payment')
      }
    } catch (error) {
      showAlert('Network error occurred')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCopyAddress = async () => {
    if (activePayment?.payment_address) {
      try {
        await navigator.clipboard.writeText(activePayment.payment_address)
        hapticFeedback('notification', 'success')
        showAlert('Address copied to clipboard!')
      } catch (error) {
        showAlert('Failed to copy address')
      }
    }
  }

  const checkPaymentStatus = async () => {
    if (!activePayment) return

    try {
      const response = await fetch(`/api/payments?payment_id=${activePayment.id}`)
      const data = await response.json()

      if (data.success && data.data.status === 'confirmed') {
        // Payment confirmed, activate subscription
        const newSubscription: Subscription = {
          id: `sub_${Date.now()}`,
          user_id: user!.id,
          type: selectedPlan,
          status: 'active',
          payment_method: selectedPayment,
          amount: plans[selectedPlan].price[selectedPayment],
          currency: selectedPayment.toUpperCase(),
          starts_at: new Date().toISOString(),
          expires_at: selectedPlan === 'monthly' 
            ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          payment_details: {
            payment_id: activePayment.id,
            address: activePayment.payment_address
          }
        }

        setSubscription(newSubscription)
        setPaymentStep('confirm')
        hapticFeedback('notification', 'success')
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'usdt') {
      return `$${price.toFixed(2)} USDT`
    }
    return `₿${price.toFixed(5)} BTC`
  }

  const formatTimeRemaining = () => {
    if (!activePayment?.expires_at) return ''
    
    const expires = new Date(activePayment.expires_at)
    const now = new Date()
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m remaining`
    }
    return `${minutes}m remaining`
  }

  if (isSubscribed && subscription) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Premium Active</h1>
          <p className="text-gray-400">You have full access to all premium features</p>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 rounded-xl p-6 border border-yellow-500/20">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-semibold text-white">{subscription.type === 'monthly' ? 'Monthly' : 'Yearly'} Premium</h3>
            <p className="text-gray-300">Expires on {new Date(subscription.expires_at).toLocaleDateString()}</p>
            <div className="text-sm text-gray-400">
              {Math.ceil((new Date(subscription.expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days remaining
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Active Features</h3>
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
              <Check className="w-5 h-5 text-green-400" />
              <div>
                <h4 className="font-medium text-white">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Button
          onClick={() => onNavigate('account')}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Manage Subscription
        </Button>
      </div>
    )
  }

  if (paymentStep === 'payment' && activePayment) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Complete Payment</h1>
          <p className="text-gray-400">Send {selectedPayment.toUpperCase()} to the address below</p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {formatPrice(activePayment.payment_amount, activePayment.payment_currency)}
            </div>
            <div className="text-gray-400">
              {plans[selectedPlan].name}
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-2">Payment Address:</div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-white text-sm bg-gray-900/50 p-2 rounded break-all">
                {activePayment.payment_address}
              </code>
              <Button
                onClick={handleCopyAddress}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {activePayment.qr_code_url && (
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Or scan QR code:</div>
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={activePayment.qr_code_url} 
                  alt="Payment QR Code"
                  className="w-48 h-48"
                />
              </div>
            </div>
          )}

          <div className="text-center">
            <div className="text-yellow-400 flex items-center justify-center gap-2 mb-2">
              <Clock className="w-4 h-4" />
              {formatTimeRemaining()}
            </div>
            <div className="text-sm text-gray-400">
              Payment will be detected automatically
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={() => {
              setPaymentStep('select')
              setActivePayment(null)
            }}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={checkPaymentStatus}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Check Payment
          </Button>
        </div>

        {activePayment.pay_url && (
          <Button
            onClick={() => window.open(activePayment.pay_url, '_blank')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Open Payment Page
          </Button>
        )}
      </div>
    )
  }

  if (paymentStep === 'confirm') {
    return (
      <div className="space-y-6 p-6">
        <div className="text-center">
          <Check className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Payment Confirmed!</h1>
          <p className="text-gray-400">Your premium subscription is now active</p>
        </div>

        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-xl p-6 border border-green-500/20">
          <h3 className="text-xl font-semibold text-white text-center mb-4">Welcome to Premium!</h3>
          <div className="space-y-2">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-white">{feature.title}</span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => {
            onNavigate('signals')
            hapticFeedback('impact')
          }}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Explore Premium Features
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center">
        <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Upgrade to Premium</h1>
        <p className="text-gray-400">Unlock advanced trading features and signals</p>
      </div>

      {/* Plan Selection */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Choose Your Plan</h3>
        {Object.entries(plans).map(([planKey, plan]) => (
          <div
            key={planKey}
            className={`border rounded-xl p-4 cursor-pointer transition-all ${
              selectedPlan === planKey
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
            }`}
            onClick={() => {
              setSelectedPlan(planKey as 'monthly' | 'yearly')
              hapticFeedback('selection')
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">{plan.name}</h4>
                <p className="text-sm text-gray-400">{plan.duration}</p>
              </div>
              <div className="text-right">
                {plan.savings && (
                  <div className="text-green-400 text-sm font-medium">{plan.savings}</div>
                )}
                <div className="text-white font-bold">
                  {formatPrice(plan.price[selectedPayment], selectedPayment)}
                </div>
                {('originalPrice' in plan) && plan.originalPrice && (
                  <div className="text-gray-400 text-sm line-through">
                    {formatPrice(plan.originalPrice[selectedPayment], selectedPayment)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'usdt', name: 'USDT', icon: DollarSign, description: 'Tether (TRC20)' },
            { key: 'btc', name: 'Bitcoin', icon: Bitcoin, description: 'BTC Network' }
          ].map((method) => (
            <div
              key={method.key}
              className={`border rounded-xl p-4 cursor-pointer transition-all ${
                selectedPayment === method.key
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
              onClick={() => {
                setSelectedPayment(method.key as 'usdt' | 'btc')
                hapticFeedback('selection')
              }}
            >
              <div className="text-center">
                <method.icon className="w-8 h-8 mx-auto mb-2 text-white" />
                <h4 className="font-semibold text-white">{method.name}</h4>
                <p className="text-xs text-gray-400">{method.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Premium Features</h3>
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <feature.icon className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Purchase Button */}
      <Button
        onClick={handlePurchase}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold"
      >
        {isProcessing ? (
          <LoadingSpinner size="small" />
        ) : (
          <>
            Upgrade for {formatPrice(plans[selectedPlan].price[selectedPayment], selectedPayment)}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        • Secure crypto payments • Instant activation • Cancel anytime
      </p>
    </div>
  )
}
