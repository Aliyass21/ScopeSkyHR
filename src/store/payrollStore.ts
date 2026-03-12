import { create } from 'zustand'
import * as api from '@/api/payroll'
import type { PayrollRecord, PayrollRunInput, PayrollSummaryStats } from '@/types/payroll'

interface PayrollState {
  records: PayrollRecord[]
  loading: boolean
  running: boolean
  error: string | null
  fetchRecords: (month?: number, year?: number) => Promise<void>
  runPayroll: (input: PayrollRunInput) => Promise<PayrollRecord[]>
  getSummary: (month: number, year: number, deptMap: Record<string, string>) => PayrollSummaryStats
}

export const usePayrollStore = create<PayrollState>((set, get) => ({
  records: [],
  loading: false,
  running: false,
  error: null,

  fetchRecords: async (month, year) => {
    set({ loading: true, error: null })
    try {
      const records = await api.getPayrollRecords(month, year)
      set({ records, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load payroll records' })
    }
  },

  runPayroll: async (input) => {
    set({ running: true })
    try {
      const newRecords = await api.runPayroll(input)
      // Merge into store — replace records for that month
      set((s) => {
        const others = s.records.filter(
          (r) => !(r.month === input.month && r.year === input.year),
        )
        return { records: [...others, ...newRecords], running: false }
      })
      return newRecords
    } catch {
      set({ running: false })
      throw new Error('Payroll run failed')
    }
  },

  getSummary: (month, year, deptMap) => {
    const filtered = get().records.filter((r) => r.month === month && r.year === year)
    const processed = filtered.filter((r) => r.status === 'processed')
    const totalCost = processed.reduce((sum, r) => sum + r.netPay, 0)
    const averageNetPay = processed.length ? Math.round(totalCost / processed.length) : 0

    const deptTotals: Record<string, number> = {}
    processed.forEach((r) => {
      const dept = deptMap[r.employeeId] ?? 'other'
      deptTotals[dept] = (deptTotals[dept] ?? 0) + r.netPay
    })
    const deptBreakdown = Object.entries(deptTotals).map(([dept, total]) => ({ dept, total }))

    return {
      totalCost,
      employeesPaid: processed.length,
      averageNetPay,
      pendingCount: filtered.filter((r) => r.status === 'pending').length,
      deptBreakdown,
    }
  },
}))
