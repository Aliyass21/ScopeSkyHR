import { create } from 'zustand'
import {
  getLeaveRequestsApi,
  approveLeaveRequestApi,
  rejectLeaveRequestApi,
} from '@/api/leaveRequests'
import { getLeaveBalancesApi } from '@/api/leaveBalances'
import type { LeaveRequestDto, EmployeeLeaveBalanceDto, CreateLeaveRequestDto } from '@/types/api'
import type { LeaveRequest, LeaveBalance } from '@/types/leave'
import { createLeaveRequestApi } from '@/api/leaveRequests'

function mapLeaveRequest(dto: LeaveRequestDto): LeaveRequest {
  const start = new Date(dto.startDate)
  const end = new Date(dto.endDate)
  const durationDays =
    Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1)
  return {
    id: dto.id,
    employeeId: dto.profileId,
    leaveTypeName: dto.leaveTypeName,
    type: 'annual', // fallback; LeaveTable uses leaveTypeName when present
    startDate: dto.startDate,
    endDate: dto.endDate,
    durationDays,
    reason: dto.reason ?? '',
    status: dto.status.toLowerCase() as LeaveRequest['status'],
    requestedAt: dto.createdAt,
  }
}

function mapLeaveBalances(dtos: EmployeeLeaveBalanceDto[]): LeaveBalance | null {
  if (dtos.length === 0) return null
  const find = (keyword: string) =>
    dtos.find((d) => d.leaveTypeName.toLowerCase().includes(keyword))
  const annual = find('annual') ?? find('سنوي') ?? dtos[0]
  const sick = find('sick') ?? find('مرض') ?? dtos[1] ?? dtos[0]
  return {
    employeeId: dtos[0].profileId,
    annual: { total: annual.allowedDays, used: annual.usedDays },
    sick: { total: sick.allowedDays, used: sick.usedDays },
  }
}

interface LeaveState {
  requests: LeaveRequest[]
  balance: LeaveBalance | null
  loading: boolean
  error: string | null
  fetchRequests: (profileId?: string) => Promise<void>
  fetchBalance: (profileId: string) => Promise<void>
  createRequest: (input: CreateLeaveRequestDto) => Promise<LeaveRequest>
  approveRequest: (id: string) => Promise<void>
  rejectRequest: (id: string) => Promise<void>
}

export const useLeaveStore = create<LeaveState>((set) => ({
  requests: [],
  balance: null,
  loading: false,
  error: null,
  fetchRequests: async (profileId) => {
    set({ loading: true, error: null })
    try {
      const { requests } = await getLeaveRequestsApi({ profileId, pageSize: 100 })
      set({ requests: requests.map(mapLeaveRequest), loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load leave requests' })
    }
  },
  fetchBalance: async (profileId) => {
    try {
      const dtos = await getLeaveBalancesApi(profileId)
      set({ balance: mapLeaveBalances(dtos) })
    } catch {
      set({ balance: null })
    }
  },
  createRequest: async (input: CreateLeaveRequestDto) => {
    const dto = await createLeaveRequestApi(input)
    if (!dto) throw new Error('Failed to create leave request')
    const mapped = mapLeaveRequest(dto)
    set((s) => ({ requests: [mapped, ...s.requests] }))
    return mapped
  },
  approveRequest: async (id) => {
    const dto = await approveLeaveRequestApi(id)
    if (!dto) throw new Error('Failed to approve leave request')
    const updated = mapLeaveRequest(dto)
    set((s) => ({
      requests: s.requests.map((r) => (r.id === id ? updated : r)),
    }))
  },
  rejectRequest: async (id) => {
    const dto = await rejectLeaveRequestApi(id)
    if (!dto) throw new Error('Failed to reject leave request')
    const updated = mapLeaveRequest(dto)
    set((s) => ({
      requests: s.requests.map((r) => (r.id === id ? updated : r)),
    }))
  },
}))
