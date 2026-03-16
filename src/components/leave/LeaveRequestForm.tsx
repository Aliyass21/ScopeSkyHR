import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { useQuery } from '@tanstack/react-query'
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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLeaveStore } from '@/store/leaveStore'
import { useAuthStore } from '@/store/authStore'
import { getLeaveTypesApi } from '@/api/leaveTypes'

const schema = z.object({
  leaveTypeId: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  reason: z.string().min(5),
})

type FormData = z.infer<typeof schema>

interface LeaveRequestFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({ open, onOpenChange }) => {
  const { t } = useTranslation()
  const { createRequest } = useLeaveStore()
  const profileId = useAuthStore((s) => s.user?.profile?.id)
  const today = new Date().toISOString().split('T')[0]

  const { data: leaveTypes = [], isLoading: typesLoading } = useQuery({
    queryKey: ['leave', 'types'],
    queryFn: getLeaveTypesApi,
    staleTime: 300_000,
  })

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
      leaveTypeId: '',
      startDate: today,
      endDate: today,
    },
  })

  const onSubmit = async (data: FormData) => {
    if (data.endDate < data.startDate) {
      toast.error(t('validation.endDateAfterStart'))
      return
    }
    if (!profileId) {
      toast.error(t('errors.generic'))
      return
    }
    try {
      await createRequest({
        profileId,
        leaveTypeId: data.leaveTypeId,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
        isShortTimeLeave: false,
        replacementEmployeeId: null,
        documentPath: null,
      })
      toast.success(t('leave.success.requested'))
      reset()
      onOpenChange(false)
    } catch {
      toast.error(t('errors.generic'))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t('leave.form.title')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>{t('leave.leaveType')}</Label>
            <Select
              value={watch('leaveTypeId')}
              onValueChange={(v) => setValue('leaveTypeId', v)}
              disabled={typesLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('leave.form.selectType')} />
              </SelectTrigger>
              <SelectContent>
                {leaveTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.leaveTypeId && (
              <p className="text-xs text-destructive">{t('validation.required')}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="startDate">{t('leave.startDate')}</Label>
              <Input id="startDate" type="date" {...register('startDate')} min={today} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="endDate">{t('leave.endDate')}</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
                min={watch('startDate')}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="reason">{t('leave.reason')}</Label>
            <Textarea
              id="reason"
              placeholder={t('leave.form.reasonPlaceholder')}
              {...register('reason')}
            />
            {errors.reason && (
              <p className="text-xs text-destructive">{t('validation.required')}</p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting || !profileId}>
              {isSubmitting ? t('common.loading') : t('common.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
