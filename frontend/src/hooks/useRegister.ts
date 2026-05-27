import { useNavigate } from '@tanstack/react-router'
import { apiJson } from '@/lib/api'
import { getPostAuthPath } from '@/lib/admin-routing'
import { queryClient } from '@/lib/queryClient'
import { trackEvent } from '@/hooks/useAnalytics'

export interface RegisterInput {
  email: string
  password: string
  consent: boolean
}

export interface RegisterResult {
  accountId: number
  shortId: string | null
  role: string
}

export function useRegister() {
  const navigate = useNavigate()

  const register = async (data: RegisterInput): Promise<RegisterResult> => {
    const result = await apiJson<RegisterResult>('/auth/register', data as unknown as Record<string, unknown>)
    trackEvent('register')
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    navigate({ to: getPostAuthPath(result.role) })
    return result
  }

  return { register }
}

export interface RegisterResult {
  accountId: number
  shortId: string | null
}

export function useRegister() {
  const navigate = useNavigate()

  const register = async (data: RegisterInput): Promise<RegisterResult> => {
    const result = await apiJson<RegisterResult>('/auth/register', data as unknown as Record<string, unknown>)
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    navigate({ to: '/dashboard' })
    return result
  }

  return { register }
}
