import { useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'

export function useLogout() {
  const navigate = useNavigate()

  const logout = async (): Promise<void> => {
    try {
      await api('/auth/logout', { method: 'POST' })
    } catch {
      // Ignore errors during logout
    }
        queryClient.setQueryData(['auth', 'me'], null)
    navigate({ to: '/' })
  }

  return { logout }
}
