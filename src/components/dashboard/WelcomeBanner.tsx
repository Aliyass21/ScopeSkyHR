import { useTranslation } from 'react-i18next'
import { useUiStore } from '@/store/uiStore'
import { format } from 'date-fns'
import { arSA, enUS } from 'date-fns/locale'
import { Sparkles, TrendingUp } from 'lucide-react'

interface WelcomeBannerProps {
  attendanceRate: number
  presentToday: number
  totalEmployees: number
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  attendanceRate,
  presentToday,
  totalEmployees,
}) => {
  const { t } = useTranslation()
  const { language } = useUiStore()

  const hour = new Date().getHours()
  const greeting =
    hour < 12
      ? t('dashboard.goodMorning')
      : hour < 17
      ? t('dashboard.goodAfternoon')
      : t('dashboard.goodEvening')

  const dateStr = format(new Date(), language === 'ar' ? 'EEEE، d MMMM yyyy' : 'EEEE, MMMM d yyyy', {
    locale: language === 'ar' ? arSA : enUS,
  })

  return (
    <div className="bg-banner-gradient relative overflow-hidden rounded-2xl p-6 text-white">
      {/* decorative orbs */}
      <div className="pointer-events-none absolute -end-12 -top-12 h-52 w-52 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 end-28 h-32 w-32 rounded-full bg-white/[0.06]" />
      <div className="pointer-events-none absolute bottom-3 start-1/3 h-20 w-20 rounded-full bg-white/[0.04]" />

      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* left: greeting */}
        <div>
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="opacity-70" />
            <span className="text-sm font-medium text-white/70">{greeting}</span>
          </div>
          <h2 className="mt-1.5 text-2xl font-bold leading-tight tracking-tight">
            {t('dashboard.welcomeTitle')}
          </h2>
          <p className="mt-1 text-sm capitalize text-white/55">{dateStr}</p>
        </div>

        {/* right: stat pills */}
        <div className="flex items-center gap-1 rounded-2xl bg-white/[0.12] px-5 py-3 backdrop-blur-sm">
          <div className="text-center px-3">
            <p className="text-3xl font-bold tabular-nums">{attendanceRate}%</p>
            <p className="mt-0.5 text-[11px] text-white/60">{t('dashboard.attendanceRate')}</p>
          </div>

          <div className="h-10 w-px bg-white/20" />

          <div className="text-center px-3">
            <p className="text-3xl font-bold tabular-nums">
              {presentToday}
              <span className="text-lg font-normal text-white/50">/{totalEmployees}</span>
            </p>
            <p className="mt-0.5 text-[11px] text-white/60">{t('dashboard.presentToday')}</p>
          </div>

          <div className="ms-2 hidden sm:flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
            <TrendingUp size={16} />
          </div>
        </div>
      </div>
    </div>
  )
}
