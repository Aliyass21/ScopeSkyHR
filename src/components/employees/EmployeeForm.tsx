import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useEmployeeStore } from '@/store/employeeStore'
import type { Employee } from '@/types/employee'
import type { DepartmentId, EmployeeStatus } from '@/types/common'

const schema = z.object({
  nameAr: z.string().min(2),
  nameEn: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7),
  department: z.string(),
  position: z.string().min(2),
  positionAr: z.string().min(2),
  status: z.string(),
  hireDate: z.string(),
  salary: z.coerce.number().positive(),
})

type FormData = z.infer<typeof schema>

const departments: DepartmentId[] = [
  'engineering', 'hr', 'finance', 'marketing', 'operations', 'sales', 'it', 'legal',
]
const statuses: EmployeeStatus[] = ['active', 'inactive', 'onleave']

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onOpenChange, employee }) => {
  const { t } = useTranslation()
  const { createEmployee, updateEmployee } = useEmployeeStore()
  const isEdit = !!employee

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'active',
      department: 'engineering',
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  useEffect(() => {
    if (employee) {
      reset({
        nameAr: employee.nameAr,
        nameEn: employee.nameEn,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        positionAr: employee.positionAr,
        status: employee.status,
        hireDate: employee.hireDate,
        salary: employee.salary,
      })
    } else {
      reset({
        status: 'active',
        department: 'engineering',
        hireDate: new Date().toISOString().split('T')[0],
      })
    }
  }, [employee, reset, open])

  const onSubmit = async (data: FormData) => {
    try {
      if (isEdit && employee) {
        await updateEmployee(employee.id, data as Parameters<typeof updateEmployee>[1])
        toast.success(t('employees.success.updated'))
      } else {
        await createEmployee(data as Parameters<typeof createEmployee>[0])
        toast.success(t('employees.success.created'))
      }
      onOpenChange(false)
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t('employees.form.editTitle') : t('employees.form.addTitle')}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="nameAr">{t('employees.nameAr')}</Label>
              <Input id="nameAr" {...register('nameAr')} />
              {errors.nameAr && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nameEn">{t('employees.nameEn')}</Label>
              <Input id="nameEn" {...register('nameEn')} />
              {errors.nameEn && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t('common.email')}</Label>
              <Input id="email" type="email" {...register('email')} />
              {errors.email && <p className="text-xs text-destructive">{t('validation.invalidEmail')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t('common.phone')}</Label>
              <Input id="phone" {...register('phone')} />
              {errors.phone && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="positionAr">{t('common.position')} (AR)</Label>
              <Input id="positionAr" {...register('positionAr')} />
              {errors.positionAr && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position">{t('common.position')} (EN)</Label>
              <Input id="position" {...register('position')} />
              {errors.position && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('common.department')}</Label>
              <Select
                value={watch('department')}
                onValueChange={(v) => setValue('department', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {t(`employees.form.departments.${d}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('common.status')}</Label>
              <Select
                value={watch('status')}
                onValueChange={(v) => setValue('status', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {t(`employees.form.status.${s}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="hireDate">{t('employees.hireDate')}</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="salary">{t('employees.salary')} (SAR)</Label>
              <Input id="salary" type="number" {...register('salary')} />
              {errors.salary && <p className="text-xs text-destructive">{t('validation.positiveSalary')}</p>}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
