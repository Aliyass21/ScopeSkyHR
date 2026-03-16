import { apiClient } from './client'
import type { ApiResponse, LeaveTypeDto } from '@/types/api'

export async function getLeaveTypesApi(): Promise<LeaveTypeDto[]> {
  const { data: body } = await apiClient.get<ApiResponse<LeaveTypeDto[]>>('/api/leave/types', {
    params: { pageSize: 100, isActive: true },
  })
  return body.succeeded && body.data ? body.data : []
}
