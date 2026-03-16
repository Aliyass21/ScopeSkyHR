import { useTranslation } from 'react-i18next'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ProfileStatisticsDto } from '@/types/api'

interface LocationChartProps {
  profileStats: ProfileStatisticsDto
}

const COLORS = [
  '#6366F1', '#0EA5E9', '#10B981', '#F59E0B',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316',
]

export const LocationChart: React.FC<LocationChartProps> = ({ profileStats }) => {
  const { t } = useTranslation()

  // Prefer byLocation; fall back to byProfileType
  const locationData = profileStats.byLocation ?? []
  const profileTypeData = Object.entries(profileStats.byProfileType ?? {}).map(([k, v]) => ({
    name: k,
    count: v as number,
  }))

  const useLocations = locationData.length > 0
  const chartData = useLocations
    ? locationData.map((l) => ({ name: l.locationName, count: l.count }))
    : profileTypeData.filter((d) => d.count > 0)

  const total = chartData.reduce((s, d) => s + d.count, 0)

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {t(useLocations ? 'dashboard.locationDistribution' : 'dashboard.profileTypeDistribution')}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8 text-sm text-muted-foreground">
          {t('common.noData')}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-base">
          {t(useLocations ? 'dashboard.locationDistribution' : 'dashboard.profileTypeDistribution')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="relative mx-auto w-full max-w-[200px]">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="count"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={76}
                paddingAngle={3}
                stroke="none"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
                formatter={(value: number, _n: string, props: { payload: { name: string; count: number } }) => [
                  `${value} (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                  props.payload.name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tabular-nums">{total}</span>
            <span className="text-[11px] text-muted-foreground">{t('dashboard.totalEmployees')}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {chartData.map((entry, i) => {
            const pct = total > 0 ? Math.round((entry.count / total) * 100) : 0
            return (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[i % COLORS.length] }}
                />
                <span className="flex-1 truncate text-muted-foreground">{entry.name}</span>
                <span className="font-medium tabular-nums text-foreground">{pct}%</span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
