import { mockDelay } from '@/utils/mockDelay'
import rawData from '@/data/attendance.json'
import type { AttendanceRecord } from '@/types/attendance'

let store: AttendanceRecord[] = rawData as AttendanceRecord[]
let nextId = store.length + 1

export async function getAttendanceRecords(employeeId?: string): Promise<AttendanceRecord[]> {
  await mockDelay()
  if (employeeId) return store.filter((r) => r.employeeId === employeeId)
  return [...store]
}

export async function getMonthlyAttendance(employeeId: string, year: number, month: number): Promise<AttendanceRecord[]> {
  await mockDelay()
  const prefix = `${year}-${String(month).padStart(2, '0')}`
  return store.filter((r) => r.employeeId === employeeId && r.date.startsWith(prefix))
}

export async function clockIn(employeeId: string): Promise<AttendanceRecord> {
  await mockDelay()
  const today = new Date().toISOString().split('T')[0]
  const existing = store.find((r) => r.employeeId === employeeId && r.date === today)
  if (existing) throw new Error('Already clocked in')

  const now = new Date()
  const checkIn = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
  const hour = now.getHours()
  const status = hour >= 9 ? 'late' : 'present'

  const record: AttendanceRecord = {
    id: `ATT-${String(nextId++).padStart(4, '0')}`,
    employeeId,
    date: today,
    status,
    checkIn,
  }
  store = [...store, record]
  return record
}

export async function clockOut(employeeId: string): Promise<AttendanceRecord> {
  await mockDelay()
  const today = new Date().toISOString().split('T')[0]
  const existing = store.find((r) => r.employeeId === employeeId && r.date === today)
  if (!existing) throw new Error('Not clocked in')

  const now = new Date()
  const checkOut = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const [inH, inM] = (existing.checkIn ?? '08:00').split(':').map(Number)
  const workHours = Math.round(((now.getHours() * 60 + now.getMinutes()) - (inH * 60 + inM)) / 60 * 100) / 100

  const updated = { ...existing, checkOut, workHours }
  store = store.map((r) => (r.id === existing.id ? updated : r))
  return updated
}
