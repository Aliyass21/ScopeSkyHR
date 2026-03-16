import { apiClient } from './client'
import type { ApiResponse, AttendanceStatisticsDto, AttendanceRecordDto } from '@/types/api'
import { parsePaginationHeader, DEFAULT_PAGE_SIZE } from '@/utils/pagination'

export async function getAttendanceStatisticsApi(): Promise<AttendanceStatisticsDto | null> {
  const { data: body } = await apiClient.get<ApiResponse<AttendanceStatisticsDto>>(
    '/api/attendance/statistics'
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
