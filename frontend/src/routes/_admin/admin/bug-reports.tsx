import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AppPagination } from '@/components/app/Pagination'
import { useState } from 'react'
import type { PaginatedResponse } from '@/types/api'

interface BugReport {
  id: number
  subject: string
  description: string
  status: string
  createdAt: string
}

interface BugReportsSearch {
  status?: 'open' | 'resolved'
}

export const Route = createFileRoute('/_admin/admin/bug-reports')({
  validateSearch: (search: Record<string, string>): BugReportsSearch => ({
    status: search.status === 'open' || search.status === 'resolved' ? search.status : undefined,
  }),
  component: AdminBugReportsPage,
})

const LIMIT = 20

function AdminBugReportsPage() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { status: statusFilter } = useSearch({ from: '/_admin/admin/bug-reports' })
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery<PaginatedResponse<BugReport>>({
    queryKey: ['contact', 'bug-reports', page, statusFilter],
    queryFn: () => api<PaginatedResponse<BugReport>>(`/contact/bug-reports?page=${page}&limit=${LIMIT}${statusFilter ? `&status=${statusFilter}` : ''}`),
  })
  const [expanded, setExpanded] = useState<number | null>(null)

  const resolveMutation = useMutation({
    mutationFn: (id: number) =>
      api(`/contact/bug-reports/${id}/resolve`, { method: 'PATCH' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', 'bug-reports'] })
    },
  })

  const reports = data?.reports ?? []
  const totalPages = data?.totalPages ?? 1

  function handleStatusChange(value: string) {
    navigate({
      search: value === 'all' ? {} : { status: value },
      replace: true,
    })
    setPage(1)
    setExpanded(null)
  }

  function handlePageChange(p: number) {
    setPage(p)
    setExpanded(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Relatórios de Bug</h1>
        <p className="mt-1 text-muted-foreground">
          Reports de bug enviados pelos usuários.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Select value={statusFilter ?? 'all'} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Aberto</SelectItem>
            <SelectItem value="resolved">Resolvido</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <div className="space-y-3">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{report.subject}</CardTitle>
                      <Badge
                        variant="outline"
                        className={report.status === 'open' ? 'bg-red-700 text-white hover:bg-red-800 dark:bg-red-700 dark:hover:bg-red-800' : 'bg-green-700 text-white hover:bg-green-800 dark:bg-green-700 dark:hover:bg-green-800'}
                      >
                        {report.status === 'open' ? 'Aberto' : 'Resolvido'}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expanded === report.id ? 'Recolher' : 'Ver detalhes'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {new Date(report.createdAt).toLocaleString('pt-BR')}
                </p>
              </CardHeader>
              {expanded === report.id && (
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {report.description}
                  </p>
                  {report.status === 'open' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => resolveMutation.mutate(report.id)}
                      disabled={resolveMutation.isPending}
                    >
                      {resolveMutation.isPending ? 'Resolvendo...' : 'Marcar como resolvido'}
                    </Button>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum bug report recebido.</p>
      )}

      <AppPagination page={page} totalPages={totalPages} onPageChange={handlePageChange} className="mt-8" />
    </div>
  )
}
