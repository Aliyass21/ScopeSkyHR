import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Pencil, Trash2, Eye, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { EmptyState } from '@/components/shared/EmptyState'
import { useEmployeeStore } from '@/store/employeeStore'
import { useUiStore } from '@/store/uiStore'
import type { Employee } from '@/types/employee'
import { cn } from '@/lib/utils'

interface EmployeeTableProps {
  onEdit: (employee: Employee) => void
}

const statusVariant: Record<string, 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  onleave: 'warning',
  inactive: 'destructive',
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ onEdit }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const navigate = useNavigate()
  const { employees, deleteEmployee } = useEmployeeStore()
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase()
    return (
      e.nameAr.includes(search) ||
      e.nameEn.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    )
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteEmployee(deleteTarget.id)
      toast.success(t('employees.success.deleted'))
    } finally {
      setDeleting(false)
      setDeleteTarget(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="ps-9"
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search size={24} />}
          title={t('employees.table.noResults')}
        />
      ) : (
        <div className="rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.name')}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.department')}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.position')}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.email')}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.status')}</th>
                  <th className="px-4 py-3 text-start font-medium text-muted-foreground">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((employee) => (
                  <tr
                    key={employee.id}
                    className={cn('bg-card hover:bg-muted/30 transition-colors')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatarUrl} />
                          <AvatarFallback>{employee.nameEn.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{language === 'ar' ? employee.nameAr : employee.nameEn}</p>
                          <p className="text-xs text-muted-foreground">{employee.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {t(`employees.form.departments.${employee.department}`)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {language === 'ar' ? employee.positionAr : employee.position}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{employee.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusVariant[employee.status]}>
                        {t(`employees.form.status.${employee.status}`)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => navigate(`/employees/${employee.id}`)}
                        >
                          <Eye size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onEdit(employee)}
                        >
                          <Pencil size={15} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(employee)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
            {t('employees.table.showing', { count: filtered.length })}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t('employees.deleteEmployee')}
        description={t('employees.deleteConfirm')}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </div>
  )
}
