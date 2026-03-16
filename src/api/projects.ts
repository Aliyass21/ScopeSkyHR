import { apiClient } from './client'
import type { ApiResponse, ProjectLookupDto } from '@/types/api'

export async function getProjectsLookupApi(): Promise<ProjectLookupDto[]> {
  const { data: body } = await apiClient.get<ApiResponse<ProjectLookupDto[]>>(
    '/api/projects/lookup',
  )
  return body.succeeded && body.data ? body.data : []
}
