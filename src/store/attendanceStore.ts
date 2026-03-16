import { create } from 'zustand'
import { getAttendanceCurrentUserApi } from '@/api/attendanceRecords'
import * as mockApi from '@/api/attendance'
import type { AttendanceRecordDto } from '@/types/api'
import type { AttendanceRecord, AttendanceStatus } from '@/types/attendance'

const STATUS_MAP: Partial<Record<string, AttendanceStatus>> = {
  present: 'present',
  absent: 'absent',
  late: 'late',
  holiday: 'holiday',
  weeklyoff: 'weekend',
  leave: 'holiday',
  earlydeparture: 'present',
  halfday: 'present',
}

function mapAttendanceRecord(dto: AttendanceRecordDto): AttendanceRecord {
  const statusKey = dto.status.toLowerCase().replace(/\s/g, '')
  const status: AttendanceStatus = STATUS_MAP[statusKey] ?? 'absent'
  const checkInEntry = dto.checkIns?.find((c) => c.type === 'CheckIn')
  const checkOutEntry = dto.checkIns?.find((c) => c.type === 'CheckOut')
  const toTime = (iso: string | null) => {
    if (!iso) return undefined
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }
  return {
    id: dto.id,
    employeeId: dto.profileId,
    date: dto.date,
    status,
    checkIn: toTime(checkInEntry?.checkInTime ?? null),
    checkOut: toTime(checkOutEntry?.checkInTime ?? null),
  }
}

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
  fetchMonthly: async (_employeeId, year, month) => {
    set({ loading: true, error: null })
    try {
      const fromDate = `${year}-${String(month).padStart(2, '0')}-01`
      const lastDay = new Date(year, month, 0).getDate()
      const toDate = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
      const dtos = await getAttendanceCurrentUserApi({ fromDate, toDate, pageSize: 100 })
      set({ records: dtos.map(mapAttendanceRecord), loading: false })
    } catch {
      set({ loading: false, error: 'Failed to load attendance' })
    }
  },
  // Clock-in/out kept as mock — web UI doesn't do face check-in (mobile only)
  clockIn: async (employeeId) => {
    const record = await mockApi.clockIn(employeeId)
    set((s) => ({ records: [...s.records, record], todayRecord: record }))
    return record
  },
  clockOut: async (employeeId) => {
    const record = await mockApi.clockOut(employeeId)
    set((s) => ({
      records: s.records.map((r) => (r.id === record.id ? record : r)),
      todayRecord: record,
    }))
    return record
  },
  setTodayRecord: (record) => set({ todayRecord: record }),
}))
