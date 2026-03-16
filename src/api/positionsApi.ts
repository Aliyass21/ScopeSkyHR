import { apiClient } from './client'
import type { ApiResponse, PositionDto } from '@/types/api'

export async function getPositionsApi(): Promise<PositionDto[]> {
  const { data: body } = await apiClient.get<ApiResponse<PositionDto[]>>('/api/positions', {
    params: { pageSize: 100 },
  })
  return body.succeeded && body.data ? body.data : []
}
