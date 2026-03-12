import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Clock, CalendarDays } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { StatsRow } from '@/components/dashboard/StatsRow'
import { HeadcountChart } from '@/components/dashboard/HeadcountChart'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { getDashboardData } from '@/api/dashboard'
import type { DashboardData } from '@/types/dashboard'

export default function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getDashboardData()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  return (
    <PageWrapper title={t('dashboard.title')}>
      {loading ? (
        <LoadingSkeleton type="card" />
      ) : data ? (
        <div className="space-y-6">
          <StatsRow stats={data.stats} />

          <div className="grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <HeadcountChart data={data.headcountTrend} />
            </div>
            <div className="lg:col-span-2">
              <ActivityFeed items={data.recentActivity} />
            </div>
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => navigate('/employees')} variant="outline" size="sm">
              <UserPlus size={16} />
              {t('dashboard.addEmployee')}
            </Button>
            <Button onClick={() => navigate('/attendance')} variant="outline" size="sm">
              <Clock size={16} />
              {t('dashboard.viewAttendance')}
            </Button>
            <Button onClick={() => navigate('/leave')} variant="outline" size="sm">
              <CalendarDays size={16} />
              {t('dashboard.newLeaveRequest')}
            </Button>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  )
}
