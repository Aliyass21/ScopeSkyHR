import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Clock, CalendarDays, ArrowRight } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { HeadcountChart } from '@/components/dashboard/HeadcountChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { DepartmentChart } from '@/components/dashboard/DepartmentChart'
import { AttendanceRing } from '@/components/dashboard/AttendanceRing'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { getDashboardData } from '@/api/dashboard'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import type { DashboardData } from '@/types/dashboard'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [mockData, setMockData] = useState<DashboardData | null>(null)
  const [mockLoading, setMockLoading] = useState(true)

  // Real API: KPI stats + attendance summary
  const { kpiStats, attendanceToday: realAttendance, isLoading: statsLoading } =
    useDashboardStats()

  useEffect(() => {
    getDashboardData()
      .then(setMockData)
      .finally(() => setMockLoading(false))
  }, [])

  // Show skeleton until at least the mock shell is ready
  const loading = mockLoading && statsLoading

  // Prefer real stats; fall back to mock while API loads
  const stats = kpiStats ?? mockData?.stats
  const attendanceTodayData = realAttendance ?? mockData?.attendanceToday

  const attendanceRate = attendanceTodayData
    ? Math.round((attendanceTodayData.present / Math.max(attendanceTodayData.total, 1)) * 100)
    : 0

  return (
    <PageWrapper title={t('dashboard.title')}>
      {loading ? (
        <LoadingSkeleton type="card" />
      ) : mockData ? (
        <div className="space-y-6">
          {/* Welcome banner */}
          <WelcomeBanner
            attendanceRate={attendanceRate}
            presentToday={stats?.presentToday ?? 0}
            totalEmployees={stats?.totalEmployees ?? 0}
          />

          {/* KPI stats */}
          {stats && <StatsRow stats={stats} />}

          {/* Headcount trend + Activity feed */}
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <HeadcountChart data={mockData.headcountTrend} />
            </div>
            <div className="lg:col-span-2">
              <ActivityFeed items={mockData.recentActivity} />
            </div>
          </div>

          {/* Department donut + Attendance ring + Upcoming events */}
          <div className="grid gap-6 lg:grid-cols-3">
            <DepartmentChart data={mockData.departmentDistribution} />
            <AttendanceRing data={attendanceTodayData ?? mockData.attendanceToday} />
            <UpcomingEvents
              events={mockData.upcomingEvents}
              pendingLeaves={mockData.leaveOverview.pendingApprovals}
            />
          </div>

          {/* Quick actions */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t('dashboard.quickActions')}
            </h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <QuickActionCard
                icon={<UserPlus size={18} />}
                iconClass="bg-indigo-100 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white"
                title={t('dashboard.addEmployee')}
                desc={t('dashboard.addEmployeeDesc')}
                onClick={() => navigate('/employees')}
              />
              <QuickActionCard
                icon={<Clock size={18} />}
                iconClass="bg-teal-100 text-teal-600 group-hover:bg-teal-600 group-hover:text-white"
                title={t('dashboard.viewAttendance')}
                desc={t('dashboard.viewAttendanceDesc')}
                onClick={() => navigate('/attendance')}
              />
              <QuickActionCard
                icon={<CalendarDays size={18} />}
                iconClass="bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                title={t('dashboard.newLeaveRequest')}
                desc={t('dashboard.newLeaveRequestDesc')}
                onClick={() => navigate('/leave')}
              />
            </div>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  )
}

interface QuickActionCardProps {
  icon: React.ReactNode
  iconClass: string
  title: string
  desc: string
  onClick: () => void
}

function QuickActionCard({ icon, iconClass, title, desc, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border bg-card p-4 text-start transition hover:border-primary/30 hover:shadow-sm"
    >
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition ${iconClass}`}
      >
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
      <ArrowRight
        size={15}
        className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 rtl:rotate-180"
      />
    </button>
  )
}
