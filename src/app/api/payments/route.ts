import { NextRequest, NextResponse } from 'next/server'
import { Payment, Subscription } from '@/types'

// Mock payment data
const MOCK_PAYMENTS: Payment[] = []
const MOCK_SUBSCRIPTIONS: Subscription[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, subscription_type, payment_method } = body

    if (!user_id || !subscription_type || !payment_method) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: user_id, subscription_type, payment_method' 
        },
        { status: 400 }
      )
    }

    // Define pricing
    const pricing = {
      monthly: { usdt: 9.99, btc: 0.00025 },
      yearly: { usdt: 99.99, btc: 0.0025 } // ~17% discount
    }

    if (!pricing[subscription_type as keyof typeof pricing]) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid subscription type' 
        },
        { status: 400 }
      )
    }

    const amount = pricing[subscription_type as keyof typeof pricing][payment_method as keyof typeof pricing.monthly]

    // Create subscription record
    const subscription: Subscription = {
      id: `sub_${Date.now()}`,
      user_id,
      type: subscription_type,
      status: 'pending',
      payment_method,
      amount,
      currency: payment_method.toUpperCase(),
      starts_at: new Date().toISOString(),
      expires_at: subscription_type === 'monthly' 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString()
    }

    // Create payment record
    const paymentId = `pay_${Date.now()}`
    const payment: Payment = {
      id: paymentId,
      user_id,
      subscription_id: subscription.id,
      amount,
      currency: payment_method.toUpperCase(),
      status: 'waiting_for_payment',
      payment_address: generateMockAddress(payment_method),
      payment_amount: amount,
      payment_currency: payment_method.toUpperCase(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
      pay_url: `https://payments.example.com/pay/${paymentId}`,
      qr_code_url: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${generateMockAddress(payment_method)}`
    }

    // Store in mock database
    MOCK_SUBSCRIPTIONS.push(subscription)
    MOCK_PAYMENTS.push(payment)

    return NextResponse.json({
      success: true,
      data: {
        subscription,
        payment
      },
      message: 'Payment created successfully'
    })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment' 
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check payment status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const payment_id = searchParams.get('payment_id')
    const user_id = searchParams.get('user_id')

    if (payment_id) {
      // Get specific payment
      const payment = MOCK_PAYMENTS.find(p => p.id === payment_id)
      if (!payment) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Payment not found' 
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: payment
      })
    }

    if (user_id) {
      // Get user payments
      const userPayments = MOCK_PAYMENTS.filter(p => p.user_id === parseInt(user_id))
      return NextResponse.json({
        success: true,
        data: userPayments
      })
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Missing payment_id or user_id parameter' 
      },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching payment:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payment' 
      },
      { status: 500 }
    )
  }
}

// Generate mock crypto addresses for demo
function generateMockAddress(currency: string): string {
  const addresses = {
    usdt: {
      trc20: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t',
      erc20: '0x742d35Cc6634C0532925a3b8D400E'
    },
    btc: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'
  }
  
  if (currency === 'usdt') {
    return addresses.usdt.trc20 // Default to TRC20 for lower fees
  }
  
  return addresses.btc
}
