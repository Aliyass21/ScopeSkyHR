import { apiClient } from './client'
import type { ApiResponse, LeaveRequestDto, CreateLeaveRequestDto, PaginationMeta } from '@/types/api'
import { parsePaginationHeader, DEFAULT_PAGE_SIZE } from '@/utils/pagination'

export interface GetLeaveRequestsParams {
  pageNumber?: number
  pageSize?: number
  profileId?: string
  status?: string
}

export interface GetLeaveRequestsResult {
  requests: LeaveRequestDto[]
  pagination: PaginationMeta
}

export async function getLeaveRequestsApi(
  params: GetLeaveRequestsParams = {},
): Promise<GetLeaveRequestsResult> {
  const response = await apiClient.get<ApiResponse<LeaveRequestDto[]>>('/api/leave/requests', {
    params: { pageSize: DEFAULT_PAGE_SIZE, ...params },
  })
  const body = response.data
  const pagination = parsePaginationHeader(response.headers as Record<string, unknown>) ?? {
    currentPage: 1,
    totalPages: 1,
    pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE,
    totalCount: 0,
  }
  return {
    requests: body.succeeded && body.data ? body.data : [],
    pagination,
  }
}

export async function createLeaveRequestApi(
  body: CreateLeaveRequestDto,
): Promise<LeaveRequestDto | null> {
  const { data: res } = await apiClient.post<ApiResponse<LeaveRequestDto>>(
    '/api/leave/requests',
    body,
  )
  return res.succeeded ? res.data : null
}

export async function approveLeaveRequestApi(id: string): Promise<LeaveRequestDto | null> {
  const { data: res } = await apiClient.put<ApiResponse<LeaveRequestDto>>(
    `/api/leave/requests/${id}/approve`,
  )
  return res.succeeded ? res.data : null
}

export async function rejectLeaveRequestApi(id: string): Promise<LeaveRequestDto | null> {
  const { data: res } = await apiClient.put<ApiResponse<LeaveRequestDto>>(
    `/api/leave/requests/${id}/reject`,
  )
  return res.succeeded ? res.data : null
}

export async function cancelLeaveRequestApi(id: string): Promise<LeaveRequestDto | null> {
  const { data: res } = await apiClient.put<ApiResponse<LeaveRequestDto>>(
    `/api/leave/requests/${id}/cancel`,
  )
  return res.succeeded ? res.data : null
}
