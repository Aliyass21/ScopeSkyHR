import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { PayrollSummary } from '@/components/payroll/PayrollSummary'
import { PayrollRunButton } from '@/components/payroll/PayrollRunButton'
import { PayrollTable } from '@/components/payroll/PayrollTable'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { usePayrollStore } from '@/store/payrollStore'
import { useEmployeeStore } from '@/store/employeeStore'

const now = new Date()

export default function PayrollPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()

  const month = Number(params.get('month') ?? now.getMonth() + 1)
  const year = Number(params.get('year') ?? now.getFullYear())

  const { records, loading, fetchRecords, getSummary } = usePayrollStore()
  const { employees, fetchEmployees } = useEmployeeStore()

  useEffect(() => {
    fetchRecords(month, year)
  }, [month, year])

  useEffect(() => {
    if (employees.length === 0) fetchEmployees()
  }, [])

  const setMonthYear = (m: number, y: number) => {
    setParams({ month: String(m), year: String(y) })
  }

  const prevMonth = () => {
    if (month === 1) setMonthYear(12, year - 1)
    else setMonthYear(month - 1, year)
  }
  const nextMonth = () => {
    if (month === 12) setMonthYear(1, year + 1)
    else setMonthYear(month + 1, year)
  }

  // dept → department string map for summary chart
  const deptMap = useMemo(
    () => Object.fromEntries(employees.map((e) => [e.id, e.department])),
    [employees],
  )

  const summary = useMemo(
    () => getSummary(month, year, deptMap),
    [records, month, year, deptMap],
  )

  const monthLabel = `${t(`payroll.months.${month}`)} ${year}`

  return (
    <PageWrapper
      title={t('payroll.title')}
      description={t('payroll.subtitle')}
      action={
        <PayrollRunButton
          onSuccess={(m, y) => {
            setMonthYear(m, y)
            fetchRecords(m, y)
          }}
        />
      }
    >
      {/* Month navigator */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
          <ChevronRight size={16} />
        </Button>
        <span className="min-w-[140px] text-center font-semibold">{monthLabel}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
          <ChevronLeft size={16} />
        </Button>
      </div>

      {/* Summary stats + dept chart */}
      <PayrollSummary stats={summary} />

      {/* Records table */}
      {loading ? (
        <LoadingSkeleton rows={8} />
      ) : (
        <PayrollTable records={records} employees={employees} />
      )}
    </PageWrapper>
  )
}
