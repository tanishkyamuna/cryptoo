# CryptoQuiver Telegram Mini App - Deployment Guide

## Vercel Deployment Setup

### 1. Environment Variables
In your Vercel dashboard, add these environment variables:

```
NODE_ENV=production
TELEGRAM_BOT_TOKEN=your_bot_token (optional for development)
```

### 2. Telegram Bot Setup
1. Create a new bot with @BotFather
2. Get your bot token
3. Set the Mini App URL to your Vercel deployment URL
4. Use this command with BotFather:
   ```
   /setmenubutton
   @your_bot_username
   CryptoQuiver
   https://your-app-name.vercel.app
   ```

### 3. Domain Configuration
Your Telegram Mini App URL should be:
`https://your-app-name.vercel.app`

### 4. Testing
1. Open your bot in Telegram
2. Click the menu button or type /start
3. The mini app should open within Telegram

### 5. Troubleshooting

#### If you see Vercel login page:
- Check that your repository is public or properly connected
- Verify the deployment completed successfully
- Ensure the domain is accessible without authentication

#### If the app doesn't load in Telegram:
- Check the CSP headers are properly set
- Verify the X-Frame-Options allows embedding
- Test the URL directly in a browser first

#### Common Issues:
1. **CORS/Frame Issues**: Fixed by headers in next.config.js
2. **Authentication Loop**: Make sure no auth redirects on the main page
3. **API Errors**: The app works without external APIs using mock data

### 6. Security Headers
The app includes these headers for Telegram compatibility:
- X-Frame-Options: ALLOWALL
- CSP: frame-ancestors for Telegram domains
- No authentication required for main functionality
