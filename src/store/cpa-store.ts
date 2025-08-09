import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CPACampaign, CPACompletion } from '@/types'

interface CPAState {
  // Campaigns data
  campaigns: CPACampaign[]
  completions: CPACompletion[]
  loading: boolean
  error: string | null
  
  // User progress
  totalRewardsEarned: number
  premiumDaysEarned: number
  
  // Actions
  setCampaigns: (campaigns: CPACampaign[]) => void
  setCompletions: (completions: CPACompletion[]) => void
  addCompletion: (completion: CPACompletion) => void
  updateCompletion: (completionId: string, updates: Partial<CPACompletion>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  getActiveCampaigns: () => CPACampaign[]
  getUserCompletions: (userId: number) => CPACompletion[]
  isCampaignCompleted: (campaignId: string, userId: number) => boolean
  getPendingRewards: (userId: number) => { campaigns: number; premiumDays: number; tokens: number }
  markRewardClaimed: (completionId: string) => void
  clearCPAData: () => void
}

export const useCPAStore = create<CPAState>()(
  persist(
    (set, get) => ({
      // Initial state
      campaigns: [],
      completions: [],
      loading: false,
      error: null,
      totalRewardsEarned: 0,
      premiumDaysEarned: 0,

      // Actions
      setCampaigns: (campaigns: CPACampaign[]) => {
        set({ campaigns, error: null })
      },

      setCompletions: (completions: CPACompletion[]) => {
        set({ completions })
      },

      addCompletion: (completion: CPACompletion) => {
        set((state) => ({
          completions: [...state.completions, completion]
        }))
      },

      updateCompletion: (completionId: string, updates: Partial<CPACompletion>) => {
        set((state) => ({
          completions: state.completions.map(completion =>
            completion.id === completionId ? { ...completion, ...updates } : completion
          )
        }))
      },

      setLoading: (loading: boolean) => {
        set({ loading })
      },

      setError: (error: string | null) => {
        set({ error })
      },

      getActiveCampaigns: () => {
        const state = get()
        const now = new Date()
        
        return state.campaigns.filter(campaign => 
          campaign.is_active && 
          (!campaign.expires_at || new Date(campaign.expires_at) > now) &&
          (!campaign.max_completions || campaign.current_completions < campaign.max_completions)
        )
      },

      getUserCompletions: (userId: number) => {
        const state = get()
        return state.completions.filter(completion => completion.user_id === userId)
      },

      isCampaignCompleted: (campaignId: string, userId: number) => {
        const state = get()
        return state.completions.some(completion => 
          completion.campaign_id === campaignId && 
          completion.user_id === userId && 
          completion.status === 'completed'
        )
      },

      getPendingRewards: (userId: number) => {
        const state = get()
        const userCompletions = state.completions.filter(completion => 
          completion.user_id === userId && 
          completion.status === 'completed' && 
          !completion.reward_claimed
        )

        const rewards = userCompletions.reduce((acc, completion) => {
          const campaign = state.campaigns.find(c => c.id === completion.campaign_id)
          if (campaign) {
            acc.campaigns++
            if (campaign.reward_type === 'premium_days') {
              acc.premiumDays += campaign.reward_amount
            } else if (campaign.reward_type === 'tokens') {
              acc.tokens += campaign.reward_amount
            }
          }
          return acc
        }, { campaigns: 0, premiumDays: 0, tokens: 0 })

        return rewards
      },

      markRewardClaimed: (completionId: string) => {
        set((state) => ({
          completions: state.completions.map(completion =>
            completion.id === completionId 
              ? { ...completion, reward_claimed: true }
              : completion
          )
        }))
      },

      clearCPAData: () => {
        set({
          campaigns: [],
          completions: [],
          loading: false,
          error: null,
          totalRewardsEarned: 0,
          premiumDaysEarned: 0
        })
      }
    }),
    {
      name: 'cryptoquiver-cpa-storage',
      partialize: (state) => ({
        campaigns: state.campaigns,
        completions: state.completions,
        totalRewardsEarned: state.totalRewardsEarned,
        premiumDaysEarned: state.premiumDaysEarned
      })
    }
  )
)
