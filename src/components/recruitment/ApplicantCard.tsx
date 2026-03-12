import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ExternalLink, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog'
import { useUiStore } from '@/store/uiStore'
import type { Applicant, PipelineStage } from '@/types/recruitment'

interface ApplicantCardProps {
  applicant: Applicant
  isDragging?: boolean
  onDragStart: (e: React.DragEvent, id: string) => void
}

const stageColors: Record<PipelineStage, string> = {
  applied:   'bg-slate-100 text-slate-700',
  screening: 'bg-blue-100 text-blue-700',
  interview: 'bg-violet-100 text-violet-700',
  offer:     'bg-amber-100 text-amber-700',
  hired:     'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-700',
}

export const ApplicantCard: React.FC<ApplicantCardProps> = ({
  applicant,
  isDragging,
  onDragStart,
}) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const [detailOpen, setDetailOpen] = useState(false)
  const name = language === 'ar' ? applicant.nameAr : applicant.nameEn
  const initials = applicant.nameEn.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <div
        draggable
        onDragStart={(e) => onDragStart(e, applicant.id)}
        onClick={() => setDetailOpen(true)}
        className={`
          rounded-lg border bg-card p-3 cursor-grab active:cursor-grabbing
          hover:shadow-sm transition-all select-none space-y-2
          ${isDragging ? 'opacity-40 rotate-1 scale-95' : ''}
        `}
      >
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarFallback className="text-xs bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{applicant.email}</p>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {format(new Date(applicant.appliedAt), 'MMM d')}
          </span>
          <span className="text-[10px] opacity-60 italic">{t('common.view')}</span>
        </div>
      </div>

      {/* Detail modal */}
      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">{initials}</AvatarFallback>
              </Avatar>
              <span>{language === 'ar' ? applicant.nameAr : applicant.nameEn}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Info grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">{t('common.email')}</p>
                <p className="font-medium truncate">{applicant.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('common.phone')}</p>
                <p className="font-medium">{applicant.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('recruitment.appliedOn')}</p>
                <p className="font-medium">{format(new Date(applicant.appliedAt), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{t('common.status')}</p>
                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${stageColors[applicant.stage]}`}>
                  {t(`recruitment.stages.${applicant.stage}`)}
                </span>
              </div>
            </div>

            {/* Resume */}
            <Button variant="outline" size="sm" className="w-full gap-2" asChild>
              <a href={applicant.resumeUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={14} />
                {t('recruitment.resumeLink')}
              </a>
            </Button>

            <Separator />

            {/* Stage history */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                {t('recruitment.stageHistory')}
              </p>
              <div className="relative space-y-3 ps-4">
                <div className="absolute start-1.5 top-1 bottom-1 w-px bg-border" />
                {applicant.stageHistory.map((ev, i) => (
                  <div key={i} className="relative flex gap-3 items-start">
                    <div className="absolute -start-1.5 mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {t(`recruitment.stages.${ev.stage}`)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(ev.movedAt), 'MMM d, yyyy — HH:mm')}
                      </p>
                      {ev.note && (
                        <p className="text-xs text-muted-foreground italic mt-0.5">{ev.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
