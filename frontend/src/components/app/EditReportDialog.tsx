import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { X, Save } from 'lucide-react'
import { ImageUpload } from './ImageUpload'
import { useUpdateReport } from '@/hooks/useUpdateReport'
import { toast } from 'sonner'
import type { Report } from '@/types/api'

interface EditReportDialogProps {
  report: Report
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditReportDialog({ report, open, onOpenChange }: EditReportDialogProps) {
  const [comment, setComment] = useState(report.comment)
  const [newProof, setNewProof] = useState<File | null>(null)
  const { mutateAsync: updateReport, isPending } = useUpdateReport()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await updateReport({ id: report.id, comment, proof: newProof ?? undefined })
      toast.success('Denúncia atualizada com sucesso!')
      onOpenChange(false)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar denúncia')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Editar Denúncia #{report.id}</DialogTitle>
          <DialogDescription>
            Atualize o comentário ou substitua a imagem de prova.
          </DialogDescription>
        </DialogHeader>
        {report.adminComment && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm space-y-1">
            <span className="font-medium text-destructive">Motivo da rejeição:</span>
            <p className="text-muted-foreground">{report.adminComment}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Comentário</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Imagem de prova atual</Label>
            <img
              src={report.proofImagePath}
              alt="Prova atual"
              className="w-full max-h-[200px] object-contain rounded-md border bg-muted/30"
            />
          </div>
          <div className="space-y-2">
            <Label>Substituir imagem (opcional)</Label>
            <ImageUpload onChange={setNewProof} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar<X />
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar'}
              {!isPending && <Save />}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
