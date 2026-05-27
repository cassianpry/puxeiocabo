import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { toast } from 'sonner'

export function useExportData() {
  return useMutation({
    mutationFn: () => api('/auth/export'),
    onSuccess: (data: unknown) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `meus-dados-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Dados exportados com sucesso.')
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Erro ao exportar dados')
    },
  })
}
