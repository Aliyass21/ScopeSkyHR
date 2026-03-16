import { apiClient } from './client'
import type { ApiResponse, LoginRequest, TokenResponse, CreateUserWithProfileDto, ProfileDto } from '@/types/api'

// NOTE: /api/auth/login returns TokenResponse directly (no ApiResponse wrapper).
export async function loginApi(request: LoginRequest): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>(
    '/api/auth/login',
    request
  )
  return data
}

export async function refreshTokenApi(
  refreshToken: string
): Promise<ApiResponse<TokenResponse>> {
  const { data } = await apiClient.post<ApiResponse<TokenResponse>>(
    '/api/auth/refresh-token',
    { refreshToken }
  )
  return data
}

export async function revokeTokenApi(refreshToken: string | null): Promise<void> {
  await apiClient.post('/api/auth/revoke-token', {
    refreshToken,
    revokeAll: false,
    reason: null,
  })
}

export async function createUserApi(
  body: CreateUserWithProfileDto,
): Promise<{ userId: string; profile: ProfileDto } | null> {
  const { data: res } = await apiClient.post<
    ApiResponse<{ userId: string; profile: ProfileDto }>
  >('/api/auth/create-user', body)
  return res.succeeded ? res.data : null
}
