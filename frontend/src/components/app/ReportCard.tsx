import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye } from 'lucide-react'
import type { Report } from '@/types/api'

interface ReportCardProps {
  report: Report
}

export function ReportCard({ report }: ReportCardProps) {
  return (
    <Card className="group overflow-hidden">
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer overflow-hidden">
            <img
              src={report.proofImagePath}
              alt="Prova"
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Eye className="size-8 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-7xl! *:data-[slot=dialog-close]:bg-black/80 *:data-[slot=dialog-close]:backdrop-blur-sm">
          <DialogTitle className="sr-only">Imagem de prova</DialogTitle>
          <img
            src={report.proofImagePath}
            alt="Prova"
            className="w-full max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>

      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium leading-tight text-center">
          {report.reporter.fighterId || report.reporter.shortId} → {report.reported.fighterId || report.reported.shortId}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed text-center">{report.comment}</p>
      </CardContent>

      <Separator />
      <CardFooter className="py-3 justify-center">
        <span className="text-xs text-muted-foreground">
          {new Date(report.createdAt).toLocaleDateString('pt-BR')}
        </span>
      </CardFooter>
    </Card>
  )
}
