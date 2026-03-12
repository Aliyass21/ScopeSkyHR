import { create } from 'zustand'
import i18n from '@/i18n'

export type AppTheme = 'default' | 'dark' | 'light-green' | 'dark-green'

interface UiState {
  sidebarCollapsed: boolean
  language: 'ar' | 'en'
  theme: AppTheme
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  setLanguage: (lang: 'ar' | 'en') => void
  setTheme: (theme: AppTheme) => void
}

function applyTheme(theme: AppTheme) {
  const html = document.documentElement
  // dark class drives Tailwind's dark: utilities
  html.classList.toggle('dark', theme === 'dark' || theme === 'dark-green')
  // data-theme drives our CSS variable overrides
  html.setAttribute('data-theme', theme)
}

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  language: 'ar',
  theme: 'default',
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  setLanguage: (lang) => {
    i18n.changeLanguage(lang)
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    set({ language: lang })
  },
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))
