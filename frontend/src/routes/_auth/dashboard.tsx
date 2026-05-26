import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useMyReports } from '@/hooks/useMyReports'
import { DataTable, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ReportRow } from '@/components/app/ReportRow'
import { EditReportDialog } from '@/components/app/EditReportDialog'
import type { Report } from '@/types/api'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading } = useMyReports({ page: 1, limit: 20 })
  const [editingReport, setEditingReport] = useState<Report | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel</h1>
          <p className="mt-1 text-muted-foreground">Suas denúncias recentes aparecerão aqui.</p>
        </div>
        <Link to="/reports/new">
          <Button>Nova Denúncia</Button>
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
            <TableHead className="w-[100px]">Ações</TableHead>
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
                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              </TableRow>
            ))
          )}
          {data?.reports.map((report) => (
            <ReportRow
              key={report.id}
              report={report}
              actions={
                report.status === 'rejected' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingReport(report)}
                  >
                    Editar
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )
              }
            />
          ))}
        </TableBody>
      </DataTable>

      {editingReport && (
        <EditReportDialog
          report={editingReport}
          open
          onOpenChange={(open) => { if (!open) setEditingReport(null) }}
        />
      )}
    </div>
  )
}
