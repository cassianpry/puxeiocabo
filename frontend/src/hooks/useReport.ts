import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Report } from '@/types/api'

export function useReport(id: string) {
  return useQuery<Report>({
    queryKey: ['reports', id],
    queryFn: () => api(`/reports/${id}`),
    staleTime: 1000 * 60,
    enabled: !!id,
  })
}
