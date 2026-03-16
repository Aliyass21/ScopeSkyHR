import { apiClient } from './client'
import type { ApiResponse, EmployeeLeaveBalanceDto } from '@/types/api'

export async function getLeaveBalancesApi(profileId?: string): Promise<EmployeeLeaveBalanceDto[]> {
  const { data: body } = await apiClient.get<ApiResponse<EmployeeLeaveBalanceDto[]>>(
    '/api/employee/leave-balances',
    { params: { profileId, pageSize: 100 } },
  )
  return body.succeeded && body.data ? body.data : []
}
