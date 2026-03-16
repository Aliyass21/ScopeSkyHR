import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@tanstack/react-query'
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
import { useAuthStore } from '@/store/authStore'
import { createUserApi } from '@/api/auth'
import { getPositionsApi } from '@/api/positionsApi'
import type { Employee } from '@/types/employee'
import type { ProfileType, ShiftType, Gender } from '@/types/api'

const createSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(2),
  gender: z.enum(['Male', 'Female']),
  phoneNumber: z.string().optional(),
  address: z.string().optional(),
  employeeNumber: z.string().min(1),
  hireDate: z.string(),
  profileType: z.string(),
  positionId: z.string().optional(),
  shiftType: z.string(),
})

type CreateFormData = z.infer<typeof createSchema>

const DAYS = [
  { value: 0, labelKey: 'employees.form.days.sunday' },
  { value: 1, labelKey: 'employees.form.days.monday' },
  { value: 2, labelKey: 'employees.form.days.tuesday' },
  { value: 3, labelKey: 'employees.form.days.wednesday' },
  { value: 4, labelKey: 'employees.form.days.thursday' },
  { value: 5, labelKey: 'employees.form.days.friday' },
  { value: 6, labelKey: 'employees.form.days.saturday' },
]

interface EmployeeFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employee?: Employee | null
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({ open, onOpenChange, employee }) => {
  const { t } = useTranslation()
  const { fetchEmployees } = useEmployeeStore()
  const authUser = useAuthStore((s) => s.user)
  const projectId = authUser?.projectAccesses?.[0]?.projectId ?? ''
  const isEdit = !!employee

  // Load positions for dropdown
  const { data: positions = [] } = useQuery({
    queryKey: ['positions'],
    queryFn: getPositionsApi,
    staleTime: 300_000,
  })

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormData>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      gender: 'Male',
      profileType: 'Employee',
      shiftType: 'Fixed',
      hireDate: new Date().toISOString().split('T')[0],
    },
  })

  // Track weeklyOffDays as local state (not part of react-hook-form to keep it simple)
  const [weeklyOffDays, setWeeklyOffDays] = React.useState<number[]>([5, 6])

  function toggleDay(day: number) {
    setWeeklyOffDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    )
  }

  useEffect(() => {
    if (!open) {
      reset({
        gender: 'Male',
        profileType: 'Employee',
        shiftType: 'Fixed',
        hireDate: new Date().toISOString().split('T')[0],
      })
      setWeeklyOffDays([5, 6])
    }
  }, [open, reset])

  const { mutate: doCreate, isPending: creating } = useMutation({
    mutationFn: createUserApi,
    onSuccess: () => {
      toast.success(t('employees.success.created'))
      fetchEmployees()
      onOpenChange(false)
    },
    onError: () => toast.error(t('errors.generic')),
  })

  const onSubmit = async (data: CreateFormData) => {
    if (!projectId) {
      toast.error(t('errors.generic'))
      return
    }
    doCreate({
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      gender: data.gender as Gender,
      phoneNumber: data.phoneNumber ?? null,
      address: data.address ?? null,
      employeeNumber: data.employeeNumber,
      hireDate: data.hireDate,
      locationNodeId: null,
      positionId: data.positionId || null,
      timeZone: 'Asia/Baghdad',
      profileType: data.profileType as ProfileType,
      projectId,
      role: data.profileType,
      shiftType: data.shiftType as ShiftType,
      weeklyOffDays,
      hasMultiSite: false,
    })
  }

  // Edit mode: show a simplified read-only info dialog (edit not yet wired to real API)
  if (isEdit && employee) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('employees.form.editTitle')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              <span className="text-muted-foreground">{t('common.name')}</span>
              <span className="font-medium">{employee.nameEn}</span>
              <span className="text-muted-foreground">{t('common.email')}</span>
              <span>{employee.email}</span>
              <span className="text-muted-foreground">{t('common.status')}</span>
              <span>{employee.status}</span>
            </div>
          </div>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('employees.form.addTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Username */}
            <div className="space-y-1.5">
              <Label htmlFor="username">{t('login.username')}</Label>
              <Input id="username" {...register('username')} autoComplete="off" />
              {errors.username && (
                <p className="text-xs text-destructive">{t('validation.required')}</p>
              )}
            </div>
            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Input id="password" type="password" {...register('password')} autoComplete="new-password" />
              {errors.password && (
                <p className="text-xs text-destructive">{t('validation.required')}</p>
              )}
            </div>
            {/* Full name */}
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="fullName">{t('common.name')}</Label>
              <Input id="fullName" {...register('fullName')} />
              {errors.fullName && (
                <p className="text-xs text-destructive">{t('validation.required')}</p>
              )}
            </div>
            {/* Gender */}
            <div className="space-y-1.5">
              <Label>{t('employees.form.gender')}</Label>
              <Select
                value={watch('gender')}
                onValueChange={(v) => setValue('gender', v as 'Male' | 'Female')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">{t('employees.form.genders.male')}</SelectItem>
                  <SelectItem value="Female">{t('employees.form.genders.female')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Employee Number */}
            <div className="space-y-1.5">
              <Label htmlFor="employeeNumber">{t('employees.employeeNumber')}</Label>
              <Input id="employeeNumber" {...register('employeeNumber')} />
              {errors.employeeNumber && (
                <p className="text-xs text-destructive">{t('validation.required')}</p>
              )}
            </div>
            {/* Phone */}
            <div className="space-y-1.5">
              <Label htmlFor="phoneNumber">{t('common.phone')}</Label>
              <Input id="phoneNumber" {...register('phoneNumber')} />
            </div>
            {/* Hire Date */}
            <div className="space-y-1.5">
              <Label htmlFor="hireDate">{t('employees.hireDate')}</Label>
              <Input id="hireDate" type="date" {...register('hireDate')} />
            </div>
            {/* Profile Type */}
            <div className="space-y-1.5">
              <Label>{t('employees.form.profileType')}</Label>
              <Select
                value={watch('profileType')}
                onValueChange={(v) => setValue('profileType', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['Employee', 'Manager', 'Supervisor', 'HR', 'Admin'] as ProfileType[]).map(
                    (pt) => (
                      <SelectItem key={pt} value={pt}>
                        {t(`employees.form.profileTypes.${pt.toLowerCase()}`)}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            {/* Shift Type */}
            <div className="space-y-1.5">
              <Label>{t('employees.form.shiftType')}</Label>
              <Select
                value={watch('shiftType')}
                onValueChange={(v) => setValue('shiftType', v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed">{t('employees.form.shiftTypes.fixed')}</SelectItem>
                  <SelectItem value="Flexible">{t('employees.form.shiftTypes.flexible')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Position (optional) */}
            {positions.length > 0 && (
              <div className="space-y-1.5">
                <Label>{t('common.position')}</Label>
                <Select
                  value={watch('positionId') ?? ''}
                  onValueChange={(v) => setValue('positionId', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('common.optional')} />
                  </SelectTrigger>
                  <SelectContent>
                    {positions.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Weekly Off Days */}
          <div className="space-y-2">
            <Label>{t('employees.form.weeklyOffDays')}</Label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`rounded-lg border px-3 py-1 text-xs font-medium transition ${
                    weeklyOffDays.includes(d.value)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  {t(d.labelKey)}
                </button>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || creating}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || creating || !projectId}>
              {creating ? t('common.loading') : t('common.save')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
