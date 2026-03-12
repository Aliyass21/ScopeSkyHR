import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Users, X } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { OrgTree } from '@/components/orgchart/OrgTree'
import { OrgZoomControls } from '@/components/orgchart/OrgZoomControls'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useEmployeeStore } from '@/store/employeeStore'
import { useUiStore } from '@/store/uiStore'
import { buildOrgTree } from '@/utils/orgTreeBuilder'
import type { OrgNodeData } from '@/types/orgchart'

const ZOOM_STEP = 0.15
const ZOOM_MIN = 0.4
const ZOOM_MAX = 2.0
const ZOOM_DEFAULT = 0.85

export default function OrgChartPage() {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const { employees, loading, fetchEmployees } = useEmployeeStore()
  const [zoom, setZoom] = useState(ZOOM_DEFAULT)
  const [selected, setSelected] = useState<OrgNodeData | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => { fetchEmployees() }, [])

  const tree = employees.length > 0 ? buildOrgTree(employees) : null
  const activeCount = employees.filter((e) => e.status === 'active').length

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)))
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)))
  const zoomReset = () => setZoom(ZOOM_DEFAULT)

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault()
      e.deltaY < 0 ? zoomIn() : zoomOut()
    }
  }

  const handleSelect = (node: OrgNodeData) => {
    setSelected((prev) => (prev?.id === node.id ? null : node))
  }

  return (
    <PageWrapper
      title={t('orgchart.title')}
      description={t('orgchart.subtitle')}
      action={
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="gap-1.5">
            <Users size={13} />
            {activeCount} {t('orgchart.activeEmployees')}
          </Badge>
          <OrgZoomControls
            zoom={zoom}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={zoomReset}
          />
        </div>
      }
    >
      <div className="flex gap-4" style={{ minHeight: '70vh' }}>
        {/* ── Tree canvas ── */}
        <div
          ref={containerRef}
          className="flex-1 overflow-auto rounded-xl border bg-muted/20 relative"
          onWheel={handleWheel}
        >
          {loading ? (
            <div className="p-8">
              <LoadingSkeleton type="card" rows={3} />
            </div>
          ) : !tree ? (
            <EmptyState icon={<Users size={28} />} title={t('orgchart.noEmployees')} />
          ) : (
            <div
              className="flex items-start justify-center py-10 px-8"
              style={{ minWidth: 'max-content' }}
            >
              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.2s ease',
                }}
              >
                <OrgTree
                  node={tree}
                  selectedId={selected?.id ?? null}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          )}

          {/* Zoom hint */}
          <p className="absolute bottom-3 start-3 text-[10px] text-muted-foreground/60 select-none pointer-events-none">
            {t('orgchart.zoomHint')}
          </p>
        </div>

        {/* ── Detail panel ── */}
        {selected?.employee && (
          <div
            className="w-64 shrink-0 rounded-xl border bg-card p-4 space-y-4 overflow-y-auto"
            style={{ maxHeight: '70vh' }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                    {selected.avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-semibold text-sm leading-tight truncate">
                    {language === 'ar' ? selected.employee.nameAr : selected.employee.nameEn}
                  </p>
                  <p className="text-xs text-muted-foreground truncate leading-tight mt-0.5">
                    {language === 'ar' ? selected.employee.positionAr : selected.employee.position}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => setSelected(null)}
              >
                <X size={12} />
              </Button>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{t('common.email')}</p>
                <p className="font-medium text-xs break-all">{selected.employee.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('common.phone')}</p>
                <p className="font-medium text-xs">{selected.employee.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('common.department')}</p>
                <p className="font-medium text-xs">
                  {t(`employees.form.departments.${selected.employee.department}`)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('employees.hireDate')}</p>
                <p className="font-medium text-xs">
                  {format(new Date(selected.employee.hireDate), 'MMM d, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('employees.salary')}</p>
                <p className="font-medium text-xs">
                  {selected.employee.salary.toLocaleString()} SAR
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('common.status')}</p>
                <Badge
                  variant={
                    selected.employee.status === 'active'
                      ? 'success'
                      : selected.employee.status === 'onleave'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {t(`employees.form.status.${selected.employee.status}`)}
                </Badge>
              </div>
              {selected.employee.managerId && (
                <div>
                  <p className="text-xs text-muted-foreground">{t('orgchart.reportsTo')}</p>
                  <p className="font-medium text-xs">
                    {(() => {
                      const mgr = employees.find((e) => e.id === selected.employee!.managerId)
                      if (!mgr) return selected.employee.managerId
                      return language === 'ar' ? mgr.nameAr : mgr.nameEn
                    })()}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
