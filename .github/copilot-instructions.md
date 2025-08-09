<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# CryptoQuiver - Telegram Mini App

This is a comprehensive Telegram Mini App for cryptocurrency trading and market analysis built with Next.js, TypeScript, and Tailwind CSS.

## Project Overview

CryptoQuiver is a powerful mini app that runs directly within Telegram, providing:

- **Dynamic Coin Explorer**: Complete list of cryptocurrencies with real-time data
- **Detailed Coin Analysis**: Price charts, technical indicators, and news integration
- **Trading Signals**: AI-powered trading recommendations with risk management
- **Subscription System**: Premium access with crypto payments (USDT/BTC)
- **CPA Campaigns**: Reward system for completing tasks
- **User Management**: Telegram-integrated authentication and account management

## Tech Stack

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **State Management**: Zustand with persistence
- **Data Fetching**: TanStack Query (React Query)
- **UI Components**: Custom components with Lucide React icons
- **Telegram Integration**: Telegram Web Apps SDK
- **Payment Processing**: NowPayments API integration
- **APIs**: CoinGecko API, CryptoPanic API for news

## Key Features

### 🪙 Coin Explorer
- Real-time cryptocurrency data
- Filtering and sorting capabilities
- Watchlist functionality
- Price alerts (premium feature)

### 📊 Detailed Analysis
- Interactive price charts
- Technical indicators (RSI, MACD, Bollinger Bands)
- Real-time news integration
- Market statistics and performance metrics

### 📈 Trading Signals
- Professional trading recommendations
- Entry points, targets, and stop-loss levels
- Risk level classification
- Performance tracking

### 💰 Crypto Payments
- USDT (TRC20/ETH) and Bitcoin payments
- Automated subscription management
- Webhook-based verification
- Secure payment processing

### 🎁 CPA Campaigns
- Task-based reward system
- Premium access rewards
- Progress tracking
- Multiple campaign types

## Development Guidelines

### Component Structure
- Use functional components with TypeScript
- Implement proper error boundaries
- Follow the established component patterns
- Use custom hooks for shared logic

### State Management
- Use Zustand for global state
- Implement proper persistence for user data
- Handle loading and error states consistently

### Styling
- Use Tailwind CSS for all styling
- Follow the established design system
- Implement responsive design principles
- Use proper dark mode support

### API Integration
- Implement proper error handling
- Use React Query for data fetching
- Handle loading states appropriately
- Implement proper caching strategies

### Telegram Integration
- Use the Telegram Web Apps SDK properly
- Handle Telegram-specific UI patterns
- Implement proper haptic feedback
- Use Telegram's color scheme when available

## Security Considerations

- Validate all user inputs
- Implement proper authentication
- Secure payment processing
- Protect sensitive API keys
- Handle user data privacy properly

## Performance Optimization

- Implement code splitting
- Optimize images and assets
- Use proper caching strategies
- Minimize bundle size
- Implement proper loading states

## Testing Strategy

- Unit tests for utility functions
- Component testing for UI elements
- Integration tests for API calls
- End-to-end testing for critical flows

When working on this project:
1. Always consider the Telegram Web App context
2. Implement proper TypeScript types
3. Follow the established patterns
4. Consider mobile-first design
5. Implement proper error handling
6. Use the existing state management patterns
7. Follow the component structure guidelines
