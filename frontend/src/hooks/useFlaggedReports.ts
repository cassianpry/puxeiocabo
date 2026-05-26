import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Report } from '@/types/api'

interface UseFlaggedReportsParams {
  page?: number
  limit?: number
}

export function useFlaggedReports({ page = 1, limit = 20 }: UseFlaggedReportsParams = {}) {
  return useQuery<{ reports: Report[]; total: number; page: number; limit: number; totalPages: number }>({
    queryKey: ['admin', 'flagged', page, limit],
    queryFn: () => api(`/reports/flagged?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60,
  })
}
