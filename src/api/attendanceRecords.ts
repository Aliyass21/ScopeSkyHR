import { apiClient } from './client'
import type { ApiResponse, AttendanceStatisticsDto } from '@/types/api'

export async function getAttendanceStatisticsApi(): Promise<AttendanceStatisticsDto | null> {
  const { data: body } = await apiClient.get<ApiResponse<AttendanceStatisticsDto>>(
    '/api/attendance/statistics'
  )
  return body.succeeded ? body.data : null
}
