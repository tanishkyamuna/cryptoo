import { NextRequest, NextResponse } from 'next/server'
import { CPACampaign } from '@/types'

// Mock CPA campaigns for development
const MOCK_CAMPAIGNS: CPACampaign[] = [
  {
    id: 'cpa_1',
    title: 'Download Binance App',
    description: 'Download and register on Binance mobile app to earn 7 days of premium access',
    reward_type: 'premium_days',
    reward_amount: 7,
    action_type: 'app_install',
    app_url: 'https://www.binance.com/en/download',
    tracking_url: 'https://partner.binance.com/track?ref=cryptoquiver',
    requirements: [
      'Download Binance mobile app',
      'Complete registration with valid email',
      'Verify your account',
      'Complete identity verification (KYC)'
    ],
    is_active: true,
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    max_completions: 1000,
    current_completions: 156,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cpa_2',
    title: 'Connect MetaMask Wallet',
    description: 'Connect your MetaMask wallet and make a test transaction to earn premium access',
    reward_type: 'premium_days',
    reward_amount: 3,
    action_type: 'wallet_connect',
    tracking_url: 'https://metamask.io/cryptoquiver-partner',
    requirements: [
      'Install MetaMask browser extension',
      'Create or import wallet',
      'Connect wallet to our platform',
      'Complete a test transaction (minimum $10)'
    ],
    is_active: true,
    expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days
    max_completions: 500,
    current_completions: 89,
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cpa_3',
    title: 'OKX Exchange Registration',
    description: 'Sign up for OKX exchange and complete KYC verification',
    reward_type: 'premium_days',
    reward_amount: 14,
    action_type: 'registration',
    app_url: 'https://www.okx.com',
    tracking_url: 'https://www.okx.com/partner/cryptoquiver',
    requirements: [
      'Register new account on OKX',
      'Complete email verification',
      'Complete phone verification',
      'Complete KYC Level 1 verification',
      'Make initial deposit (minimum $50)'
    ],
    is_active: true,
    expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days
    max_completions: 300,
    current_completions: 45,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cpa_4',
    title: 'DeFi Yield Farming',
    description: 'Participate in DeFi yield farming on supported platforms',
    reward_type: 'premium_days',
    reward_amount: 21,
    action_type: 'deposit',
    tracking_url: 'https://defi-partner.com/cryptoquiver',
    requirements: [
      'Connect wallet to supported DeFi platform',
      'Deposit minimum $100 in liquidity pool',
      'Maintain position for at least 7 days',
      'Provide transaction hash as proof'
    ],
    is_active: true,
    expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
    max_completions: 200,
    current_completions: 23,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'cpa_5',
    title: 'Crypto.com App Challenge',
    description: 'Download Crypto.com app and complete the onboarding process',
    reward_type: 'premium_days',
    reward_amount: 5,
    action_type: 'app_install',
    app_url: 'https://crypto.com/app',
    tracking_url: 'https://crypto.com/partner/cryptoquiver',
    requirements: [
      'Download Crypto.com mobile app',
      'Complete registration process',
      'Verify email and phone number',
      'Complete basic KYC verification'
    ],
    is_active: true,
    expires_at: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(), // 21 days
    max_completions: 750,
    current_completions: 234,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active_only = searchParams.get('active_only') === 'true'
    const reward_type = searchParams.get('reward_type')
    const action_type = searchParams.get('action_type')

    let campaigns = [...MOCK_CAMPAIGNS]

    // Filter active campaigns only
    if (active_only) {
      const now = new Date()
      campaigns = campaigns.filter(campaign => 
        campaign.is_active && 
        (!campaign.expires_at || new Date(campaign.expires_at) > now) &&
        (!campaign.max_completions || campaign.current_completions < campaign.max_completions)
      )
    }

    // Filter by reward type
    if (reward_type && reward_type !== 'all') {
      campaigns = campaigns.filter(campaign => campaign.reward_type === reward_type)
    }

    // Filter by action type
    if (action_type && action_type !== 'all') {
      campaigns = campaigns.filter(campaign => campaign.action_type === action_type)
    }

    // Sort by creation date (newest first)
    campaigns.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    return NextResponse.json({
      success: true,
      data: campaigns,
      total: campaigns.length
    })
  } catch (error) {
    console.error('Error fetching CPA campaigns:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch CPA campaigns',
        data: [] 
      },
      { status: 500 }
    )
  }
}

// POST endpoint to track campaign completion
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign_id, user_id, verification_data } = body

    if (!campaign_id || !user_id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: campaign_id, user_id' 
        },
        { status: 400 }
      )
    }

    // Find campaign
    const campaign = MOCK_CAMPAIGNS.find(c => c.id === campaign_id)
    if (!campaign) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campaign not found' 
        },
        { status: 404 }
      )
    }

    // Check if campaign is still active
    if (!campaign.is_active || (campaign.expires_at && new Date(campaign.expires_at) <= new Date())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campaign is no longer active' 
        },
        { status: 400 }
      )
    }

    // Check completion limit
    if (campaign.max_completions && campaign.current_completions >= campaign.max_completions) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campaign completion limit reached' 
        },
        { status: 400 }
      )
    }

    // Create completion record
    const completion = {
      id: `completion_${Date.now()}`,
      user_id,
      campaign_id,
      status: 'pending' as const,
      reward_claimed: false,
      verification_data,
      created_at: new Date().toISOString()
    }

    // In a real app, save to database and verify the completion
    // For demo purposes, we'll auto-approve after a delay
    setTimeout(() => {
      (completion as any).status = 'completed';
      (completion as any).completed_at = new Date().toISOString()
    }, 5000) // 5 seconds delay for demo

    // Update campaign completion count
    campaign.current_completions++

    return NextResponse.json({
      success: true,
      data: completion,
      message: 'Campaign completion submitted for verification'
    })
  } catch (error) {
    console.error('Error submitting campaign completion:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit campaign completion' 
      },
      { status: 500 }
    )
  }
}
