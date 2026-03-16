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

// ─── Attendance ────────────────────────────────────────────────────────────────

export type AttendanceStatus =
  | 'Present'
  | 'Absent'
  | 'Holiday'
  | 'WeeklyOff'
  | 'Leave'
  | 'Late'
  | 'EarlyDeparture'
  | 'HalfDay'

export type CheckInType = 'CheckIn' | 'CheckOut'

export type CheckInStatus = 'Pending' | 'Completed' | 'Skipped'

export interface CheckInRecordDto {
  id: string
  attendanceRecordId: string
  profileId: string
  scheduledTime: string | null   // ISO datetime
  checkInTime: string | null
  type: CheckInType
  status: CheckInStatus
  latitude: number | null
  longitude: number | null
  address: string | null
}

export interface AttendanceRecordDto {
  id: string
  profileId: string
  date: string                   // "YYYY-MM-DD"
  status: AttendanceStatus
  totalWorkingHours: string | null  // TimeSpan as "HH:mm:ss"
  notes: string | null
  isReviewed: boolean
  isConfirmed: boolean
  isWorkingDay: boolean
  checkIns: CheckInRecordDto[]
}

export interface FaceVerificationResult {
  success: boolean
  match: boolean
  similarityScore: number
  threshold: number
  confidenceLevel: string
  facesDetected: number
  serviceMessage: string | null
  error: string | null
  userId: string | null
  username: string | null
}

export interface InitiateCheckInResponse {
  checkInRecordId: string
  profileId: string
  status: 'QueuedForCompletion' | 'Rejected'
  message: string
  serverTimeUtc: string
  verification: FaceVerificationResult
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface ProjectDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
}

export interface ProjectLookupDto {
  id: string
  name: string
}

// ─── Location Nodes ───────────────────────────────────────────────────────────

export interface LocationNodeDto {
  id: string
  name: string
  projectId: string
  parentNodeId: string | null
  level: number
  nodeType: string
  isActive: boolean
}

export interface LocationNodeMinimalDto {
  id: string
  name: string
  nodeType: string
  level: number
  parentNodeId: string | null
}

export interface GeographicalZoneDto {
  id: string
  locationNodeId: string
  latitude: number
  longitude: number
  radiusMeters: number
}

// ─── Leave ────────────────────────────────────────────────────────────────────

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled'

export interface LeaveTypeDto {
  id: string
  name: string
  code: string
  description: string | null
  maxDaysPerRequest: number
  requiresDocument: boolean
  requiresReplacement: boolean
  defaultAllowedDaysPerMonth: number
  isAutoAllocatedMonthly: boolean
  maxAccumulatedDays: number
  canCarryForward: boolean
  isActive: boolean
}

export interface LeaveRequestDto {
  id: string
  profileId: string
  leaveTypeId: string
  leaveTypeName: string
  startDate: string              // "YYYY-MM-DD"
  endDate: string
  status: LeaveStatus
  reason: string | null
  isShortTimeLeave: boolean
  rejectionReason: string | null
  createdAt: string
}

export interface EmployeeLeaveBalanceDto {
  id: string
  profileId: string
  leaveTypeId: string
  leaveTypeName: string
  year: number
  month: number | null
  allowedDays: number
  usedDays: number
  remainingDays: number
}

// ─── Positions ────────────────────────────────────────────────────────────────

export interface PositionDto {
  id: string
  title: string
  description: string | null
  isActive: boolean
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface NotificationDto {
  id: string
  title: string
  message: string
  type: string
  isRead: boolean
  createdAt: string
}

// ─── Roles & Permissions ──────────────────────────────────────────────────────

export interface PermissionDto {
  id: string
  code: string
  displayName: string
  description: string | null
  category: string
  isActive: boolean
}

export interface ApplicationRoleDto {
  id: string
  name: string
  description: string | null
  isActive: boolean
}

export type SystemRole =
  | 'SuperAdmin'
  | 'Admin'
  | 'ProjectAdmin'
  | 'HRManager'
  | 'LocationManager'
  | 'Supervisor'
  | 'Employee'
  | 'HR'
  | 'HRUser'
  | 'Auditor'

// ─── Public Holidays ─────────────────────────────────────────────────────────

export interface PublicHolidayDto {
  id: string
  name: string
  date: string                   // "YYYY-MM-DD"
  locationNodeId: string | null
  isActive: boolean
}

// ─── Statistics (Dashboard) ──────────────────────────────────────────────────

export interface ProfileStatisticsDto {
  totalProfiles: number
  activeProfiles: number
  inactiveProfiles: number
  terminatedProfiles: number
  byProfileType: Record<ProfileType, number>
  byLocation: Array<{ locationName: string; locationNodeId: string; count: number }>
  byPosition: Array<{ positionTitle: string; positionId: string; count: number }>
  recentHires: number
}

export interface AttendanceStatisticsDto {
  totalRecords: number
  byStatus: Record<AttendanceStatus, number>
  averageWorkingHoursPerDay: number
  lateArrivals: number
  absentCount: number
  presentCount: number
}

// ─── Mutation Request Bodies ──────────────────────────────────────────────────

export interface CreateUserWithProfileDto {
  username: string
  password: string
  fullName: string
  gender: Gender
  phoneNumber: string | null
  address: string | null
  employeeNumber: string
  hireDate: string | null
  locationNodeId: string | null
  positionId: string | null
  timeZone: string
  profileType: ProfileType
  projectId: string
  role: string
  shiftType: ShiftType
  weeklyOffDays: number[]
  hasMultiSite: boolean
}

export interface CreateLeaveRequestDto {
  profileId: string
  leaveTypeId: string
  startDate: string
  endDate: string
  reason: string | null
  isShortTimeLeave: boolean
  replacementEmployeeId: string | null
  documentPath: string | null
}
