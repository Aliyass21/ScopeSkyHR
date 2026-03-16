import { useQuery } from '@tanstack/react-query'
import { getUserStatisticsApi } from '@/api/users'
import { getAttendanceStatisticsApi } from '@/api/attendanceRecords'
import { useAuthStore } from '@/store/authStore'
import type { KpiStats, AttendanceTodayData } from '@/types/dashboard'
import type { ProfileStatisticsDto } from '@/types/api'

export interface DashboardFilters {
  profileType?: string
  positionId?: string
  locationNodeId?: string
  projectId?: string   // explicit override (super-admin)
}

function today(): string {
  return new Date().toISOString().split('T')[0]
}

/** Safe number: returns 0 for null/undefined/NaN */
function n(v: number | null | undefined): number {
  return typeof v === 'number' && !isNaN(v) ? v : 0
}

/** After deepCamelCase, byStatus keys are lowercased. Try both cases. */
function byStatusVal(
  byStatus: Record<string, number> | undefined,
  key: string,
): number {
  if (!byStatus) return 0
  return n(byStatus[key] ?? byStatus[key.charAt(0).toUpperCase() + key.slice(1)])
}

export function useDashboardStats(filters: DashboardFilters = {}) {
  const user = useAuthStore((s) => s.user)
  // Auto-inject the user's first project unless caller overrides
  const projectId = filters.projectId ?? user?.projectAccesses?.[0]?.projectId

  const profileQuery = useQuery({
    queryKey: ['dashboard', 'profileStats', { ...filters, projectId }],
    queryFn: () =>
      getUserStatisticsApi({
        projectId,
        profileType: filters.profileType,
        positionId: filters.positionId,
        locationNodeId: filters.locationNodeId,
      }),
    staleTime: 60_000,
  })

  const todayStr = today()
  const attendanceQuery = useQuery({
    queryKey: ['dashboard', 'attendanceStats', { projectId, todayStr }],
    queryFn: () =>
      getAttendanceStatisticsApi({
        projectId,
        fromDate: todayStr,
        toDate: todayStr,
      }),
    staleTime: 60_000,
  })

  const isLoading = profileQuery.isLoading || attendanceQuery.isLoading
  const profileStats: ProfileStatisticsDto | null = profileQuery.data ?? null

  // deepCamelCase lowercases byStatus keys: 'Leave' → 'leave', 'Present' → 'present'
  const byStatus = attendanceQuery.data?.byStatus as Record<string, number> | undefined
  const presentCount = n(attendanceQuery.data?.presentCount)
  const absentCount = n(attendanceQuery.data?.absentCount)
  const leaveCount = byStatusVal(byStatus, 'leave')

  // Use actual working-day denominator (present + absent + leave), not totalRecords
  const attendanceTotal = presentCount + absentCount + leaveCount

  const kpiStats: KpiStats | null =
    profileStats && attendanceQuery.data
      ? {
          totalEmployees: n(profileStats.totalProfiles),
          activeEmployees: n(profileStats.activeProfiles),
          presentToday: presentCount,
          onLeave: leaveCount,
        }
      : null

  const attendanceToday: AttendanceTodayData | null = attendanceQuery.data
    ? {
        present: presentCount,
        onLeave: leaveCount,
        absent: absentCount,
        total: attendanceTotal > 0 ? attendanceTotal : n(attendanceQuery.data?.totalRecords),
      }
    : null

  return { kpiStats, attendanceToday, profileStats, isLoading }
}
