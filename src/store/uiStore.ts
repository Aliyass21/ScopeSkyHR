import { create } from 'zustand'
import i18n from '@/i18n'

export type AppTheme = 'default' | 'dark' | 'light-green' | 'dark-green'

interface UiState {
  sidebarCollapsed: boolean
  language: 'ar' | 'en'
  theme: AppTheme
  isAuthenticated: boolean
  toggleSidebar: () => void
  setSidebarCollapsed: (v: boolean) => void
  setLanguage: (lang: 'ar' | 'en') => void
  setTheme: (theme: AppTheme) => void
  login: () => void
  logout: () => void
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
  isAuthenticated: sessionStorage.getItem('corehr_auth') === '1',
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
  login: () => {
    sessionStorage.setItem('corehr_auth', '1')
    set({ isAuthenticated: true })
  },
  logout: () => {
    sessionStorage.removeItem('corehr_auth')
    set({ isAuthenticated: false })
  },
}))
