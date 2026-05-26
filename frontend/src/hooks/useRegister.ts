import { useNavigate } from '@tanstack/react-router'
import { apiJson } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'

export interface RegisterInput {
  email: string
  password: string
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
