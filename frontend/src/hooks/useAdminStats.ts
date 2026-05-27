import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface AdminStats {
  total: number
  pending: number
  approved: number
  rejected: number
  flagged: number
  fighterCount: number
  openBugReports: number
  resolvedBugReports: number
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => api('/reports/stats'),
    staleTime: 1000 * 60 * 5,
  })
}
