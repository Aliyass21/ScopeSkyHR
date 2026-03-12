import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { FileText } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { EmptyState } from '@/components/shared/EmptyState'
import { PaySlip } from './PaySlip'
import { useUiStore } from '@/store/uiStore'
import type { PayrollRecord } from '@/types/payroll'
import type { Employee } from '@/types/employee'

interface PayrollTableProps {
  records: PayrollRecord[]
  employees: Employee[]
}

const SAR = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

export const PayrollTable: React.FC<PayrollTableProps> = ({ records, employees }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)

  const getEmployee = (id: string) => employees.find((e) => e.id === id) ?? null

  if (records.length === 0) {
    return (
      <EmptyState
        icon={<FileText size={28} />}
        title={t('payroll.table.noResults')}
        description={t('payroll.table.noResultsHint')}
      />
    )
  }

  const selectedEmployee = selectedRecord ? getEmployee(selectedRecord.employeeId) : null

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.name')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.department')}</th>
                <th className="px-4 py-3 text-end font-medium text-muted-foreground">{t('payroll.basicSalary')}</th>
                <th className="px-4 py-3 text-end font-medium text-muted-foreground">{t('payroll.grossPay')}</th>
                <th className="px-4 py-3 text-end font-medium text-muted-foreground">{t('payroll.deductions')}</th>
                <th className="px-4 py-3 text-end font-medium text-muted-foreground">{t('payroll.netPay')}</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('common.status')}</th>
                <th className="px-4 py-3 text-center font-medium text-muted-foreground">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {records.map((record) => {
                const emp = getEmployee(record.employeeId)
                if (!emp) return null
                return (
                  <tr key={record.id} className="bg-card hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={emp.avatarUrl} />
                          <AvatarFallback>{emp.nameEn.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{language === 'ar' ? emp.nameAr : emp.nameEn}</p>
                          <p className="text-xs text-muted-foreground">{emp.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t(`employees.form.departments.${emp.department}`)}
                    </td>
                    <td className="px-4 py-3 text-end tabular-nums">{SAR(record.basicSalary)}</td>
                    <td className="px-4 py-3 text-end tabular-nums">{SAR(record.grossPay)}</td>
                    <td className="px-4 py-3 text-end tabular-nums text-destructive">
                      -{SAR(record.deductions)}
                    </td>
                    <td className="px-4 py-3 text-end tabular-nums font-semibold text-primary">
                      {SAR(record.netPay)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge variant={record.status === 'processed' ? 'success' : 'warning'}>
                        {t(`payroll.status.${record.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 gap-1.5"
                        onClick={() => setSelectedRecord(record)}
                      >
                        <FileText size={14} />
                        {t('payroll.viewSlip')}
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
            {/* Totals footer */}
            <tfoot className="bg-muted/50 border-t-2">
              <tr>
                <td colSpan={2} className="px-4 py-3 text-sm font-semibold">
                  {t('common.total')} — {records.length} {t('nav.employees').toLowerCase()}
                </td>
                <td className="px-4 py-3 text-end text-sm font-semibold tabular-nums">
                  {SAR(records.reduce((s, r) => s + r.basicSalary, 0))}
                </td>
                <td className="px-4 py-3 text-end text-sm font-semibold tabular-nums">
                  {SAR(records.reduce((s, r) => s + r.grossPay, 0))}
                </td>
                <td className="px-4 py-3 text-end text-sm font-semibold tabular-nums text-destructive">
                  -{SAR(records.reduce((s, r) => s + r.deductions, 0))}
                </td>
                <td className="px-4 py-3 text-end text-sm font-bold tabular-nums text-primary">
                  {SAR(records.reduce((s, r) => s + r.netPay, 0))}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <PaySlip
        open={!!selectedRecord}
        onOpenChange={(open) => !open && setSelectedRecord(null)}
        record={selectedRecord}
        employee={selectedEmployee}
      />
    </>
  )
}
