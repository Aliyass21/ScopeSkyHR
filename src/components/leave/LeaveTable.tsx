import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useLeaveStore } from '@/store/leaveStore'
import { useUiStore } from '@/store/uiStore'
import { useEmployeeStore } from '@/store/employeeStore'

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'destructive',
}

export const LeaveTable: React.FC = () => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const { requests, approveRequest, rejectRequest } = useLeaveStore()
  const { employees } = useEmployeeStore()
  const [actionTarget, setActionTarget] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null)
  const [loading, setLoading] = useState(false)

  const getEmployeeName = (id: string) => {
    const emp = employees.find((e) => e.id === id)
    if (!emp) return id
    return language === 'ar' ? emp.nameAr : emp.nameEn
  }

  const handleAction = async () => {
    if (!actionTarget) return
    setLoading(true)
    try {
      if (actionTarget.action === 'approve') {
        await approveRequest(actionTarget.id)
        toast.success(t('leave.success.approved'))
      } else {
        await rejectRequest(actionTarget.id)
        toast.success(t('leave.success.rejected'))
      }
    } catch {
      toast.error(t('errors.generic'))
    } finally {
      setLoading(false)
      setActionTarget(null)
    }
  }

  if (requests.length === 0) {
    return <EmptyState title={t('leave.table.noResults')} />
  }

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.name')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('leave.leaveType')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('leave.startDate')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('leave.endDate')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('leave.duration')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.status')}</th>
                <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {requests.map((request) => (
                <tr key={request.id} className="bg-card hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{getEmployeeName(request.employeeId)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{t(`leave.types.${request.type}`)}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(request.startDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(request.endDate), 'MMM d, yyyy')}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {request.durationDays} {t('leave.days')}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[request.status]}>
                      {t(`leave.status.${request.status}`)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    {request.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600 hover:text-green-700"
                          onClick={() => setActionTarget({ id: request.id, action: 'approve' })}
                        >
                          <Check size={15} />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setActionTarget({ id: request.id, action: 'reject' })}
                        >
                          <X size={15} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!actionTarget}
        onOpenChange={(open) => !open && setActionTarget(null)}
        title={actionTarget?.action === 'approve' ? t('leave.approve') : t('leave.reject')}
        description={
          actionTarget?.action === 'approve'
            ? t('leave.approveConfirm')
            : t('leave.rejectConfirm')
        }
        onConfirm={handleAction}
        variant={actionTarget?.action === 'reject' ? 'destructive' : 'default'}
        loading={loading}
      />
    </>
  )
}
