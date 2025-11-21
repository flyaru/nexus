import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeMode } from '../types'
import i18n from '../i18n'

type ThemeContextValue = {
  mode: ThemeMode
  setMode: (mode: ThemeMode) => void
  language: 'en' | 'ar'
  setLanguage: (lng: 'en' | 'ar') => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const THEME_KEY = 'nexus-theme-mode'
const LANG_KEY = 'nexus-language'

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setModeState] = useState<ThemeMode>(() => (localStorage.getItem(THEME_KEY) as ThemeMode) || 'light')
  const [language, setLanguageState] = useState<'en' | 'ar'>(() => (localStorage.getItem(LANG_KEY) as 'en' | 'ar') || 'en')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode)
    localStorage.setItem(THEME_KEY, mode)
  }, [mode])

  useEffect(() => {
    i18n.changeLanguage(language)
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr'
    localStorage.setItem(LANG_KEY, language)
  }, [language])

  return (
    <ThemeContext.Provider value={{ mode, setMode: setModeState, language, setLanguage: setLanguageState }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
