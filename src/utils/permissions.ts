/**
 * Permission code constants matching the backend permission system.
 * Use these instead of magic strings when checking user permissions.
 */
export const PERMISSIONS = {
  // Users
  CREATE_USER: 'U1',
  EDIT_USER: 'U2',
  DELETE_USER: 'U3',
  VIEW_USER: 'U4',
  ASSIGN_ROLES: 'U5',
  // Attendance
  VIEW_ATTENDANCE: 'A1',
  EDIT_ATTENDANCE: 'A2',
  MANAGE_ATTENDANCE_EXCEPTIONS: 'A3',
  GENERATE_ATTENDANCE_REPORTS: 'A4',
  REVIEW_ATTENDANCE: 'A5',
  CONFIRM_ATTENDANCE: 'A6',
  // Projects
  CREATE_PROJECT: 'P1',
  EDIT_PROJECT: 'P2',
  DELETE_PROJECT: 'P3',
  VIEW_PROJECT: 'P4',
  // Leave
  VIEW_LEAVE_REQUESTS: 'L1',
  APPROVE_LEAVE_REQUESTS: 'L2',
  MANAGE_LEAVE_TYPES: 'L3',
  MANAGE_LEAVE_BALANCES: 'L4',
  // Employees
  CREATE_EMPLOYEE: 'E1',
  EDIT_EMPLOYEE: 'E2',
  DELETE_EMPLOYEE: 'E3',
  VIEW_EMPLOYEE: 'E4',
  MANAGE_EMPLOYEE_FACE: 'E5',
  // Organization
  CREATE_LOCATION: 'O1',
  EDIT_LOCATION: 'O2',
  DELETE_LOCATION: 'O3',
  VIEW_LOCATION: 'O4',
  MANAGE_LOCATION_ZONES: 'O5',
  // System
  MANAGE_SYSTEM_CONFIG: 'S1',
  VIEW_SYSTEM_CONFIG: 'S2',
  MANAGE_AUDIT_LOGS: 'S3',
  VIEW_REPORTS: 'S4',
  // Holidays
  CREATE_PUBLIC_HOLIDAY: 'H1',
  EDIT_PUBLIC_HOLIDAY: 'H2',
  DELETE_PUBLIC_HOLIDAY: 'H3',
  VIEW_PUBLIC_HOLIDAY: 'H4',
} as const

export type PermissionCode = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]

/**
 * Decode the JWT access token and extract roles + permissions.
 *
 * The backend encodes roles as a single string ("SuperAdmin") and
 * permissions as a comma-separated string ("P1,P2,A1,...") in the
 * JWT claims, rather than in the UserDto response body.
 */
export function parseTokenClaims(accessToken: string | null): {
  roles: string[]
  permissions: string[]
} {
  if (!accessToken) return { roles: [], permissions: [] }
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1])) as Record<string, unknown>

    const roles =
      typeof payload.roles === 'string'
        ? payload.roles.split(',').map((r) => r.trim()).filter(Boolean)
        : Array.isArray(payload.roles)
        ? (payload.roles as string[])
        : []

    const permissions =
      typeof payload.perms === 'string'
        ? payload.perms.split(',').map((p) => p.trim()).filter(Boolean)
        : Array.isArray(payload.perms)
        ? (payload.perms as string[])
        : []

    return { roles, permissions }
  } catch {
    return { roles: [], permissions: [] }
  }
}
