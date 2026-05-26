import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useFlaggedReports } from '@/hooks/useFlaggedReports'
import { useAdminStats } from '@/hooks/useAdminStats'
import { EXIFIndicator } from '@/components/app/EXIFIndicator'
import { EXIFViewer } from '@/components/app/EXIFViewer'
import { StatusBadge } from '@/components/app/StatusBadge'
import { DataTable, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { ChevronDown, ChevronRight, CheckCircle2, XCircle, Trash2, User, Camera, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/flagged')({
  component: AdminFlaggedPage,
})

function AdminFlaggedPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useFlaggedReports({ page: 1, limit: 20 })
  const { data: stats } = useAdminStats()
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [adminComment, setAdminComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [moderating, setModerating] = useState<number | null>(null)

  function handleToggleExpand(id: number) {
    if (expandedId === id) {
      setExpandedId(null)
      setAdminComment('')
      setCommentError('')
    } else {
      setExpandedId(id)
      setAdminComment('')
      setCommentError('')
    }
  }

  async function handleModerate(id: number, status: 'approved' | 'rejected') {
    if (status === 'rejected' && !adminComment.trim()) {
      setCommentError('Comentário é obrigatório ao rejeitar uma denúncia.')
      return
    }

    setCommentError('')
    setModerating(id)

    try {
      await api(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, adminComment: adminComment.trim() || undefined }),
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success(status === 'approved' ? 'Denúncia aprovada com sucesso!' : 'Denúncia rejeitada com sucesso!')
      setExpandedId(null)
      setAdminComment('')
    } catch {
      toast.error('Erro ao moderar denúncia.')
    } finally {
      setModerating(null)
    }
  }

  async function handleDelete(id: number) {
    setModerating(id)
    try {
      await api(`/reports/${id}`, { method: 'DELETE' })
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Denúncia excluída com sucesso!')
      setExpandedId(null)
    } catch {
      toast.error('Erro ao excluir denúncia.')
    } finally {
      setModerating(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Denúncias Sinalizadas</h1>
          <p className="mt-1 text-muted-foreground">
            Denúncias marcadas pela IA para revisão.
            {stats && (
              <span className="ml-2 inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-500">
                {stats.flagged} sinalizada{stats.flagged !== 1 ? 's' : ''}
              </span>
            )}
          </p>
        </div>
        <Link to="/admin">
          <Button variant="outline" size="sm">
            ← Voltar ao Painel
          </Button>
        </Link>
      </div>

      <DataTable>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]"></TableHead>
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Denunciante</TableHead>
            <TableHead>Denunciado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[120px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-8 w-24" /></TableCell>
              </TableRow>
            ))
          )}
          {data?.reports.map((report) => (
            <>
              <TableRow key={report.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleToggleExpand(report.id)}
                  >
                    {expandedId === report.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium">
                  <Link to="/reports/$id" params={{ id: String(report.id) }}>
                    #{report.id}
                  </Link>
                </TableCell>
                <TableCell>{report.reporter.fighterId || report.reporter.shortId}</TableCell>
                <TableCell>{report.reported.fighterId || report.reported.shortId}</TableCell>
                <TableCell>
                  <StatusBadge status={report.status} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(report.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleExpand(report.id)}
                  >
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
              {expandedId === report.id && (
                <TableRow key={`expanded-${report.id}`}>
                  <TableCell colSpan={7} className="p-0">
                    <div className="border-t border-l-2 border-l-arcade-blue bg-muted/20 p-6 space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                            <User className="h-3.5 w-3.5" />
                            Denunciante
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {report.reporter.fighterId || report.reporter.shortId}
                            <span className="ml-2 text-xs">({report.reporter.platformName})</span>
                          </p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                            <User className="h-3.5 w-3.5" />
                            Denunciado
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {report.reported.fighterId || report.reported.shortId}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-1">Comentário</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{report.comment}</p>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                          <Camera className="h-3.5 w-3.5" />
                          Imagem de prova
                        </h4>
                        <img
                          src={report.proofImagePath}
                          alt="Prova"
                          className="w-full max-h-[300px] object-contain rounded-md border bg-muted/30"
                        />
                      </div>

                      {report.aiSuspicious && (
                        <div className="flex items-start gap-2 rounded-md bg-amber-500/10 p-3 text-sm">
                          <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-500 shrink-0" />
                          <div>
                            <span className="font-medium text-amber-500">Sinalizado pela IA</span>
                            {report.aiReason && (
                              <p className="text-muted-foreground mt-1">{report.aiReason}</p>
                            )}
                          </div>
                        </div>
                      )}

                      {report.exifData && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Dados EXIF</h4>
                          <EXIFViewer exifData={report.exifData} />
                        </div>
                      )}

                      <Separator />

                      <div className="space-y-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="adminComment">Comentário do admin</Label>
                          <Textarea
                            id="adminComment"
                            placeholder="Motivo da rejeição (obrigatório ao rejeitar)"
                            value={adminComment}
                            onChange={(e) => {
                              setAdminComment(e.target.value)
                              if (commentError) setCommentError('')
                            }}
                            rows={3}
                          />
                          {commentError && (
                            <p className="text-sm text-destructive">{commentError}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            className="text-green-500 border-green-500/30 hover:bg-green-500/10"
                            variant="outline"
                            onClick={() => handleModerate(report.id, 'approved')}
                            disabled={moderating === report.id}
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            className="text-red-500 border-red-500/30 hover:bg-red-500/10"
                            variant="outline"
                            onClick={() => handleModerate(report.id, 'rejected')}
                            disabled={moderating === report.id}
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" />
                            Rejeitar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(report.id)}
                            disabled={moderating === report.id}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </DataTable>

      {data?.reports.map((report) => (
        <div key={report.id} className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Denúncia #{report.id} — Dados EXIF
          </h3>
          {report.aiSuspicious && (
            <EXIFIndicator aiSuspicious={report.aiSuspicious} aiReason={report.aiReason || ''} />
          )}
          {report.exifData ? (
            <EXIFViewer exifData={report.exifData} />
          ) : (
            <p className="text-sm text-muted-foreground">Sem dados EXIF disponíveis.</p>
          )}
        </div>
      ))}
    </div>
  )
}
