import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { AttendanceGrid } from '@/components/attendance/AttendanceGrid'
import { ClockInPanel } from '@/components/attendance/ClockInPanel'
import { FaceScanner } from '@/components/attendance/FaceScanner'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAttendanceStore } from '@/store/attendanceStore'
import { useEmployeeStore } from '@/store/employeeStore'

const CURRENT_EMPLOYEE_ID = 'EMP-0001'

export default function AttendancePage() {
  const { t } = useTranslation()
  const { records, loading, fetchMonthly } = useAttendanceStore()
  const { employees, fetchEmployees } = useEmployeeStore()
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  useEffect(() => {
    fetchMonthly(CURRENT_EMPLOYEE_ID, year, month)
  }, [year, month])

  useEffect(() => {
    if (employees.length === 0) fetchEmployees()
  }, [])

  const monthName = new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <PageWrapper title={t('attendance.title')}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4">
          <ClockInPanel />
          <FaceScanner />
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t('attendance.monthlyGrid')}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
                    <ChevronRight size={16} />
                  </Button>
                  <span className="text-sm font-medium min-w-[130px] text-center">{monthName}</span>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
                    <ChevronLeft size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <LoadingSkeleton rows={5} />
              ) : (
                <AttendanceGrid year={year} month={month} records={records} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  )
}
