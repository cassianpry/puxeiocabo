import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: () => api('/auth/delete-account', { method: 'POST' }),
    onSuccess: () => {
      queryClient.setQueryData(['auth', 'me'], null)
      navigate({ to: '/' })
      toast.success('Conta excluída com sucesso.')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao excluir conta')
    },
  })
}
