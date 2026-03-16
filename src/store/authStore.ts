import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TokenResponse, UserWithProfile } from '@/types/api'

const STORAGE_KEY = 'corehr_auth_v1'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: UserWithProfile | null
  setAuth: (tokenResponse: TokenResponse) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      setAuth: (tokenResponse) =>
        set({
          accessToken: tokenResponse.accessToken,
          refreshToken: tokenResponse.refreshToken,
          user: tokenResponse.user,
        }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        }),
    }),
    { name: STORAGE_KEY }
  )
)

/** Read the persisted access token synchronously (used during store init). */
export function getPersistedAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { state?: { accessToken?: string | null } }
    return parsed?.state?.accessToken ?? null
  } catch {
    return null
  }
}
