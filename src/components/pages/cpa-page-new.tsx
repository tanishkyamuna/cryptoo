'use client'

import { useState, useEffect } from 'react'
import { Gift, ExternalLink, Clock, CheckCircle, Star, Trophy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'
import { useCPAStore } from '@/store/cpa-store'
import { useUserStore } from '@/store/user-store'
import type { PageType } from '@/app/page'
import type { CPACampaign } from '@/types'

interface CPAPageProps {
  onNavigate: (page: PageType) => void
}

export function CPAPage({ onNavigate }: CPAPageProps) {
  const { hapticFeedback } = useTelegramWebApp()
  const { user } = useUserStore()
  const {
    campaigns,
    completions,
    loading,
    error,
    setCampaigns,
    setCompletions,
    addCompletion,
    setLoading,
    setError,
    getActiveCampaigns,
    getUserCompletions,
    isCampaignCompleted,
    getPendingRewards
  } = useCPAStore()

  const [refreshing, setRefreshing] = useState(false)
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null)

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/cpa?active_only=true')
      const data = await response.json()

      if (data.success) {
        setCampaigns(data.data)
      } else {
        setError(data.error || 'Failed to fetch campaigns')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    hapticFeedback('impact', 'light')
    await fetchCampaigns()
    setRefreshing(false)
  }

  const handleCampaignAction = async (campaign: CPACampaign) => {
    if (!user) return

    hapticFeedback('impact')

    // Open the app URL or tracking URL
    const url = campaign.app_url || campaign.tracking_url
    if (url) {
      window.open(url, '_blank')
    }

    // Submit completion (in real app, this would be tracked automatically)
    try {
      const response = await fetch('/api/cpa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          campaign_id: campaign.id,
          user_id: user.id,
          verification_data: {
            timestamp: new Date().toISOString(),
            user_agent: navigator.userAgent
          }
        })
      })

      const data = await response.json()
      if (data.success) {
        addCompletion(data.data)
        hapticFeedback('notification', 'success')
      }
    } catch (err) {
      console.error('Error submitting campaign completion:', err)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const activeCampaigns = getActiveCampaigns()
  const userCompletions = user ? getUserCompletions(user.id) : []
  const pendingRewards = user ? getPendingRewards(user.id) : { campaigns: 0, premiumDays: 0, tokens: 0 }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">CPA Campaigns</h1>
          <p className="text-gray-400">Complete tasks to earn rewards</p>
        </div>
        <Button
          onClick={handleRefresh}
          disabled={refreshing}
          className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Rewards Summary */}
      <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-4 border border-purple-500/20">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Your Rewards</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{userCompletions.filter(c => c.status === 'completed').length}</div>
            <div className="text-sm text-gray-400">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{pendingRewards.premiumDays}</div>
            <div className="text-sm text-gray-400">Premium Days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{pendingRewards.campaigns}</div>
            <div className="text-sm text-gray-400">Pending</div>
          </div>
        </div>

        {pendingRewards.campaigns > 0 && (
          <Button
            onClick={() => onNavigate('account')}
            className="w-full mt-3 bg-green-600 hover:bg-green-700 text-white"
          >
            <Gift className="w-4 h-4 mr-2" />
            Claim {pendingRewards.premiumDays} Premium Days
          </Button>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-400 mb-2">{error}</p>
          <Button
            onClick={fetchCampaigns}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Active Campaigns */}
      {!loading && !error && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-white mb-4">Available Campaigns</h2>
          
          {activeCampaigns.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Gift className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No active campaigns available</p>
            </div>
          ) : (
            activeCampaigns.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                isCompleted={user ? isCampaignCompleted(campaign.id, user.id) : false}
                isExpanded={expandedCampaign === campaign.id}
                onToggleExpand={() => {
                  setExpandedCampaign(expandedCampaign === campaign.id ? null : campaign.id)
                  hapticFeedback('selection')
                }}
                onAction={() => handleCampaignAction(campaign)}
              />
            ))
          )}
        </div>
      )}
    </div>
  )
}

interface CampaignCardProps {
  campaign: CPACampaign
  isCompleted: boolean
  isExpanded: boolean
  onToggleExpand: () => void
  onAction: () => void
}

function CampaignCard({ campaign, isCompleted, isExpanded, onToggleExpand, onAction }: CampaignCardProps) {
  const getRewardColor = () => {
    switch (campaign.reward_type) {
      case 'premium_days':
        return 'text-blue-400'
      case 'tokens':
        return 'text-yellow-400'
      default:
        return 'text-gray-400'
    }
  }

  const getActionTypeIcon = () => {
    switch (campaign.action_type) {
      case 'app_install':
        return '📱'
      case 'wallet_connect':
        return '🔗'
      case 'registration':
        return '📝'
      case 'deposit':
        return '💰'
      default:
        return '🎯'
    }
  }

  const formatTimeRemaining = () => {
    if (!campaign.expires_at) return null
    
    const now = new Date()
    const expires = new Date(campaign.expires_at)
    const diff = expires.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days > 0) return `${days} days left`
    
    const hours = Math.floor(diff / (1000 * 60 * 60))
    return `${hours} hours left`
  }

  const completionRate = campaign.max_completions 
    ? Math.round((campaign.current_completions / campaign.max_completions) * 100)
    : 0

  return (
    <div className={`border rounded-xl transition-all ${
      isCompleted 
        ? 'border-green-500/20 bg-green-900/10' 
        : 'border-gray-700 bg-gray-800/30 hover:border-blue-500/40'
    }`}>
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{getActionTypeIcon()}</div>
            <div>
              <h3 className="font-semibold text-white">{campaign.title}</h3>
              <p className="text-sm text-gray-400">{campaign.description}</p>
            </div>
          </div>
          
          {isCompleted && (
            <CheckCircle className="w-6 h-6 text-green-400" />
          )}
        </div>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-sm text-gray-400">Reward:</span>
              <div className={`font-bold ${getRewardColor()}`}>
                {campaign.reward_amount} {campaign.reward_type === 'premium_days' ? 'Premium Days' : 'Tokens'}
              </div>
            </div>
            
            {campaign.max_completions && (
              <div>
                <span className="text-sm text-gray-400">Progress:</span>
                <div className="text-sm font-medium text-white">
                  {campaign.current_completions}/{campaign.max_completions} ({completionRate}%)
                </div>
              </div>
            )}
          </div>

          {formatTimeRemaining() && (
            <div className="text-right">
              <Clock className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              <div className="text-xs text-gray-400">{formatTimeRemaining()}</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onToggleExpand}
            variant="ghost"
            className="text-blue-400 hover:text-blue-300 px-0"
          >
            {isExpanded ? 'Hide Details' : 'View Requirements'}
          </Button>
          
          {!isCompleted && (
            <Button
              onClick={onAction}
              className="ml-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Start Task
            </Button>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <h4 className="font-medium text-white mb-2">Requirements:</h4>
            <ul className="space-y-1">
              {campaign.requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
