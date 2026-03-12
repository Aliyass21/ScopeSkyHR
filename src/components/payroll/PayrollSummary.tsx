import { useTranslation } from 'react-i18next'
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PayrollSummaryStats } from '@/types/payroll'

interface PayrollSummaryProps {
  stats: PayrollSummaryStats
}

const SAR = (n: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(n)

export const PayrollSummary: React.FC<PayrollSummaryProps> = ({ stats }) => {
  const { t } = useTranslation()

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('payroll.summary.totalCost')}
          value={`${SAR(stats.totalCost)} SAR`}
          icon={<DollarSign size={22} />}
          iconClassName="bg-emerald-100 text-emerald-600"
        />
        <StatCard
          title={t('payroll.summary.employeesPaid')}
          value={stats.employeesPaid}
          icon={<Users size={22} />}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatCard
          title={t('payroll.summary.averageSalary')}
          value={`${SAR(stats.averageNetPay)} SAR`}
          icon={<TrendingUp size={22} />}
          iconClassName="bg-violet-100 text-violet-600"
        />
        <StatCard
          title={t('payroll.summary.pending')}
          value={stats.pendingCount}
          icon={<Clock size={22} />}
          iconClassName={
            stats.pendingCount > 0
              ? 'bg-orange-100 text-orange-600'
              : 'bg-green-100 text-green-600'
          }
        />
      </div>

      {stats.deptBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('payroll.summary.deptBreakdown')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart
                data={stats.deptBreakdown.sort((a, b) => b.total - a.total)}
                margin={{ top: 4, right: 16, left: 8, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="dept"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => t(`employees.form.departments.${v}` as never)}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(v: number) => [`${SAR(v)} SAR`, t('payroll.netPay')]}
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
