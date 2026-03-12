import { mockDelay } from '@/utils/mockDelay'
import rawData from '@/data/dashboard.json'
import type { DashboardData } from '@/types/dashboard'

const data = rawData as DashboardData

export async function getDashboardData(): Promise<DashboardData> {
  await mockDelay()
  return { ...data }
}
