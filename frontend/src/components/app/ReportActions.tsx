import { Button } from '@/components/ui/button'
import { CheckCircle2, XCircle, Trash2 } from 'lucide-react'

interface ReportActionsProps {
  reportId: number
  onApprove: (id: number) => void
  onReject: (id: number) => void
  onDelete: (id: number) => void
}

export function ReportActions({ reportId, onApprove, onReject, onDelete }: ReportActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-green-500 border-green-500/30 hover:bg-green-500/10"
        onClick={() => onApprove(reportId)}
      >
        Aprovar
        <CheckCircle2 className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-red-500 border-red-500/30 hover:bg-red-500/10"
        onClick={() => onReject(reportId)}
      >
        Rejeitar
        <XCircle className="h-3.5 w-3.5" />
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="h-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
        onClick={() => onDelete(reportId)}
      >
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
