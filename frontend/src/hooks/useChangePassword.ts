import { useMutation } from '@tanstack/react-query'
import { apiJson } from '@/lib/api'

interface ChangePasswordParams {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordParams) =>
      apiJson('/auth/change-password', params as Record<string, unknown>),
  })
}
