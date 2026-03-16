import { apiClient } from './client'
import type { ApiResponse, LocationNodeMinimalDto } from '@/types/api'

export interface GetLocationNodesParams {
  projectId?: string
  level?: number
  parentId?: string
  nodeType?: string
  includeInactive?: boolean
}

export async function getLocationNodesMinimalApi(
  params: GetLocationNodesParams = {},
): Promise<LocationNodeMinimalDto[]> {
  const { data: body } = await apiClient.get<ApiResponse<LocationNodeMinimalDto[]>>(
    '/api/locationnodes/minimal',
    { params },
  )
  return body.succeeded && body.data ? body.data : []
}
