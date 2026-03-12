import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Printer, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useUiStore } from '@/store/uiStore'
import type { PayrollRecord } from '@/types/payroll'
import type { Employee } from '@/types/employee'

interface PaySlipProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  record: PayrollRecord | null
  employee: Employee | null
}

const SAR = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n) + ' SAR'

interface RowProps { label: string; value: string; bold?: boolean; large?: boolean }
const Row: React.FC<RowProps> = ({ label, value, bold, large }) => (
  <div className={`flex justify-between items-center py-1.5 ${bold ? 'font-semibold' : ''}`}>
    <span className={`text-muted-foreground ${large ? 'text-base' : 'text-sm'}`}>{label}</span>
    <span className={`tabular-nums ${large ? 'text-base font-bold' : 'text-sm'} ${bold ? 'text-foreground' : ''}`}>
      {value}
    </span>
  </div>
)

export const PaySlip: React.FC<PaySlipProps> = ({ open, onOpenChange, record, employee }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html dir="${language === 'ar' ? 'rtl' : 'ltr'}">
        <head>
          <title>${t('payroll.payslipTitle')}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
          <style>
            body { font-family: ${language === 'ar' ? "'Cairo'" : "'Inter'"}, sans-serif; padding: 32px; color: #111; }
            * { box-sizing: border-box; }
          </style>
        </head>
        <body>${content.innerHTML}</body>
      </html>
    `)
    win.document.close()
    win.focus()
    win.print()
    win.close()
  }

  if (!record || !employee) return null

  const monthName = t(`payroll.months.${record.month}`)
  const empName = language === 'ar' ? employee.nameAr : employee.nameEn
  const empPosition = language === 'ar' ? employee.positionAr : employee.position
  const deptName = t(`employees.form.departments.${employee.department}`)
  const payDate = record.processedAt
    ? new Date(record.processedAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
    : '—'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>{t('payroll.payslipTitle')}</DialogTitle>
        </DialogHeader>

        <div ref={printRef}>
          {/* Header */}
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground/20 font-bold text-sm">
                    HR
                  </div>
                  <span className="font-bold text-lg">{t('app.name')}</span>
                </div>
                <p className="text-primary-foreground/70 text-xs">{t('payroll.companyName')}</p>
              </div>
              <div className="text-end">
                <p className="font-semibold text-lg">{t('payroll.payslipTitle')}</p>
                <p className="text-primary-foreground/70 text-xs mt-0.5">
                  {monthName} {record.year}
                </p>
              </div>
            </div>
          </div>

          {/* Employee info */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 px-6 py-4 bg-muted/40 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">{t('common.name')}</p>
              <p className="font-semibold">{empName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('employees.employeeId')}</p>
              <p className="font-semibold">{employee.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.position')}</p>
              <p className="font-medium">{empPosition}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('common.department')}</p>
              <p className="font-medium">{deptName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('payroll.payPeriod')}</p>
              <p className="font-medium">{monthName} {record.year}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{t('payroll.payDate')}</p>
              <p className="font-medium">{payDate}</p>
            </div>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* Earnings */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t('payroll.earnings')}
              </p>
              <div className="rounded-lg border divide-y">
                <div className="px-4">
                  <Row label={t('payroll.basicSalary')} value={SAR(record.basicSalary)} />
                  <Row label={t('payroll.housing')} value={SAR(record.housing)} />
                  <Row label={t('payroll.transport')} value={SAR(record.transport)} />
                </div>
                <div className="px-4 bg-muted/30">
                  <Row label={t('payroll.grossPay')} value={SAR(record.grossPay)} bold />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                {t('payroll.deductions')}
              </p>
              <div className="rounded-lg border divide-y">
                <div className="px-4">
                  <Row label={t('payroll.gosiDeduction')} value={SAR(record.deductions)} />
                </div>
                <div className="px-4 bg-muted/30">
                  <Row label={t('payroll.totalDeductions')} value={SAR(record.deductions)} bold />
                </div>
              </div>
            </div>

            <Separator />

            {/* Net Pay */}
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-4 flex items-center justify-between">
              <span className="text-base font-semibold">{t('payroll.netPay')}</span>
              <span className="text-2xl font-bold text-primary tabular-nums">
                {SAR(record.netPay)}
              </span>
            </div>

            {/* Status badge */}
            <div className="flex justify-end">
              <Badge variant={record.status === 'processed' ? 'success' : 'warning'}>
                {t(`payroll.status.${record.status}`)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Print button — outside printRef */}
        <div className="flex justify-end gap-2 border-t px-6 py-3">
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            <X size={15} />
            {t('common.close')}
          </Button>
          <Button size="sm" onClick={handlePrint}>
            <Printer size={15} />
            {t('payroll.printSlip')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
