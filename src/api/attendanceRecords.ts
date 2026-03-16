import { apiClient } from './client'
import type { ApiResponse, AttendanceStatisticsDto, AttendanceRecordDto } from '@/types/api'
import { parsePaginationHeader, DEFAULT_PAGE_SIZE } from '@/utils/pagination'

export interface GetAttendanceStatisticsParams {
  projectId?: string
  locationNodeId?: string
  fromDate?: string
  toDate?: string
}

export async function getAttendanceStatisticsApi(
  params?: GetAttendanceStatisticsParams,
): Promise<AttendanceStatisticsDto | null> {
  const { data: body } = await apiClient.get<ApiResponse<AttendanceStatisticsDto>>(
    '/api/attendance/statistics',
    { params },
  )
  return body.succeeded ? body.data : null
}

export async function getAttendanceCurrentUserApi(params: {
  fromDate?: string
  toDate?: string
  pageSize?: number
}): Promise<AttendanceRecordDto[]> {
  const response = await apiClient.get<ApiResponse<AttendanceRecordDto[]>>(
    '/api/attendance/records/current-user',
    { params: { pageSize: params.pageSize ?? DEFAULT_PAGE_SIZE, ...params } },
  )
  const body = response.data
  return body.succeeded && body.data ? body.data : []
}
