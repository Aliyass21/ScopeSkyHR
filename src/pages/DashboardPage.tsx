import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Clock, CalendarDays, ArrowRight } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { HeadcountChart } from '@/components/dashboard/HeadcountChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner'
import { LocationChart } from '@/components/dashboard/LocationChart'
import { AttendanceRing } from '@/components/dashboard/AttendanceRing'
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents'
import { DashboardFilters } from '@/components/dashboard/DashboardFilters'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { getDashboardData } from '@/api/dashboard'
import { useDashboardStats } from '@/hooks/useDashboardStats'
import type { DashboardFilters as Filters } from '@/hooks/useDashboardStats'
import type { DashboardData } from '@/types/dashboard'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Supplemental mock data (headcount chart, activity feed, upcoming events)
  const [mockData, setMockData] = useState<DashboardData | null>(null)
  const [mockLoading, setMockLoading] = useState(true)

  // Filterable real stats
  const [filters, setFilters] = useState<Filters>({})
  const { kpiStats, attendanceToday, profileStats, isLoading: statsLoading } =
    useDashboardStats(filters)

  useEffect(() => {
    getDashboardData()
      .then(setMockData)
      .finally(() => setMockLoading(false))
  }, [])

  const loading = statsLoading && mockLoading

  const attendanceRate =
    attendanceToday && attendanceToday.total > 0
      ? Math.round((attendanceToday.present / attendanceToday.total) * 100)
      : 0

  return (
    <PageWrapper title={t('dashboard.title')}>
      {loading ? (
        <LoadingSkeleton type="card" />
      ) : (
        <div className="space-y-6">
          {/* Welcome banner */}
          <WelcomeBanner
            attendanceRate={attendanceRate}
            presentToday={kpiStats?.presentToday ?? 0}
            totalEmployees={kpiStats?.totalEmployees ?? 0}
          />

          {/* Filter bar */}
          <DashboardFilters filters={filters} onChange={setFilters} />

          {/* KPI stats */}
          {kpiStats && <StatsRow stats={kpiStats} />}
          {!kpiStats && statsLoading && <LoadingSkeleton type="card" />}

          {/* Headcount trend + Activity feed */}
          {mockData && (
            <div className="grid gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <HeadcountChart data={mockData.headcountTrend} />
              </div>
              <div className="lg:col-span-2">
                <ActivityFeed items={mockData.recentActivity} />
              </div>
            </div>
          )}

          {/* Location chart + Attendance ring + Upcoming events */}
          <div className="grid gap-6 lg:grid-cols-3">
            {profileStats ? (
              <LocationChart profileStats={profileStats} />
            ) : (
              mockData && <LocationChart profileStats={{
                totalProfiles: 0, activeProfiles: 0, inactiveProfiles: 0,
                terminatedProfiles: 0, byProfileType: {}, byLocation: [], byPosition: [], recentHires: 0,
              }} />
            )}
            {attendanceToday ? (
              <AttendanceRing data={attendanceToday} />
            ) : (
              mockData && <AttendanceRing data={mockData.attendanceToday} />
            )}
            {mockData && (
              <UpcomingEvents
                events={mockData.upcomingEvents}
                pendingLeaves={mockData.leaveOverview.pendingApprovals}
              />
            )}
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
                onClick={() => navigate('/leave')
              }
              />
            </div>
          </div>
        </div>
      )}
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
