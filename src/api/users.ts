import { apiClient } from './client'
import type { ApiResponse, UserDto, UserWithProfile, ProfileStatisticsDto } from '@/types/api'
import { parsePaginationHeader, DEFAULT_PAGE_SIZE } from '@/utils/pagination'
import type { PaginationMeta } from '@/types/api'

export interface GetUsersParams {
  pageNumber?: number
  pageSize?: number
  q?: string
  isActive?: boolean
}

export interface GetUsersResult {
  users: UserDto[]
  pagination: PaginationMeta
}

export async function getUsersApi(params: GetUsersParams = {}): Promise<GetUsersResult> {
  const response = await apiClient.get<ApiResponse<UserDto[]>>('/api/users', {
    params: { pageSize: DEFAULT_PAGE_SIZE, ...params },
  })
  const body = response.data
  const pagination = parsePaginationHeader(response.headers as Record<string, unknown>) ?? {
    currentPage: 1,
    totalPages: 1,
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    totalCount: 0,
  }
  if (body.succeeded && body.data) {
    return { users: body.data, pagination }
  }
  return { users: [], pagination }
}

export async function getUserApi(id: string): Promise<UserWithProfile | null> {
  const { data: body } = await apiClient.get<ApiResponse<UserWithProfile>>(`/api/users/${id}`)
  return body.succeeded ? body.data : null
}

export async function deleteUserApi(id: string): Promise<void> {
  await apiClient.delete(`/api/users/${id}`)
}

export async function getUserStatisticsApi(): Promise<ProfileStatisticsDto | null> {
  const { data: body } = await apiClient.get<ApiResponse<ProfileStatisticsDto>>(
    '/api/users/statistics'
  )
  return body.succeeded ? body.data : null
}
