import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRecruitmentStore } from '@/store/recruitmentStore'
import type { Job } from '@/types/recruitment'
import type { DepartmentId } from '@/types/common'

const schema = z.object({
  title: z.string().min(3),
  titleAr: z.string().min(3),
  department: z.string(),
  descriptionEn: z.string().min(10),
  descriptionAr: z.string().min(10),
  requirementsEnRaw: z.string().min(5),
  requirementsArRaw: z.string().min(5),
  deadline: z.string(),
})
type FormData = z.infer<typeof schema>

const DEPARTMENTS: DepartmentId[] = [
  'engineering', 'hr', 'finance', 'marketing', 'operations', 'sales', 'it', 'legal',
]

interface JobFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  job?: Job | null
}

export const JobForm: React.FC<JobFormProps> = ({ open, onOpenChange, job }) => {
  const { t } = useTranslation()
  const { createJob, updateJob } = useRecruitmentStore()
  const isEdit = !!job

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isSubmitting } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: {
        department: 'engineering',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      },
    })

  useEffect(() => {
    if (job) {
      reset({
        title: job.title,
        titleAr: job.titleAr,
        department: job.department,
        descriptionEn: job.descriptionEn,
        descriptionAr: job.descriptionAr,
        requirementsEnRaw: job.requirementsEn.join('\n'),
        requirementsArRaw: job.requirementsAr.join('\n'),
        deadline: job.deadline,
      })
    } else {
      reset({
        department: 'engineering',
        deadline: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      })
    }
  }, [job, open, reset])

  const onSubmit = async (data: FormData) => {
    const input = {
      title: data.title,
      titleAr: data.titleAr,
      department: data.department as DepartmentId,
      descriptionEn: data.descriptionEn,
      descriptionAr: data.descriptionAr,
      requirementsEn: data.requirementsEnRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      requirementsAr: data.requirementsArRaw.split('\n').map((s) => s.trim()).filter(Boolean),
      deadline: data.deadline,
    }
    try {
      if (isEdit && job) {
        await updateJob(job.id, input)
        toast.success(t('recruitment.success.updated'))
      } else {
        await createJob(input)
        toast.success(t('recruitment.success.created'))
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
          <DialogTitle>{isEdit ? t('recruitment.form.editTitle') : t('recruitment.form.addTitle')}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t('recruitment.form.titleAr')}</Label>
              <Input {...register('titleAr')} />
              {errors.titleAr && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>{t('recruitment.form.titleEn')}</Label>
              <Input {...register('title')} />
              {errors.title && <p className="text-xs text-destructive">{t('validation.required')}</p>}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>{t('common.department')}</Label>
              <Select value={watch('department')} onValueChange={(v) => setValue('department', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{t(`employees.form.departments.${d}`)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t('recruitment.deadline')}</Label>
              <Input type="date" {...register('deadline')} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>{t('recruitment.form.descAr')}</Label>
            <Textarea rows={3} {...register('descriptionAr')} />
            {errors.descriptionAr && <p className="text-xs text-destructive">{t('validation.required')}</p>}
          </div>
          <div className="space-y-1.5">
            <Label>{t('recruitment.form.descEn')}</Label>
            <Textarea rows={3} {...register('descriptionEn')} />
            {errors.descriptionEn && <p className="text-xs text-destructive">{t('validation.required')}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>{t('recruitment.form.reqAr')}</Label>
            <Textarea rows={3} placeholder="متطلب أول&#10;متطلب ثانٍ" {...register('requirementsArRaw')} />
          </div>
          <div className="space-y-1.5">
            <Label>{t('recruitment.form.reqEn')}</Label>
            <Textarea rows={3} placeholder="First requirement&#10;Second requirement" {...register('requirementsEnRaw')} />
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
