'use client'

import { ReactNode, useEffect } from 'react'
import { useTelegramWebApp } from '@/hooks/use-telegram-webapp'

interface TelegramProviderProps {
  children: ReactNode
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const { webApp, themeParams } = useTelegramWebApp()

  useEffect(() => {
    if (webApp) {
      // Apply Telegram theme colors to CSS variables
      const root = document.documentElement
      
      if (themeParams.bg_color) {
        root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color)
      }
      if (themeParams.text_color) {
        root.style.setProperty('--tg-theme-text-color', themeParams.text_color)
      }
      if (themeParams.hint_color) {
        root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color)
      }
      if (themeParams.link_color) {
        root.style.setProperty('--tg-theme-link-color', themeParams.link_color)
      }
      if (themeParams.button_color) {
        root.style.setProperty('--tg-theme-button-color', themeParams.button_color)
      }
      if (themeParams.button_text_color) {
        root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color)
      }
      if (themeParams.secondary_bg_color) {
        root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color)
      }
    }
  }, [webApp, themeParams])

  return <>{children}</>
}
