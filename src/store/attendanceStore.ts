import { create } from 'zustand'
import * as api from '@/api/attendance'
import type { AttendanceRecord } from '@/types/attendance'

interface AttendanceState {
  records: AttendanceRecord[]
  loading: boolean
  error: string | null
  todayRecord: AttendanceRecord | null
  fetchMonthly: (employeeId: string, year: number, month: number) => Promise<void>
  clockIn: (employeeId: string) => Promise<AttendanceRecord>
  clockOut: (employeeId: string) => Promise<AttendanceRecord>
  setTodayRecord: (record: AttendanceRecord | null) => void
}

export const useAttendanceStore = create<AttendanceState>((set) => ({
  records: [],
  loading: false,
  error: null,
  todayRecord: null,
  fetchMonthly: async (employeeId, year, month) => {
    set({ loading: true, error: null })
    try {
      const records = await api.getMonthlyAttendance(employeeId, year, month)
      set({ records, loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load attendance' })
    }
  },
  clockIn: async (employeeId) => {
    const record = await api.clockIn(employeeId)
    set((s) => ({ records: [...s.records, record], todayRecord: record }))
    return record
  },
  clockOut: async (employeeId) => {
    const record = await api.clockOut(employeeId)
    set((s) => ({
      records: s.records.map((r) => (r.id === record.id ? record : r)),
      todayRecord: record,
    }))
    return record
  },
  setTodayRecord: (record) => set({ todayRecord: record }),
}))
