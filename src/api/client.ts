import axios from 'axios'
import type { ApiResponse, TokenResponse } from '@/types/api'
import { useAuthStore } from '@/store/authStore'
import { useUiStore } from '@/store/uiStore'

// ── PascalCase → camelCase (handles .NET/Newtonsoft.Json responses) ───────────
function toCamelKey(key: string): string {
  return key.charAt(0).toLowerCase() + key.slice(1)
}

function deepCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(deepCamelCase)
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        toCamelKey(k),
        deepCamelCase(v),
      ])
    )
  }
  return value
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'X-App-Platform': 'web',
  },
  transformResponse: [
    (data: string) => {
      try {
        return deepCamelCase(JSON.parse(data))
      } catch {
        return data
      }
    },
  ],
})

// ── Request interceptor: attach Bearer token ──────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Refresh-token queue (prevents concurrent refresh storms) ──────────────────
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

function drainQueue(token: string) {
  refreshQueue.forEach((resolve) => resolve(token))
  refreshQueue = []
}

function flushQueueWithError() {
  refreshQueue = []
}

// ── Response interceptor: handle 401 with silent token refresh ────────────────
apiClient.interceptors.response.use(
  (res) => res,
  async (error: import('axios').AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      const { refreshToken, setAuth, clearAuth } = useAuthStore.getState()

      if (!refreshToken) {
        clearAuth()
        useUiStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      // If a refresh is already in-flight, queue this request
      if (isRefreshing) {
        return new Promise<string>((resolve) => {
          refreshQueue.push(resolve)
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return apiClient(originalRequest)
        })
      }

      isRefreshing = true

      try {
        const res = await axios.post<ApiResponse<TokenResponse>>(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh-token`,
          { refreshToken },
          {
            headers: { 'X-App-Platform': 'web' },
            transformResponse: [
              (data: string) => {
                try { return deepCamelCase(JSON.parse(data)) } catch { return data }
              },
            ],
          }
        )

        if (res.data.succeeded && res.data.data) {
          setAuth(res.data.data)
          drainQueue(res.data.data.accessToken)
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${res.data.data.accessToken}`
          }
          return apiClient(originalRequest)
        }

        // succeeded: false — refresh rejected by server
        clearAuth()
        useUiStore.getState().logout()
        flushQueueWithError()
        window.location.href = '/login'
        return Promise.reject(error)
      } catch {
        clearAuth()
        useUiStore.getState().logout()
        flushQueueWithError()
        window.location.href = '/login'
        return Promise.reject(error)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)
