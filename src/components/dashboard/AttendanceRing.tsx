import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AttendanceTodayData } from '@/types/dashboard'

interface AttendanceRingProps {
  data: AttendanceTodayData
}

interface LegendRowProps {
  color: string
  label: string
  value: number
  total: number
}

const LegendRow: React.FC<LegendRowProps> = ({ color, label, value, total }) => {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      <span className="flex-1 text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
      <span className="w-8 text-end text-muted-foreground tabular-nums">{pct}%</span>
    </div>
  )
}

export const AttendanceRing: React.FC<AttendanceRingProps> = ({ data }) => {
  const { t } = useTranslation()
  const { present, onLeave, absent, total } = data

  const r = 52
  const cx = 72
  const cy = 72
  const circumference = 2 * Math.PI * r

  const presentFraction = total > 0 ? present / total : 0
  const leaveFraction   = total > 0 ? onLeave / total : 0

  // Present arc: starts at -90° (12 o'clock), covers presentFraction of circle
  const presentOffset  = circumference * (1 - presentFraction)
  const presentRotate  = -90

  // On-leave arc: starts right after the present arc
  const leaveOffset  = circumference * (1 - leaveFraction)
  const leaveRotate  = -90 + presentFraction * 360

  const rate = Math.round(presentFraction * 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('dashboard.attendanceToday')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {/* SVG ring */}
        <div className="relative">
          <svg width="144" height="144" viewBox="0 0 144 144">
            {/* track */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="13"
            />
            {/* on-leave arc (amber) */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={leaveOffset}
              strokeLinecap="round"
              transform={`rotate(${leaveRotate} ${cx} ${cy})`}
            />
            {/* present arc (indigo) */}
            <circle
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke="#6366F1"
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={presentOffset}
              strokeLinecap="round"
              transform={`rotate(${presentRotate} ${cx} ${cy})`}
            />
          </svg>

          {/* center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold tabular-nums">{rate}%</span>
            <span className="text-[11px] text-muted-foreground">{t('attendance.present')}</span>
          </div>
        </div>

        {/* breakdown rows */}
        <div className="w-full space-y-2.5">
          <LegendRow color="#6366F1" label={t('attendance.present')} value={present} total={total} />
          <LegendRow color="#F59E0B" label={t('dashboard.onLeave')}  value={onLeave} total={total} />
          <LegendRow color="hsl(var(--muted-foreground))" label={t('dashboard.absent')} value={absent} total={total} />
        </div>
      </CardContent>
    </Card>
  )
}
