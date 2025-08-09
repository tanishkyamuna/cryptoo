// Telegram WebApp types
export interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    chat_type?: string
    chat_instance?: string
    start_param?: string
    auth_date?: number
    hash?: string
  }
  version: string
  platform: string
  colorScheme: 'light' | 'dark'
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  ready: () => void
  expand: () => void
  close: () => void
  enableClosingConfirmation: () => void
  disableClosingConfirmation: () => void
  showPopup: (params: PopupParams) => void
  showAlert: (message: string) => void
  showConfirm: (message: string) => Promise<boolean>
  hapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
    selectionChanged: () => void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    readonly isProgressVisible: boolean
    setText: (text: string) => void
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
    enable: () => void
    disable: () => void
    showProgress: (leaveActive?: boolean) => void
    hideProgress: () => void
    setParams: (params: MainButtonParams) => void
  }
  BackButton: {
    isVisible: boolean
    onClick: (callback: () => void) => void
    offClick: (callback: () => void) => void
    show: () => void
    hide: () => void
  }
}

export interface PopupParams {
  title?: string
  message: string
  buttons?: PopupButton[]
}

export interface PopupButton {
  id?: string
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

export interface MainButtonParams {
  text?: string
  color?: string
  text_color?: string
  is_active?: boolean
  is_visible?: boolean
}

// Crypto data types
export interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  fully_diluted_valuation?: number
  total_volume: number
  high_24h: number
  low_24h: number
  price_change_24h: number
  price_change_percentage_24h: number
  market_cap_change_24h: number
  market_cap_change_percentage_24h: number
  circulating_supply: number
  total_supply?: number
  max_supply?: number
  ath: number
  ath_change_percentage: number
  ath_date: string
  atl: number
  atl_change_percentage: number
  atl_date: string
  last_updated: string
  price_change_percentage_7d_in_currency?: number
  price_change_percentage_30d_in_currency?: number
  price_change_percentage_1y_in_currency?: number
}

export interface CoinDetail {
  id: string
  symbol: string
  name: string
  description: {
    en: string
  }
  image: {
    thumb: string
    small: string
    large: string
  }
  market_cap_rank: number
  coingecko_rank: number
  market_data: {
    current_price: {
      usd: number
    }
    market_cap: {
      usd: number
    }
    total_volume: {
      usd: number
    }
    high_24h: {
      usd: number
    }
    low_24h: {
      usd: number
    }
    price_change_24h: number
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    price_change_percentage_1y: number
    market_cap_change_24h: number
    market_cap_change_percentage_24h: number
    circulating_supply: number
    total_supply: number
    max_supply: number
    ath: {
      usd: number
    }
    ath_change_percentage: {
      usd: number
    }
    ath_date: {
      usd: string
    }
    atl: {
      usd: number
    }
    atl_change_percentage: {
      usd: number
    }
    atl_date: {
      usd: string
    }
  }
  links: {
    homepage: string[]
    blockchain_site: string[]
    official_forum_url: string[]
    chat_url: string[]
    announcement_url: string[]
    twitter_screen_name: string
    facebook_username: string
    telegram_channel_identifier: string
    subreddit_url: string
    repos_url: {
      github: string[]
      bitbucket: string[]
    }
  }
}

export interface ChartData {
  prices: [number, number][]
  market_caps: [number, number][]
  total_volumes: [number, number][]
}

export interface TechnicalIndicator {
  rsi?: number
  macd?: {
    macd: number
    signal: number
    histogram: number
  }
  bollinger?: {
    upper: number
    middle: number
    lower: number
  }
  sma?: number
  ema?: number
}

export interface NewsArticle {
  id: string
  title: string
  url: string
  source: {
    title: string
    region: string
    domain: string
    path: string
  }
  published_at: string
  slug: string
  currencies: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  kind: string
  domain: string
  votes: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    lol: number
    toxic: number
    saved: number
    comments: number
  }
}

// Trading signals
export interface TradingSignal {
  id: string
  coin_id: string
  coin_symbol: string
  coin_name: string
  signal_type: 'buy' | 'sell' | 'hold'
  strategy_type: 'day' | 'swing' | 'long-term'
  risk_level: 'low' | 'medium' | 'high'
  entry_price: number
  target_price: number
  stop_loss: number
  confidence: number
  description: string
  created_at: string
  expires_at: string
  is_active: boolean
  performance?: {
    current_price: number
    profit_loss_percentage: number
    status: 'pending' | 'profit' | 'loss' | 'stopped'
  }
}

// User and subscription types
export interface User {
  id: number
  telegram_id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  subscription_status: 'none' | 'active' | 'expired'
  subscription_type?: 'monthly' | 'yearly'
  subscription_expires_at?: string
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  user_id: number
  type: 'monthly' | 'yearly'
  status: 'pending' | 'active' | 'expired' | 'cancelled'
  payment_method: 'usdt' | 'btc'
  amount: number
  currency: string
  starts_at: string
  expires_at: string
  created_at: string
  payment_details?: {
    payment_id: string
    transaction_hash?: string
    address?: string
  }
}

export interface Payment {
  id: string
  user_id: number
  subscription_id: string
  amount: number
  currency: string
  status: 'pending' | 'waiting_for_payment' | 'confirming' | 'confirmed' | 'sending' | 'partially_paid' | 'finished' | 'failed' | 'refunded' | 'expired'
  payment_address: string
  payment_amount: number
  payment_currency: string
  created_at: string
  updated_at: string
  expires_at: string
  pay_url?: string
  qr_code_url?: string
}

// CPA Campaign types
export interface CPACampaign {
  id: string
  title: string
  description: string
  reward_type: 'premium_days' | 'tokens'
  reward_amount: number
  action_type: 'app_install' | 'wallet_connect' | 'registration' | 'deposit'
  app_url?: string
  tracking_url: string
  requirements: string[]
  is_active: boolean
  expires_at?: string
  max_completions?: number
  current_completions: number
  created_at: string
}

export interface CPACompletion {
  id: string
  user_id: number
  campaign_id: string
  status: 'pending' | 'completed' | 'rejected'
  reward_claimed: boolean
  completed_at?: string
  verification_data?: Record<string, any>
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
  error?: string
}

// Watchlist types
export interface WatchlistItem {
  id: string
  user_id: number
  coin_id: string
  coin_symbol: string
  coin_name: string
  target_price?: number
  alert_enabled: boolean
  created_at: string
}

// Filter and sorting types
export interface CoinFilters {
  category?: string
  price_min?: number
  price_max?: number
  market_cap_min?: number
  market_cap_max?: number
  volume_min?: number
  change_24h_min?: number
  change_24h_max?: number
  is_new?: boolean
  is_trending?: boolean
}

export interface SortOption {
  field: 'market_cap_rank' | 'current_price' | 'price_change_percentage_24h' | 'total_volume' | 'market_cap'
  direction: 'asc' | 'desc'
}

// Chart configuration
export interface ChartConfig {
  timeframe: '1D' | '7D' | '30D' | '90D' | '1Y' | 'ALL'
  type: 'price' | 'market_cap' | 'volume'
  indicators?: ('rsi' | 'macd' | 'bollinger' | 'sma' | 'ema')[]
}
