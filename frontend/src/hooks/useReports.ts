import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Report } from '@/types/api'

interface UseReportsParams {
  page?: number
  limit?: number
}

export function useReports({ page = 1, limit = 20 }: UseReportsParams = {}) {
  return useQuery<{ reports: Report[]; total: number; page: number; limit: number; totalPages: number }>({
    queryKey: ['reports', 'all', page, limit],
    queryFn: () => api(`/reports?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60,
  })
}
