import { mockDelay } from '@/utils/mockDelay'
import rawData from '@/data/leave.json'
import type { LeaveRequest, LeaveBalance, CreateLeaveInput } from '@/types/leave'
import { differenceInBusinessDays, parseISO } from 'date-fns'

let requestStore: LeaveRequest[] = rawData.requests as LeaveRequest[]
const balanceStore: LeaveBalance[] = rawData.balances as LeaveBalance[]
let nextId = requestStore.length + 1

export async function getLeaveRequests(employeeId?: string): Promise<LeaveRequest[]> {
  await mockDelay()
  if (employeeId) return requestStore.filter((r) => r.employeeId === employeeId)
  return [...requestStore]
}

export async function createLeaveRequest(input: CreateLeaveInput): Promise<LeaveRequest> {
  await mockDelay()
  const durationDays = Math.max(
    1,
    differenceInBusinessDays(parseISO(input.endDate), parseISO(input.startDate)) + 1,
  )
  const request: LeaveRequest = {
    id: `LV-${String(nextId++).padStart(4, '0')}`,
    ...input,
    durationDays,
    status: 'pending',
    requestedAt: new Date().toISOString(),
  }
  requestStore = [...requestStore, request]
  return request
}

export async function approveLeave(id: string): Promise<LeaveRequest> {
  await mockDelay()
  const request = requestStore.find((r) => r.id === id)
  if (!request) throw new Error('Leave request not found')
  const updated: LeaveRequest = {
    ...request,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'EMP-0002',
  }
  requestStore = requestStore.map((r) => (r.id === id ? updated : r))
  return updated
}

export async function rejectLeave(id: string): Promise<LeaveRequest> {
  await mockDelay()
  const request = requestStore.find((r) => r.id === id)
  if (!request) throw new Error('Leave request not found')
  const updated: LeaveRequest = {
    ...request,
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'EMP-0002',
  }
  requestStore = requestStore.map((r) => (r.id === id ? updated : r))
  return updated
}

export async function getLeaveBalance(employeeId: string): Promise<LeaveBalance | null> {
  await mockDelay(100, 200)
  return balanceStore.find((b) => b.employeeId === employeeId) ?? null
}
