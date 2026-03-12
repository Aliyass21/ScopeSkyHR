import type { DepartmentId } from './common'

export type PipelineStage =
  | 'applied'
  | 'screening'
  | 'interview'
  | 'offer'
  | 'hired'
  | 'rejected'

export type JobStatus = 'open' | 'closed' | 'draft'

export interface Job {
  id: string
  title: string
  titleAr: string
  department: DepartmentId
  descriptionEn: string
  descriptionAr: string
  requirementsEn: string[]
  requirementsAr: string[]
  status: JobStatus
  deadline: string
  postedAt: string
}

export interface StageEvent {
  stage: PipelineStage
  movedAt: string
  note?: string
}

export interface Applicant {
  id: string
  jobId: string
  nameAr: string
  nameEn: string
  email: string
  phone: string
  stage: PipelineStage
  appliedAt: string
  resumeUrl: string
  stageHistory: StageEvent[]
}

export interface CreateJobInput {
  title: string
  titleAr: string
  department: DepartmentId
  descriptionEn: string
  descriptionAr: string
  requirementsEn: string[]
  requirementsAr: string[]
  deadline: string
}
