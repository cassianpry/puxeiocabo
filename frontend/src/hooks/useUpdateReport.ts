import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFormData } from '@/lib/api'

interface UpdateReportParams {
  id: number
  comment: string
  proof?: File
}

export function useUpdateReport() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, comment, proof }: UpdateReportParams) => {
      const formData = new FormData()
      formData.append('comment', comment)
      if (proof) {
        formData.append('proof', proof)
      }
      return apiFormData(`/reports/${id}`, formData, { method: 'PATCH' })
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports', 'my'] })
      queryClient.invalidateQueries({ queryKey: ['reports', String(variables.id)] })
    },
  })
}
