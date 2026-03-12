import { mockDelay } from '@/utils/mockDelay'
import rawJobs from '@/data/jobs.json'
import rawApplicants from '@/data/applicants.json'
import type { Job, Applicant, CreateJobInput, PipelineStage } from '@/types/recruitment'

let jobStore: Job[] = rawJobs as Job[]
let applicantStore: Applicant[] = rawApplicants as Applicant[]
let nextJobId = jobStore.length + 1

export async function getJobs(): Promise<Job[]> {
  await mockDelay()
  return [...jobStore]
}

export async function getJob(id: string): Promise<Job | null> {
  await mockDelay(100, 200)
  return jobStore.find((j) => j.id === id) ?? null
}

export async function createJob(input: CreateJobInput): Promise<Job> {
  await mockDelay()
  const job: Job = {
    id: `JOB-${String(nextJobId++).padStart(3, '0')}`,
    ...input,
    status: 'open',
    postedAt: new Date().toISOString(),
  }
  jobStore = [...jobStore, job]
  return job
}

export async function updateJob(id: string, input: Partial<CreateJobInput & { status: Job['status'] }>): Promise<Job> {
  await mockDelay()
  const idx = jobStore.findIndex((j) => j.id === id)
  if (idx === -1) throw new Error('Job not found')
  const updated = { ...jobStore[idx], ...input }
  jobStore = jobStore.map((j) => (j.id === id ? updated : j))
  return updated
}

export async function getApplicants(jobId?: string): Promise<Applicant[]> {
  await mockDelay()
  if (jobId) return applicantStore.filter((a) => a.jobId === jobId)
  return [...applicantStore]
}

export async function moveApplicant(id: string, stage: PipelineStage): Promise<Applicant> {
  await mockDelay(150, 300)
  const applicant = applicantStore.find((a) => a.id === id)
  if (!applicant) throw new Error('Applicant not found')
  const updated: Applicant = {
    ...applicant,
    stage,
    stageHistory: [
      ...applicant.stageHistory,
      { stage, movedAt: new Date().toISOString() },
    ],
  }
  applicantStore = applicantStore.map((a) => (a.id === id ? updated : a))
  return updated
}
