import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Play, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePayrollStore } from '@/store/payrollStore'

interface PayrollRunButtonProps {
  onSuccess: (month: number, year: number) => void
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
const now = new Date()
const YEARS = [now.getFullYear() - 1, now.getFullYear()]

export const PayrollRunButton: React.FC<PayrollRunButtonProps> = ({ onSuccess }) => {
  const { t } = useTranslation()
  const { runPayroll, running } = usePayrollStore()
  const [open, setOpen] = useState(false)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())

  const handleRun = async () => {
    try {
      await runPayroll({ month, year })
      toast.success(t('payroll.success.ran'))
      setOpen(false)
      onSuccess(month, year)
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Play size={16} />
          {t('payroll.runPayroll')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{t('payroll.runPayrollTitle')}</DialogTitle>
          <DialogDescription>{t('payroll.runPayrollDesc')}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-2">
          <div className="space-y-1.5">
            <Label>{t('payroll.selectMonth')}</Label>
            <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={String(m)}>
                    {t(`payroll.months.${m}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>{t('payroll.selectYear')}</Label>
            <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {YEARS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={running}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleRun} disabled={running}>
            {running ? (
              <><Loader2 size={16} className="animate-spin" /> {t('common.loading')}</>
            ) : (
              <><Play size={16} /> {t('payroll.runConfirm')}</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
