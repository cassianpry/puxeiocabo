import { Badge } from '@/components/ui/badge'

interface StatusBadgeProps {
  status: string
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'Pendente', variant: 'secondary' },
  approved: { label: 'Aprovado', variant: 'default' },
  rejected: { label: 'Rejeitado', variant: 'destructive' },
  deleted: { label: 'Excluído', variant: 'outline' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, variant: 'outline' }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
