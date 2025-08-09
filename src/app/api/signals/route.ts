import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'
import { TradingSignal } from '@/types'

// Mock trading signals for development
const MOCK_SIGNALS: TradingSignal[] = [
  {
    id: 'signal_1',
    coin_id: 'bitcoin',
    coin_symbol: 'BTC',
    coin_name: 'Bitcoin',
    signal_type: 'buy',
    strategy_type: 'swing',
    risk_level: 'medium',
    entry_price: 67000,
    target_price: 72000,
    stop_loss: 64000,
    confidence: 85,
    description: 'Bitcoin showing strong support at $67k level with RSI oversold. Technical indicators suggest a potential bounce to $72k resistance. Volume confirmation needed.',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    is_active: true,
    performance: {
      current_price: 67420,
      profit_loss_percentage: 0.63,
      status: 'pending'
    }
  },
  {
    id: 'signal_2',
    coin_id: 'ethereum',
    coin_symbol: 'ETH',
    coin_name: 'Ethereum',
    signal_type: 'buy',
    strategy_type: 'day',
    risk_level: 'high',
    entry_price: 2650,
    target_price: 2780,
    stop_loss: 2580,
    confidence: 75,
    description: 'ETH breakout above $2650 resistance with high volume. Quick day trade opportunity targeting $2780. Tight stop loss due to volatile market conditions.',
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    expires_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day from now
    is_active: true,
    performance: {
      current_price: 2670,
      profit_loss_percentage: 0.75,
      status: 'pending'
    }
  },
  {
    id: 'signal_3',
    coin_id: 'chainlink',
    coin_symbol: 'LINK',
    coin_name: 'Chainlink',
    signal_type: 'sell',
    strategy_type: 'swing',
    risk_level: 'low',
    entry_price: 15.20,
    target_price: 13.80,
    stop_loss: 16.00,
    confidence: 70,
    description: 'LINK facing resistance at $15.20 level. RSI overbought and showing bearish divergence. Conservative sell signal with limited downside risk.',
    created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    is_active: true
  },
  {
    id: 'signal_4',
    coin_id: 'solana',
    coin_symbol: 'SOL',
    coin_name: 'Solana',
    signal_type: 'buy',
    strategy_type: 'long-term',
    risk_level: 'medium',
    entry_price: 180,
    target_price: 250,
    stop_loss: 160,
    confidence: 90,
    description: 'SOL fundamentals remain strong with increasing DeFi adoption. Long-term accumulation opportunity at current levels. Strong ecosystem growth expected.',
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    is_active: true,
    performance: {
      current_price: 185,
      profit_loss_percentage: 2.78,
      status: 'profit'
    }
  },
  {
    id: 'signal_5',
    coin_id: 'cardano',
    coin_symbol: 'ADA',
    coin_name: 'Cardano',
    signal_type: 'hold',
    strategy_type: 'long-term',
    risk_level: 'low',
    entry_price: 0.45,
    target_price: 0.65,
    stop_loss: 0.38,
    confidence: 65,
    description: 'ADA consolidating in range. Upcoming protocol upgrades and partnerships could drive price higher. Patient holding recommended.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    expires_at: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days from now
    is_active: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const strategy = searchParams.get('strategy')
    const risk = searchParams.get('risk')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '20')

    let signals = [...MOCK_SIGNALS]

    // Apply filters
    if (strategy && strategy !== 'all') {
      signals = signals.filter(signal => signal.strategy_type === strategy)
    }

    if (risk && risk !== 'all') {
      signals = signals.filter(signal => signal.risk_level === risk)
    }

    if (status && status !== 'all') {
      if (status === 'active') {
        signals = signals.filter(signal => 
          signal.is_active && new Date(signal.expires_at) > new Date()
        )
      } else if (status === 'expired') {
        signals = signals.filter(signal => 
          !signal.is_active || new Date(signal.expires_at) <= new Date()
        )
      }
    }

    // Sort by creation date (newest first)
    signals.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Apply limit
    signals = signals.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: signals,
      pagination: {
        total: signals.length,
        page: 1,
        limit: limit,
        pages: 1
      }
    })
  } catch (error) {
    console.error('Error fetching trading signals:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch trading signals',
        data: [] 
      },
      { status: 500 }
    )
  }
}

// POST endpoint for creating new signals (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate signal data
    const requiredFields = ['coin_id', 'coin_symbol', 'coin_name', 'signal_type', 'strategy_type', 'risk_level', 'entry_price', 'target_price', 'stop_loss', 'confidence', 'description']
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { 
            success: false, 
            error: `Missing required field: ${field}` 
          },
          { status: 400 }
        )
      }
    }

    const newSignal: TradingSignal = {
      id: `signal_${Date.now()}`,
      ...body,
      created_at: new Date().toISOString(),
      expires_at: body.expires_at || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days default
      is_active: true
    }

    // In a real app, save to database
    MOCK_SIGNALS.unshift(newSignal)

    return NextResponse.json({
      success: true,
      data: newSignal,
      message: 'Trading signal created successfully'
    })
  } catch (error) {
    console.error('Error creating trading signal:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create trading signal' 
      },
      { status: 500 }
    )
  }
}
