export type AttendanceStatus = 'present' | 'absent' | 'late' | 'holiday' | 'weekend'

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  workHours?: number
}

export interface ClockEvent {
  employeeId: string
  type: 'in' | 'out'
  timestamp: string
  method: 'manual' | 'face'
}
