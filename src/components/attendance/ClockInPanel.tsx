import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Clock, LogIn, LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAttendanceStore } from '@/store/attendanceStore'

const CURRENT_EMPLOYEE_ID = 'EMP-0001'

export const ClockInPanel: React.FC = () => {
  const { t } = useTranslation()
  const { records, clockIn, clockOut } = useAttendanceStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const today = format(new Date(), 'yyyy-MM-dd')
  const todayRecord = records.find(
    (r) => r.employeeId === CURRENT_EMPLOYEE_ID && r.date === today,
  )
  const isClockedIn = !!todayRecord?.checkIn
  const isClockedOut = !!todayRecord?.checkOut

  const handleClockIn = async () => {
    if (isClockedIn) {
      toast.info(t('attendance.alreadyClockedIn'))
      return
    }
    setLoading(true)
    try {
      await clockIn(CURRENT_EMPLOYEE_ID)
      toast.success(t('attendance.success.clockedIn'))
    } catch {
      toast.error(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!isClockedIn) {
      toast.info(t('attendance.notClockedIn'))
      return
    }
    if (isClockedOut) {
      toast.info(t('attendance.alreadyClockedIn'))
      return
    }
    setLoading(true)
    try {
      await clockOut(CURRENT_EMPLOYEE_ID)
      toast.success(t('attendance.success.clockedOut'))
    } catch {
      toast.error(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock size={18} />
          {t('attendance.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Live clock */}
        <div className="text-center">
          <p className="text-4xl font-bold tabular-nums">
            {format(currentTime, 'HH:mm:ss')}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {format(currentTime, 'EEEE, MMMM d yyyy')}
          </p>
        </div>

        {/* Status */}
        {todayRecord && (
          <div className="rounded-lg bg-muted p-3 space-y-1 text-sm">
            {todayRecord.checkIn && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('attendance.checkIn')}</span>
                <span className="font-medium">{todayRecord.checkIn}</span>
              </div>
            )}
            {todayRecord.checkOut && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('attendance.checkOut')}</span>
                <span className="font-medium">{todayRecord.checkOut}</span>
              </div>
            )}
            {todayRecord.workHours && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('attendance.totalHours')}</span>
                <span className="font-medium">{todayRecord.workHours}h</span>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3">
          <Button
            className="flex-1"
            onClick={handleClockIn}
            disabled={loading || isClockedIn}
            variant={isClockedIn ? 'secondary' : 'default'}
          >
            <LogIn size={16} />
            {t('attendance.clockIn')}
          </Button>
          <Button
            className="flex-1"
            variant="outline"
            onClick={handleClockOut}
            disabled={loading || !isClockedIn || isClockedOut}
          >
            <LogOut size={16} />
            {t('attendance.clockOut')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
