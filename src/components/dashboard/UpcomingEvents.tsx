import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { format, differenceInDays } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'
import { Cake, Star, CalendarClock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUiStore } from '@/store/uiStore'
import type { UpcomingEvent } from '@/types/dashboard'

interface UpcomingEventsProps {
  events: UpcomingEvent[]
  pendingLeaves: number
}

export const UpcomingEvents: React.FC<UpcomingEventsProps> = ({ events, pendingLeaves }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const navigate = useNavigate()

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{t('dashboard.upcomingEvents')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-3">
        {/* pending leave alert */}
        {pendingLeaves > 0 && (
          <button
            onClick={() => navigate('/leave')}
            className="group flex w-full items-center gap-3 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-2.5 text-start transition hover:border-orange-500/40 hover:bg-orange-500/15"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
              <CalendarClock size={15} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-700 dark:text-orange-400">
                {pendingLeaves} {t('dashboard.pendingLeaveApprovals')}
              </p>
              <p className="text-xs text-muted-foreground">{t('dashboard.requiresAction')}</p>
            </div>
            <ChevronRight size={14} className="shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 rtl:rotate-180" />
          </button>
        )}

        {/* events list */}
        {events.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t('dashboard.noUpcomingEvents')}
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((ev) => {
              const evDate = new Date(ev.date)
              const daysUntil = differenceInDays(evDate, new Date())
              const dateStr = format(evDate, 'd MMM', {
                locale: language === 'ar' ? arSA : enUS,
              })
              const name = language === 'ar' ? ev.nameAr : ev.nameEn
              const isBirthday = ev.type === 'birthday'

              return (
                <div key={ev.id} className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isBirthday
                        ? 'bg-pink-100 text-pink-600'
                        : 'bg-indigo-100 text-indigo-600'
                    }`}
                  >
                    {isBirthday ? <Cake size={15} /> : <Star size={15} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isBirthday
                        ? t('dashboard.birthday')
                        : `${t('dashboard.workAnniversary')}${ev.years ? ` · ${ev.years} ${t('dashboard.years')}` : ''}`}
                    </p>
                  </div>

                  <div className="text-end">
                    <p className="text-xs font-medium tabular-nums">{dateStr}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {daysUntil === 0
                        ? t('dashboard.today')
                        : `${daysUntil}d`}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
