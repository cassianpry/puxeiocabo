import { TableCell, TableRow } from '@/components/ui/table'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from './StatusBadge'
import type { Report } from '@/types/api'

interface ReportRowProps {
  report: Report
  actions?: React.ReactNode
}

export function ReportRow({ report, actions }: ReportRowProps) {
  const date = new Date(report.createdAt).toLocaleDateString('pt-BR')

  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link to="/reports/$id" params={{ id: String(report.id) }}>
          #{report.id}
        </Link>
      </TableCell>
      <TableCell>{report.reporter.platformName}</TableCell>
      <TableCell>{report.reported.fighterId ?? `(${report.reported.shortId})`}</TableCell>
      <TableCell>
        <StatusBadge status={report.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">{date}</TableCell>
      {actions && <TableCell>{actions}</TableCell>}
    </TableRow>
  )
}
