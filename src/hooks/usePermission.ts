import { useMemo } from 'react'
import { useAuthStore } from '@/store/authStore'
import { parseTokenClaims } from '@/utils/permissions'

/** Returns { roles, permissions } parsed from the JWT access token claims. */
export function useTokenClaims() {
  const accessToken = useAuthStore((s) => s.accessToken)
  return useMemo(() => parseTokenClaims(accessToken), [accessToken])
}

/** Returns true if the logged-in user has the given permission code. */
export function useHasPermission(code: string): boolean {
  const { permissions } = useTokenClaims()
  return permissions.includes(code)
}

/** Returns true if the logged-in user has the given role. */
export function useHasRole(role: string): boolean {
  const { roles } = useTokenClaims()
  return roles.includes(role)
}

/** Returns true if the user is a SuperAdmin or Admin (full access). */
export function useIsAdmin(): boolean {
  const { roles } = useTokenClaims()
  return roles.includes('SuperAdmin') || roles.includes('Admin')
}
