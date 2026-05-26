import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { Fighter } from '@/types/api'

export function useFighter(shortId: string) {
  return useQuery<Fighter>({
    queryKey: ['fighters', shortId],
    queryFn: () => api(`/fighters/${shortId}`),
    staleTime: 1000 * 60,
    enabled: !!shortId,
  })
}
