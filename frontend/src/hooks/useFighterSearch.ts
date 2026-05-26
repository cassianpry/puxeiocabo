import { useQuery } from '@tanstack/react-query'
import { useDebounce } from './useDebounce'
import { api } from '@/lib/api'
import type { Fighter } from '@/types/api'

export function useFighterSearch(query: string) {
  const debouncedQuery = useDebounce(query, 300)

  return useQuery<{ fighters: Fighter[] }>({
    queryKey: ['fighters', 'search', debouncedQuery],
    queryFn: () => api(`/fighters?q=${encodeURIComponent(debouncedQuery)}`),
    enabled: debouncedQuery.length > 1,
    staleTime: 1000 * 60,
  })
}
