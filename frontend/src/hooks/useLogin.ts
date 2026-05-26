import { useNavigate } from '@tanstack/react-router'
import { apiJson } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { getPostAuthPath } from '@/lib/admin-routing'

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  accountId: number
  shortId: string | null
  role: string
}

export function useLogin() {
  const navigate = useNavigate()

  const login = async (data: LoginInput): Promise<LoginResult> => {
    const result = await apiJson<LoginResult>('/auth/login', data as unknown as Record<string, unknown>)
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    navigate({ to: getPostAuthPath(result.role) })
    return result
  }

  return { login }
}
