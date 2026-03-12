import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/EmptyState'
import { ApplicantCard } from './ApplicantCard'
import { useRecruitmentStore } from '@/store/recruitmentStore'
import { useUiStore } from '@/store/uiStore'
import type { PipelineStage } from '@/types/recruitment'
import { Users } from 'lucide-react'

const STAGES: PipelineStage[] = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected']

const stageStyle: Record<PipelineStage, { header: string; drop: string }> = {
  applied:   { header: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',   drop: 'border-slate-200 dark:border-slate-700' },
  screening: { header: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',    drop: 'border-blue-200 dark:border-blue-800' },
  interview: { header: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300', drop: 'border-violet-200 dark:border-violet-800' },
  offer:     { header: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', drop: 'border-amber-200 dark:border-amber-800' },
  hired:     { header: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300', drop: 'border-green-200 dark:border-green-800' },
  rejected:  { header: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',        drop: 'border-red-200 dark:border-red-800' },
}

interface ApplicantKanbanProps {
  jobId: string
}

export const ApplicantKanban: React.FC<ApplicantKanbanProps> = ({ jobId }) => {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const { applicants, moveApplicant } = useRecruitmentStore()
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overStage, setOverStage] = useState<PipelineStage | null>(null)

  const jobApplicants = applicants.filter((a) => a.jobId === jobId)

  if (jobApplicants.length === 0) {
    return (
      <EmptyState
        icon={<Users size={28} />}
        title={t('recruitment.noApplicants')}
      />
    )
  }

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('applicantId', id)
    e.dataTransfer.effectAllowed = 'move'
    setDraggingId(id)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setOverStage(null)
  }

  const handleDragOver = (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverStage(stage)
  }

  const handleDrop = async (e: React.DragEvent, stage: PipelineStage) => {
    e.preventDefault()
    const id = e.dataTransfer.getData('applicantId')
    setDraggingId(null)
    setOverStage(null)
    const applicant = applicants.find((a) => a.id === id)
    if (!applicant || applicant.stage === stage) return
    await moveApplicant(id, stage)
    toast.success(t('recruitment.success.moved'))
  }

  return (
    <div
      className="flex gap-3 overflow-x-auto pb-4"
      style={{ minHeight: '60vh' }}
      dir={language === 'ar' ? 'rtl' : 'ltr'}
    >
      {STAGES.map((stage) => {
        const stageApplicants = jobApplicants.filter((a) => a.stage === stage)
        const style = stageStyle[stage]
        const isOver = overStage === stage

        return (
          <div
            key={stage}
            className={`
              flex flex-col rounded-xl border-2 transition-colors shrink-0
              w-56 sm:w-60
              ${isOver ? `${style.drop} bg-accent/30` : 'border-border bg-muted/20'}
            `}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={() => setOverStage(null)}
            onDrop={(e) => handleDrop(e, stage)}
          >
            {/* Column header */}
            <div className={`flex items-center justify-between rounded-t-lg px-3 py-2.5 ${style.header}`}>
              <span className="text-sm font-semibold">{t(`recruitment.stages.${stage}`)}</span>
              <span className="text-xs font-bold opacity-70">
                {stageApplicants.length}
              </span>
            </div>

            {/* Cards */}
            <div
              className="flex-1 space-y-2 overflow-y-auto p-2"
              style={{ maxHeight: 'calc(100vh - 320px)' }}
              onDragEnd={handleDragEnd}
            >
              {stageApplicants.map((applicant) => (
                <ApplicantCard
                  key={applicant.id}
                  applicant={applicant}
                  isDragging={draggingId === applicant.id}
                  onDragStart={handleDragStart}
                />
              ))}

              {stageApplicants.length === 0 && (
                <div className={`
                  rounded-lg border-2 border-dashed p-4 text-center text-xs text-muted-foreground
                  transition-colors ${isOver ? 'border-primary/50 bg-primary/5' : 'border-muted-foreground/20'}
                `}>
                  {isOver ? '↓' : '—'}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
