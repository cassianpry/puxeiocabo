import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiJson } from '@/lib/api'

export function useLinkShortId() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (shortId: string) =>
      apiJson<{ shortId: string }>('/auth/link', { shortId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] })
    },
  })

  return {
    linkShortId: mutation.mutateAsync,
    isLinking: mutation.isPending,
    error: mutation.error,
  }
}
