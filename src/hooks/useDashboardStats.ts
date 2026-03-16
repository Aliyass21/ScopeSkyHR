import { useQuery } from '@tanstack/react-query'
import { getUserStatisticsApi } from '@/api/users'
import { getAttendanceStatisticsApi } from '@/api/attendanceRecords'
import type { KpiStats, AttendanceTodayData } from '@/types/dashboard'

export function useDashboardStats() {
  const profileQuery = useQuery({
    queryKey: ['dashboard', 'profileStats'],
    queryFn: getUserStatisticsApi,
    staleTime: 60_000,
  })

  const attendanceQuery = useQuery({
    queryKey: ['dashboard', 'attendanceStats'],
    queryFn: getAttendanceStatisticsApi,
    staleTime: 60_000,
  })

  const isLoading = profileQuery.isLoading || attendanceQuery.isLoading

  const kpiStats: KpiStats | null =
    profileQuery.data && attendanceQuery.data
      ? {
          totalEmployees: profileQuery.data.totalProfiles,
          presentToday: attendanceQuery.data.presentCount,
          onLeave: attendanceQuery.data.byStatus?.Leave ?? 0,
          openPositions: 0, // no dedicated endpoint
        }
      : null

  const attendanceToday: AttendanceTodayData | null = attendanceQuery.data
    ? {
        present: attendanceQuery.data.presentCount,
        onLeave: attendanceQuery.data.byStatus?.Leave ?? 0,
        absent: attendanceQuery.data.absentCount,
        total: attendanceQuery.data.totalRecords,
      }
    : null

  return { kpiStats, attendanceToday, isLoading }
}
