import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { FighterSearchCombobox } from '@/components/app/FighterSearchCombobox'
import { ImageUpload } from '@/components/app/ImageUpload'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { toast } from 'sonner'
import { apiFormData } from '@/lib/api'
import type { Fighter } from '@/types/api'

export const Route = createFileRoute('/_auth/reports/new')({
  component: NewReportPage,
})

function NewReportPage() {
  const navigate = useNavigate()
  const [reported, setReported] = useState<Fighter | null>(null)
  const [comment, setComment] = useState('')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!reported) {
      setError('Selecione um lutador para denunciar.')
      return
    }
    if (!proofFile) {
      setError('Envie uma imagem de prova.')
      return
    }
    setError(null)
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('reportedId', reported.shortId)
      formData.append('comment', comment)
      formData.append('proof', proofFile)
      await apiFormData('/reports', formData)
      toast.success('Denúncia enviada com sucesso!')
      navigate({ to: '/dashboard' })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar denúncia')
      setError(err instanceof Error ? err.message : 'Erro ao enviar denúncia')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nova Denúncia</h1>
        <p className="mt-1 text-muted-foreground">Envie uma denúncia de rage-quit com prova.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
        <div className="space-y-2">
          <Label>Lutador denunciado</Label>
          <FighterSearchCombobox onSelect={setReported} />
        </div>

        <div className="space-y-2">
          <Label>Comentário</Label>
          <Textarea
            placeholder="Descreva o ocorrido..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Imagem de prova</Label>
          <ImageUpload onChange={setProofFile} />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar denúncia'}
        </Button>
      </form>
    </div>
  )
}
