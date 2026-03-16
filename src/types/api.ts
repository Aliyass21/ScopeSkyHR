// ─── Shared / Wrapper ─────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T | null
  succeeded: boolean
  errors: string[]
  isConflict: boolean
  isNotFound: boolean
}

export interface PaginationMeta {
  currentPage: number
  totalPages: number
  pageSize: number
  totalCount: number
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string
  password: string
  rememberMe: boolean
  deviceInfo?: string
  fcmDeviceToken?: string
}

export interface TokenResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: string  // ISO 8601
  refreshTokenExpiry: string
  tokenType: 'Bearer'
  scopes: string[]
  user: UserWithProfile
}

export interface UserProjectAccess {
  projectId: string
  projectName: string
  role: string
  isActive: boolean
  assignedAt: string
  assignedBy: string
}

// ─── Users ─────────────────────────────────────────────────────────────────────

export interface UserDto {
  id: string
  userName: string
  email: string
  phoneNumber: string | null
  isActive: boolean
  createdAt: string
  lastLoginAt: string | null
  timeZone: string
  projectAccesses: UserProjectAccess[]
  roles: string[]
  permissions: string[]
}

export interface UserWithProfile extends UserDto {
  profile: ProfileDto | null
}

// ─── Profiles / Employees ──────────────────────────────────────────────────────

export type Gender = 'Male' | 'Female'

export type ProfileType =
  | 'Employee'
  | 'Manager'
  | 'Supervisor'
  | 'HR'
  | 'Admin'

export type ShiftType = 'Fixed' | 'Flexible' | 'Rotating'

export interface WorkingHoursDto {
  shiftType: ShiftType
  startTime: string | null        // "HH:mm"
  endTime: string | null
  weeklyOffDays: number[]         // 0=Sunday … 6=Saturday
  weeklySchedule: Record<string, { start: string; end: string }> | null
}

export interface EmployeeDataDto {
  hireDate: string | null         // ISO date "YYYY-MM-DD"
  terminationDate: string | null
  isTerminated: boolean
  workingHours: WorkingHoursDto | null
}

export interface ProfileDto {
  id: string
  fullName: string
  gender: Gender
  employeeNumber: string
  phoneNumber: string | null
  address: string | null
  profileType: ProfileType
  locationNodeId: string | null
  locationName: string | null
  projectId: string
  projectName: string | null
  positionId: string | null
  positionTitle: string | null
  hasMultiSite: boolean
  employeeData: EmployeeDataDto | null
}
