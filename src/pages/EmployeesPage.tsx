import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { EmployeeTable } from '@/components/employees/EmployeeTable'
import { EmployeeForm } from '@/components/employees/EmployeeForm'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { Button } from '@/components/ui/button'
import { useEmployeeStore } from '@/store/employeeStore'
import type { Employee } from '@/types/employee'

export default function EmployeesPage() {
  const { t } = useTranslation()
  const { employees, loading, fetchEmployees } = useEmployeeStore()
  const [formOpen, setFormOpen] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    if (employees.length === 0) fetchEmployees()
  }, [])

  const handleEdit = (employee: Employee) => {
    setEditEmployee(employee)
    setFormOpen(true)
  }

  const handleAdd = () => {
    setEditEmployee(null)
    setFormOpen(true)
  }

  return (
    <PageWrapper
      title={t('employees.title')}
      action={
        <Button onClick={handleAdd}>
          <UserPlus size={16} />
          {t('employees.addEmployee')}
        </Button>
      }
    >
      {loading ? (
        <LoadingSkeleton rows={8} />
      ) : (
        <EmployeeTable onEdit={handleEdit} />
      )}

      <EmployeeForm
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditEmployee(null)
        }}
        employee={editEmployee}
      />
    </PageWrapper>
  )
}
