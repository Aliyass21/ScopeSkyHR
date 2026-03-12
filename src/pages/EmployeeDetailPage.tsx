import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft, Pencil } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmployeeProfile } from '@/components/employees/EmployeeProfile'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { getEmployee } from '@/api/employees'
import { useUiStore } from '@/store/uiStore'
import type { Employee } from '@/types/employee'

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { language } = useUiStore()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [editOpen, setEditOpen] = useState(false)
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft

  useEffect(() => {
    if (!id) return
    getEmployee(id)
      .then(setEmployee)
      .finally(() => setLoading(false))
  }, [id])

  return (
    <PageWrapper
      title={t('employees.profile.title')}
      action={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate('/employees')}>
            <BackIcon size={16} />
            {t('common.back')}
          </Button>
          {employee && (
            <Button onClick={() => setEditOpen(true)}>
              <Pencil size={16} />
              {t('common.edit')}
            </Button>
          )}
        </div>
      }
    >
      {loading ? (
        <LoadingSkeleton type="list" rows={3} />
      ) : employee ? (
        <EmployeeProfile employee={employee} />
      ) : (
        <p className="text-muted-foreground">{t('errors.notFound')}</p>
      )}

      {employee && (
        <EmployeeForm
          open={editOpen}
          onOpenChange={setEditOpen}
          employee={employee}
        />
      )}
    </PageWrapper>
  )
}
