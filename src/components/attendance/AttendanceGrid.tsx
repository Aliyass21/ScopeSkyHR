import { useTranslation } from 'react-i18next'
import { getDaysInMonth, startOfMonth, getDay, format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceGridProps {
  year: number
  month: number
  records: AttendanceRecord[]
}

const statusConfig = {
  present: { className: 'bg-green-100 text-green-700 border-green-200', labelKey: 'attendance.present' },
  absent: { className: 'bg-red-100 text-red-700 border-red-200', labelKey: 'attendance.absent' },
  late: { className: 'bg-yellow-100 text-yellow-700 border-yellow-200', labelKey: 'attendance.late' },
  holiday: { className: 'bg-blue-100 text-blue-700 border-blue-200', labelKey: 'attendance.holiday' },
  weekend: { className: 'bg-gray-100 text-gray-500 border-gray-200', labelKey: 'attendance.weekend' },
}

export const AttendanceGrid: React.FC<AttendanceGridProps> = ({ year, month, records }) => {
  const { t } = useTranslation()
  const daysInMonth = getDaysInMonth(new Date(year, month - 1))
  const firstDay = getDay(startOfMonth(new Date(year, month - 1)))

  const recordMap = new Map(records.map((r) => [r.date, r]))

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const d = i + 1
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return { day: d, date: dateStr, record: recordMap.get(dateStr) }
  })

  const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {Object.entries(statusConfig).map(([status, config]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className={cn('h-3 w-3 rounded-sm border', config.className)} />
            <span className="text-muted-foreground">{t(config.labelKey)}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {dayNamesEn.map((name) => (
          <div key={name} className="py-2 text-center text-xs font-medium text-muted-foreground">
            {name}
          </div>
        ))}
        {/* Empty cells */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* Day cells */}
        {days.map(({ day, date, record }) => {
          const status = record?.status
          const config = status ? statusConfig[status] : null
          const today = format(new Date(), 'yyyy-MM-dd') === date

          return (
            <div
              key={date}
              className={cn(
                'relative rounded-md border p-1.5 text-center text-xs min-h-[52px] transition-colors',
                config ? config.className : 'border-border',
                today && 'ring-2 ring-primary ring-offset-1',
              )}
            >
              <span className="font-medium">{day}</span>
              {record?.checkIn && (
                <p className="mt-0.5 text-[10px] opacity-70">{record.checkIn}</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
