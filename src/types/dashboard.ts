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

export interface DepartmentDataPoint {
  dept: string
  count: number
  nameAr: string
  nameEn: string
}

export interface AttendanceTodayData {
  present: number
  onLeave: number
  absent: number
  total: number
}

export interface LeaveOverviewData {
  pendingApprovals: number
  approvedThisMonth: number
  totalOnLeave: number
}

export interface UpcomingEvent {
  id: string
  type: 'birthday' | 'anniversary'
  nameAr: string
  nameEn: string
  date: string
  years?: number
}

export interface DashboardData {
  stats: KpiStats
  headcountTrend: HeadcountDataPoint[]
  recentActivity: ActivityItem[]
  departmentDistribution: DepartmentDataPoint[]
  attendanceToday: AttendanceTodayData
  leaveOverview: LeaveOverviewData
  upcomingEvents: UpcomingEvent[]
}
