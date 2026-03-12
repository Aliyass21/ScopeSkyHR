import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { LeaveBalance } from '@/types/leave'

interface LeaveBalanceCardProps {
  balance: LeaveBalance
}

interface BalanceBarProps {
  label: string
  used: number
  total: number
}

const BalanceBar: React.FC<BalanceBarProps> = ({ label, used, total }) => {
  const remaining = total - used
  const pct = Math.round((used / total) * 100)

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{remaining} / {total}</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{used} used</span>
        <span>{remaining} remaining</span>
      </div>
    </div>
  )
}

export const LeaveBalanceCard: React.FC<LeaveBalanceCardProps> = ({ balance }) => {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('leave.leaveBalance')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <BalanceBar
          label={t('leave.balance.annual')}
          used={balance.annual.used}
          total={balance.annual.total}
        />
        <BalanceBar
          label={t('leave.balance.sick')}
          used={balance.sick.used}
          total={balance.sick.total}
        />
      </CardContent>
    </Card>
  )
}
