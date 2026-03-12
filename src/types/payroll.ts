export type PayrollStatus = 'pending' | 'processed'

export interface PayrollRecord {
  id: string
  employeeId: string
  month: number
  year: number
  basicSalary: number
  housing: number
  transport: number
  deductions: number
  grossPay: number
  netPay: number
  status: PayrollStatus
  processedAt?: string
}

export interface PayrollRunInput {
  month: number
  year: number
}

export interface PayrollSummaryStats {
  totalCost: number
  employeesPaid: number
  averageNetPay: number
  pendingCount: number
  deptBreakdown: { dept: string; total: number }[]
}
