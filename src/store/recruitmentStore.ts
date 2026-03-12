import { create } from 'zustand'
import * as api from '@/api/recruitment'
import type { Job, Applicant, CreateJobInput, PipelineStage } from '@/types/recruitment'

interface RecruitmentState {
  jobs: Job[]
  applicants: Applicant[]
  loading: boolean
  error: string | null
  fetchJobs: () => Promise<void>
  fetchApplicants: (jobId?: string) => Promise<void>
  createJob: (input: CreateJobInput) => Promise<Job>
  updateJob: (id: string, input: Partial<CreateJobInput & { status: Job['status'] }>) => Promise<Job>
  moveApplicant: (id: string, stage: PipelineStage) => Promise<void>
  applicantCountForJob: (jobId: string) => number
}

export const useRecruitmentStore = create<RecruitmentState>((set, get) => ({
  jobs: [],
  applicants: [],
  loading: false,
  error: null,

  fetchJobs: async () => {
    set({ loading: true, error: null })
    try {
      const jobs = await api.getJobs()
      set({ jobs, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load jobs' })
    }
  },

  fetchApplicants: async (jobId) => {
    try {
      const applicants = await api.getApplicants(jobId)
      set({ applicants })
    } catch {
      set({ error: 'Failed to load applicants' })
    }
  },

  createJob: async (input) => {
    const job = await api.createJob(input)
    set((s) => ({ jobs: [...s.jobs, job] }))
    return job
  },

  updateJob: async (id, input) => {
    const updated = await api.updateJob(id, input)
    set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? updated : j)) }))
    return updated
  },

  moveApplicant: async (id, stage) => {
    // Optimistic update
    set((s) => ({
      applicants: s.applicants.map((a) =>
        a.id === id
          ? {
              ...a,
              stage,
              stageHistory: [...a.stageHistory, { stage, movedAt: new Date().toISOString() }],
            }
          : a,
      ),
    }))
    // Sync with API (fire-and-forget; revert on error is omitted for demo simplicity)
    await api.moveApplicant(id, stage)
  },

  applicantCountForJob: (jobId) =>
    get().applicants.filter((a) => a.jobId === jobId).length,
}))
