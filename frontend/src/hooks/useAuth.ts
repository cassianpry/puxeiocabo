import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import type { User } from '@/types/api'

export interface UseAuthReturn {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
}

export function useAuth(): UseAuthReturn {
  const { data: user, isLoading, error } = useQuery<User | null>({
    queryKey: ['auth', 'me'],
    queryFn: () => api<User>('/auth/me'),
    retry: false,
    staleTime: 1000 * 60 * 5,
  })

  return {
    user: user ?? null,
    isLoading,
    isAuthenticated: !!user && !error,
    isAdmin: user?.role === 'admin',
  }
}
