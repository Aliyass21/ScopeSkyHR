import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { SlidersHorizontal } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuthStore } from '@/store/authStore'
import { getPositionsApi } from '@/api/positionsApi'
import { getLocationNodesMinimalApi } from '@/api/locationNodes'
import { getProjectsLookupApi } from '@/api/projects'
import type { DashboardFilters as Filters } from '@/hooks/useDashboardStats'

const PROFILE_TYPES = [
  { value: 'Employee', labelKey: 'employees.form.profileTypes.employee' },
  { value: 'Manager', labelKey: 'employees.form.profileTypes.manager' },
  { value: 'Supervisor', labelKey: 'employees.form.profileTypes.supervisor' },
  { value: 'HR', labelKey: 'employees.form.profileTypes.hr' },
  { value: 'Admin', labelKey: 'employees.form.profileTypes.admin' },
]

const ALL = '__all__'

interface DashboardFiltersProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

export const DashboardFilters: React.FC<DashboardFiltersProps> = ({ filters, onChange }) => {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)
  const projectId = filters.projectId ?? user?.projectAccesses?.[0]?.projectId
  const isMultiProject = (user?.projectAccesses?.length ?? 0) > 1

  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: getPositionsApi,
    staleTime: 300_000,
  })

  const { data: locations = [] } = useQuery({
    queryKey: ['locationNodes', 'minimal', projectId],
    queryFn: () => getLocationNodesMinimalApi({ projectId }),
    staleTime: 300_000,
    enabled: !!projectId,
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects', 'lookup'],
    queryFn: getProjectsLookupApi,
    staleTime: 300_000,
    enabled: isMultiProject,
  })

  const set = (key: keyof Filters, val: string) =>
    onChange({ ...filters, [key]: val === ALL ? undefined : val })

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card px-4 py-3">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <SlidersHorizontal size={13} />
        {t('dashboard.filters')}
      </div>

      {/* Project filter — only if user has multiple projects */}
      {isMultiProject && projects.length > 0 && (
        <Select
          value={filters.projectId ?? ALL}
          onValueChange={(v) => set('projectId', v)}
        >
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder={t('dashboard.allProjects')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('dashboard.allProjects')}</SelectItem>
            {projects.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Profile Type */}
      <Select
        value={filters.profileType ?? ALL}
        onValueChange={(v) => set('profileType', v)}
      >
        <SelectTrigger className="h-8 w-36 text-xs">
          <SelectValue placeholder={t('dashboard.allTypes')} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>{t('dashboard.allTypes')}</SelectItem>
          {PROFILE_TYPES.map((pt) => (
            <SelectItem key={pt.value} value={pt.value}>
              {t(pt.labelKey)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Position */}
      {positions.length > 0 && (
        <Select
          value={filters.positionId ?? ALL}
          onValueChange={(v) => set('positionId', v)}
        >
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder={t('dashboard.allPositions')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('dashboard.allPositions')}</SelectItem>
            {positions.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Location */}
      {locations.length > 0 && (
        <Select
          value={filters.locationNodeId ?? ALL}
          onValueChange={(v) => set('locationNodeId', v)}
        >
          <SelectTrigger className="h-8 w-40 text-xs">
            <SelectValue placeholder={t('dashboard.allLocations')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t('dashboard.allLocations')}</SelectItem>
            {locations.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  )
}
