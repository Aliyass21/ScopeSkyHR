import { useTranslation } from 'react-i18next'
import { formatDistanceToNow } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'
import { UserPlus, CalendarDays, Clock, TrendingUp, UserMinus } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUiStore } from '@/store/uiStore'
import type { ActivityItem } from '@/types/dashboard'

interface ActivityFeedProps {
  items: ActivityItem[]
}

const iconMap: Record<ActivityItem['type'], React.ReactNode> = {
  hire: <UserPlus size={16} />,
  leave: <CalendarDays size={16} />,
  attendance: <Clock size={16} />,
  promotion: <TrendingUp size={16} />,
  resignation: <UserMinus size={16} />,
}

const colorMap: Record<ActivityItem['type'], string> = {
  hire: 'bg-green-100 text-green-600',
  leave: 'bg-orange-100 text-orange-600',
  attendance: 'bg-blue-100 text-blue-600',
  promotion: 'bg-purple-100 text-purple-600',
  resignation: 'bg-red-100 text-red-600',
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('dashboard.recentActivity')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorMap[item.type]}`}
            >
              {iconMap[item.type]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{item.employeeName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {language === 'ar' ? item.descriptionAr : item.descriptionEn}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(item.timestamp), {
                addSuffix: true,
                locale: language === 'ar' ? arSA : enUS,
              })}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
