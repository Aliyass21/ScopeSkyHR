import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useUiStore } from '@/store/uiStore'
import type { DepartmentDataPoint } from '@/types/dashboard'

interface DepartmentChartProps {
  data: DepartmentDataPoint[]
}

const DEPT_COLORS: Record<string, string> = {
  engineering: '#6366F1',
  hr:          '#0EA5E9',
  finance:     '#10B981',
  marketing:   '#F59E0B',
  operations:  '#8B5CF6',
}
const FALLBACK_COLOR = '#94A3B8'

export const DepartmentChart: React.FC<DepartmentChartProps> = ({ data }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()

  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">{t('dashboard.departmentDistribution')}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        {/* donut */}
        <div className="relative mx-auto w-full max-w-[200px]">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.dept} fill={DEPT_COLORS[entry.dept] ?? FALLBACK_COLOR} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
                formatter={(value: number, _n: string, props: { payload: DepartmentDataPoint }) => {
                  const name = language === 'ar' ? props.payload.nameAr : props.payload.nameEn
                  return [`${value} (${Math.round((value / total) * 100)}%)`, name]
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* center label */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{total}</span>
            <span className="text-[11px] text-muted-foreground">{t('dashboard.totalEmployees')}</span>
          </div>
        </div>

        {/* legend */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {data.map((entry) => {
            const color = DEPT_COLORS[entry.dept] ?? FALLBACK_COLOR
            const pct = Math.round((entry.count / total) * 100)
            return (
              <div key={entry.dept} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
                <span className="flex-1 truncate text-muted-foreground">
                  {language === 'ar' ? entry.nameAr : entry.nameEn}
                </span>
                <span className="font-medium tabular-nums text-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
