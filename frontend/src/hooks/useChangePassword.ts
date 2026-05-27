import { useMutation } from '@tanstack/react-query'
import { apiJson } from '@/lib/api'
import { trackEvent } from '@/hooks/useAnalytics'

interface ChangePasswordParams {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (params: ChangePasswordParams) =>
      apiJson('/auth/change-password', params as unknown as Record<string, unknown>),
    onSuccess: () => {
      trackEvent('password_changed')
    },
  })
}
