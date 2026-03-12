export type LeaveStatus = 'pending' | 'approved' | 'rejected'
export type LeaveType = 'annual' | 'sick' | 'emergency' | 'unpaid' | 'maternity' | 'paternity'

export interface LeaveRequest {
  id: string
  employeeId: string
  type: LeaveType
  startDate: string
  endDate: string
  durationDays: number
  reason: string
  status: LeaveStatus
  requestedAt: string
  reviewedAt?: string
  reviewedBy?: string
}

export interface LeaveBalance {
  employeeId: string
  annual: { total: number; used: number }
  sick: { total: number; used: number }
}

export interface CreateLeaveInput {
  employeeId: string
  type: LeaveType
  startDate: string
  endDate: string
  reason: string
}
