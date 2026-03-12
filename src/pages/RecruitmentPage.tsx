import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Briefcase, Users, UserCheck, Plus, ArrowRight, ArrowLeft } from 'lucide-react'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { JobBoard } from '@/components/recruitment/JobBoard'
import { JobForm } from '@/components/recruitment/JobForm'
import { ApplicantKanban } from '@/components/recruitment/ApplicantKanban'
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton'
import { StatCard } from '@/components/shared/StatCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRecruitmentStore } from '@/store/recruitmentStore'
import { useUiStore } from '@/store/uiStore'

export default function RecruitmentPage() {
  const { t } = useTranslation()
  const { language } = useUiStore()
  const { jobs, applicants, loading, fetchJobs, fetchApplicants } = useRecruitmentStore()
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [addFormOpen, setAddFormOpen] = useState(false)
  const BackIcon = language === 'ar' ? ArrowRight : ArrowLeft

  useEffect(() => {
    fetchJobs()
    fetchApplicants()
  }, [])

  const selectedJob = jobs.find((j) => j.id === selectedJobId)
  const openJobs = jobs.filter((j) => j.status === 'open').length
  const hiredCount = applicants.filter((a) => a.stage === 'hired').length
  const jobApplicants = selectedJobId
    ? applicants.filter((a) => a.jobId === selectedJobId)
    : []

  // Stats for the summary row
  const statsRow = (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        title={t('recruitment.openJobs')}
        value={openJobs}
        icon={<Briefcase size={22} />}
        iconClassName="bg-indigo-100 text-indigo-600"
      />
      <StatCard
        title={t('recruitment.totalApplicants')}
        value={applicants.length}
        icon={<Users size={22} />}
        iconClassName="bg-blue-100 text-blue-600"
      />
      <StatCard
        title={t('recruitment.hiredThisMonth')}
        value={hiredCount}
        icon={<UserCheck size={22} />}
        iconClassName="bg-green-100 text-green-600"
      />
    </div>
  )

  // ── Kanban view ──
  if (selectedJobId && selectedJob) {
    const jobTitle = language === 'ar' ? selectedJob.titleAr : selectedJob.title
    return (
      <PageWrapper
        title={jobTitle}
        description={t(`employees.form.departments.${selectedJob.department}`)}
        action={
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1.5">
              <Users size={13} />
              {jobApplicants.length} {t('recruitment.applicants')}
            </Badge>
            <Button variant="outline" onClick={() => setSelectedJobId(null)}>
              <BackIcon size={16} />
              {t('recruitment.backToJobs')}
            </Button>
          </div>
        }
      >
        <ApplicantKanban jobId={selectedJobId} />
      </PageWrapper>
    )
  }

  // ── Job board view ──
  return (
    <PageWrapper
      title={t('recruitment.title')}
      description={t('recruitment.subtitle')}
      action={
        <Button onClick={() => setAddFormOpen(true)}>
          <Plus size={16} />
          {t('recruitment.newJob')}
        </Button>
      }
    >
      {statsRow}

      {loading ? (
        <LoadingSkeleton type="list" rows={4} />
      ) : (
        <JobBoard onSelectJob={setSelectedJobId} />
      )}

      <JobForm open={addFormOpen} onOpenChange={setAddFormOpen} />
    </PageWrapper>
  )
}
