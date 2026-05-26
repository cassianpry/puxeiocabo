import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Report } from '@/types/api'

interface UseMyReportsParams {
  page?: number
  limit?: number
}

export function useMyReports({ page = 1, limit = 20 }: UseMyReportsParams = {}) {
  return useQuery<{ reports: Report[]; total: number; page: number; limit: number; totalPages: number }>({
    queryKey: ['reports', 'my', page, limit],
    queryFn: () => api(`/reports/my?page=${page}&limit=${limit}`),
    staleTime: 1000 * 60,
  })
}
