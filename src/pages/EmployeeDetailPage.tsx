import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowRight, ArrowLeft, Pencil } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmployeeProfile } from '@/components/employees/EmployeeProfile'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { getUserApi } from '@/api/users'
import { useUiStore } from '@/store/uiStore'
import type { Employee } from '@/types/employee'
import type { UserWithProfile } from '@/types/api'

function mapToEmployee(user: UserWithProfile): Employee {
  const p = user.profile
  return {
    id: user.id,
    nameAr: p?.fullName ?? user.userName,
    nameEn: p?.fullName ?? user.userName,
    email: user.email,
    phone: p?.phoneNumber ?? user.phoneNumber ?? '',
    department: 'hr',
    position: p?.positionTitle ?? user.roles[0] ?? '',
    positionAr: p?.positionTitle ?? user.roles[0] ?? '',
    status: user.isActive ? 'active' : 'inactive',
    hireDate: p?.employeeData?.hireDate ?? '',
    salary: 0,
    avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.userName)}`,
  }
}

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
    getUserApi(id)
      .then((user) => setEmployee(user ? mapToEmployee(user) : null))
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
