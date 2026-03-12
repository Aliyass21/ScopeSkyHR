import { create } from 'zustand'
import * as api from '@/api/leave'
import type { LeaveRequest, LeaveBalance, CreateLeaveInput } from '@/types/leave'

interface LeaveState {
  requests: LeaveRequest[]
  balance: LeaveBalance | null
  loading: boolean
  error: string | null
  fetchRequests: (employeeId?: string) => Promise<void>
  fetchBalance: (employeeId: string) => Promise<void>
  createRequest: (input: CreateLeaveInput) => Promise<LeaveRequest>
  approveRequest: (id: string) => Promise<void>
  rejectRequest: (id: string) => Promise<void>
}

export const useLeaveStore = create<LeaveState>((set) => ({
  requests: [],
  balance: null,
  loading: false,
  error: null,
  fetchRequests: async (employeeId) => {
    set({ loading: true, error: null })
    try {
      const requests = await api.getLeaveRequests(employeeId)
      set({ requests, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load leave requests' })
    }
  },
  fetchBalance: async (employeeId) => {
    const balance = await api.getLeaveBalance(employeeId)
    set({ balance })
  },
  createRequest: async (input) => {
    const request = await api.createLeaveRequest(input)
    set((s) => ({ requests: [request, ...s.requests] }))
    return request
  },
  approveRequest: async (id) => {
    const updated = await api.approveLeave(id)
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? updated : r)) }))
  },
  rejectRequest: async (id) => {
    const updated = await api.rejectLeave(id)
    set((s) => ({ requests: s.requests.map((r) => (r.id === id ? updated : r)) }))
  },
}))
