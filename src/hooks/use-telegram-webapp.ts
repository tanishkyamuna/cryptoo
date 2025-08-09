'use client'

import { useState, useEffect, useCallback } from 'react'
import { TelegramWebApp, TelegramUser } from '@/types'

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export const useTelegramWebApp = () => {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setWebApp(tg)
      
      // Get user data from initDataUnsafe
      if (tg.initDataUnsafe?.user) {
        setUser(tg.initDataUnsafe.user)
      } else {
        // Fallback for development - create a mock user
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: 'Dev User',
          last_name: 'Test',
          username: 'devuser',
          language_code: 'en',
          is_premium: false
        }
        setUser(mockUser)
      }
      
      setIsReady(true)
    } else {
      // Fallback for development environment
      setTimeout(() => {
        const mockUser: TelegramUser = {
          id: 123456789,
          first_name: 'Dev User',
          last_name: 'Test',
          username: 'devuser',
          language_code: 'en',
          is_premium: false
        }
        setUser(mockUser)
        setIsReady(true)
      }, 1000)
    }
  }, [])

  const showMainButton = useCallback((text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text)
      webApp.MainButton.onClick(onClick)
      webApp.MainButton.show()
    }
  }, [webApp])

  const hideMainButton = useCallback(() => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide()
    }
  }, [webApp])

  const showBackButton = useCallback((onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick)
      webApp.BackButton.show()
    }
  }, [webApp])

  const hideBackButton = useCallback(() => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide()
    }
  }, [webApp])

  const hapticFeedback = useCallback((type: 'impact' | 'notification' | 'selection', style?: any) => {
    if (webApp?.hapticFeedback) {
      switch (type) {
        case 'impact':
          webApp.hapticFeedback.impactOccurred(style || 'medium')
          break
        case 'notification':
          webApp.hapticFeedback.notificationOccurred(style || 'success')
          break
        case 'selection':
          webApp.hapticFeedback.selectionChanged()
          break
      }
    }
  }, [webApp])

  const showAlert = useCallback((message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  }, [webApp])

  const showConfirm = useCallback(async (message: string): Promise<boolean> => {
    if (webApp?.showConfirm) {
      return await webApp.showConfirm(message)
    } else {
      return confirm(message)
    }
  }, [webApp])

  const closeApp = useCallback(() => {
    if (webApp?.close) {
      webApp.close()
    }
  }, [webApp])

  return {
    webApp,
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    closeApp,
    themeParams: webApp?.themeParams || {},
    colorScheme: webApp?.colorScheme || 'light',
    viewportHeight: webApp?.viewportHeight || (typeof window !== 'undefined' ? window.innerHeight : 600),
    isExpanded: webApp?.isExpanded || false
  }
}
