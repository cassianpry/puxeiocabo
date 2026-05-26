import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useFlaggedReports } from '@/hooks/useFlaggedReports'
import { useAdminStats } from '@/hooks/useAdminStats'
import { EXIFIndicator } from '@/components/app/EXIFIndicator'
import { EXIFViewer } from '@/components/app/EXIFViewer'
import { ReportActions } from '@/components/app/ReportActions'
import { StatusBadge } from '@/components/app/StatusBadge'
import { DataTable, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/_admin/admin/flagged')({
  component: AdminFlaggedPage,
})

function AdminFlaggedPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useFlaggedReports({ page: 1, limit: 20 })
  const { data: stats } = useAdminStats()

  async function handleApprove(id: number) {
    try {
      await api(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'approved' }),
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Denúncia aprovada com sucesso!')
    } catch {
      toast.error('Erro ao aprovar denúncia.')
    }
  }

  async function handleReject(id: number) {
    try {
      await api(`/reports/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'rejected' }),
      })
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Denúncia rejeitada com sucesso!')
    } catch {
      toast.error('Erro ao rejeitar denúncia.')
    }
  }

  async function handleDelete(id: number) {
    try {
      await api(`/reports/${id}`, { method: 'DELETE' })
      queryClient.invalidateQueries({ queryKey: ['admin', 'flagged'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
      toast.success('Denúncia excluída com sucesso!')
    } catch {
      toast.error('Erro ao excluir denúncia.')
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
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Denunciante</TableHead>
            <TableHead>Denunciado</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-[220px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                <TableCell><Skeleton className="h-8 w-48" /></TableCell>
              </TableRow>
            ))
          )}
          {data?.reports.map((report) => (
            <TableRow key={report.id}>
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
                <ReportActions
                  reportId={report.id}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onDelete={handleDelete}
                />
              </TableCell>
            </TableRow>
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
