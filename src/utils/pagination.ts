import type { PaginationMeta } from '@/types/api'

/**
 * Parse the X-Pagination response header into a PaginationMeta object.
 * Handles both camelCase (documented) and PascalCase (actual .NET output).
 */
export function parsePaginationHeader(
  headers: Record<string, unknown>
): PaginationMeta | null {
  try {
    // Axios lowercases header names
    const raw = headers['x-pagination'] as string | undefined
    if (!raw) return null
    const p = JSON.parse(raw) as Record<string, unknown>
    return {
      currentPage: (p.currentPage ?? p.CurrentPage ?? 1) as number,
      totalPages:  (p.totalPages  ?? p.TotalPages  ?? 1) as number,
      pageSize:    (p.pageSize    ?? p.PageSize    ?? 10) as number,
      totalCount:  (p.totalCount  ?? p.TotalCount  ?? 0) as number,
    }
  } catch {
    return null
  }
}

export const DEFAULT_PAGE_SIZE = 20
