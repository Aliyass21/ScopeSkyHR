import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { Briefcase, Users, CalendarDays, Pencil, ArrowLeft, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { EmptyState } from '@/components/shared/EmptyState'
import { JobForm } from './JobForm'
import { useRecruitmentStore } from '@/store/recruitmentStore'
import { useUiStore } from '@/store/uiStore'
import type { Job } from '@/types/recruitment'

interface JobBoardProps {
  onSelectJob: (jobId: string) => void
}

const statusVariant: Record<Job['status'], 'success' | 'destructive' | 'secondary'> = {
  open: 'success',
  closed: 'destructive',
  draft: 'secondary',
}

export const JobBoard: React.FC<JobBoardProps> = ({ onSelectJob }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const { jobs, applicants } = useRecruitmentStore()
  const [editJob, setEditJob] = useState<Job | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const ArrowIcon = language === 'ar' ? ArrowLeft : ArrowRight

  const countFor = (jobId: string) => applicants.filter((a) => a.jobId === jobId).length

  if (jobs.length === 0) {
    return <EmptyState icon={<Briefcase size={28} />} title={t('recruitment.noJobs')} />
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {jobs.map((job) => {
          const count = countFor(job.id)
          const isOpen = job.status === 'open'
          const isOverdue = new Date(job.deadline) < new Date() && isOpen

          return (
            <Card key={job.id} className="flex flex-col group hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col flex-1 p-5 gap-3">
                {/* Title row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold leading-tight truncate">
                      {language === 'ar' ? job.titleAr : job.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t(`employees.form.departments.${job.department}`)}
                    </p>
                  </div>
                  <Badge variant={statusVariant[job.status]} className="shrink-0">
                    {t(`recruitment.jobStatus.${job.status}`)}
                  </Badge>
                </div>

                <Separator />

                {/* Meta */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={14} />
                    <span>{count} {t('recruitment.applicant')}</span>
                  </div>
                  <div className={`flex items-center gap-2 ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                    <CalendarDays size={14} />
                    <span>{t('recruitment.deadline')}: {format(new Date(job.deadline), 'MMM d, yyyy')}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto pt-1">
                  {isOpen && (
                    <Button
                      className="flex-1 gap-1.5"
                      size="sm"
                      onClick={() => onSelectJob(job.id)}
                    >
                      {t('recruitment.viewPipeline')}
                      <ArrowIcon size={14} />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => { setEditJob(job); setFormOpen(true) }}
                  >
                    <Pencil size={13} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <JobForm
        open={formOpen}
        onOpenChange={(open) => { setFormOpen(open); if (!open) setEditJob(null) }}
        job={editJob}
      />
    </>
  )
}
