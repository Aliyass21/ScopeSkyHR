import { useTranslation } from 'react-i18next'
import { Users, UserCheck, CalendarOff, Briefcase } from 'lucide-react'
import { StatCard } from '@/components/shared/StatCard'
import type { KpiStats } from '@/types/dashboard'

interface StatsRowProps {
  stats: KpiStats
}

export const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  const { t } = useTranslation()

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title={t('dashboard.totalEmployees')}
        value={stats.totalEmployees}
        icon={<Users size={24} />}
        iconClassName="bg-indigo-100 text-indigo-600"
        trend={{ value: 9, label: t('dashboard.months.mar') }}
      />
      <StatCard
        title={t('dashboard.presentToday')}
        value={stats.presentToday}
        icon={<UserCheck size={24} />}
        iconClassName="bg-green-100 text-green-600"
      />
      <StatCard
        title={t('dashboard.onLeave')}
        value={stats.onLeave}
        icon={<CalendarOff size={24} />}
        iconClassName="bg-orange-100 text-orange-600"
      />
      <StatCard
        title={t('dashboard.openPositions')}
        value={stats.openPositions}
        icon={<Briefcase size={24} />}
        iconClassName="bg-teal-100 text-teal-600"
      />
    </div>
  )
}
