export interface KpiStats {
  totalEmployees: number
  presentToday: number
  onLeave: number
  openPositions: number
}

export interface HeadcountDataPoint {
  month: string
  count: number
}

export interface ActivityItem {
  id: string
  type: 'hire' | 'leave' | 'attendance' | 'promotion' | 'resignation'
  employeeId: string
  employeeName: string
  descriptionAr: string
  descriptionEn: string
  timestamp: string
}

export interface DashboardData {
  stats: KpiStats
  headcountTrend: HeadcountDataPoint[]
  recentActivity: ActivityItem[]
}
