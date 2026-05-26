import { createFileRoute, redirect } from '@tanstack/react-router'
import { useReport } from '@/hooks/useReport'
import { EXIFIndicator } from '@/components/app/EXIFIndicator'
import { StatusBadge } from '@/components/app/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Camera, Calendar, User } from 'lucide-react'

export const Route = createFileRoute('/_auth/reports/$id')({
  beforeLoad: async () => {
    const auth = await fetch('/auth/me', { credentials: 'include' }).then(r => r.json()).catch(() => null)
    if (!auth) {
      throw redirect({ to: '/login' })
    }
  },
  component: ReportDetailPage,
})

function ReportDetailPage() {
  const { id } = Route.useParams()
  const { data: report, isLoading } = useReport(id)

  if (isLoading) {
    return <div className="space-y-4">Carregando...</div>
  }

  if (!report) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Denúncia não encontrada.</AlertDescription>
      </Alert>
    )
  }

  const date = new Date(report.createdAt).toLocaleDateString('pt-BR')

  return (
    <div className="space-y-6">
      <Link to="/dashboard">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Denúncia #{report.id}</h1>
          <StatusBadge status={report.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Denunciante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{report.reporter.platformName}</div>
            <div className="text-sm text-muted-foreground">ID: {report.reporter.shortId}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Denunciado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg">{report.reported.fighterId ?? `(${report.reported.shortId})`}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Comentário</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap">{report.comment}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Camera className="h-4 w-4" />
            Imagem de prova
          </CardTitle>
        </CardHeader>
        <CardContent>
          <img
            src={report.proofImagePath}
            alt="Prova"
            className="w-full max-h-[400px] object-contain rounded-md border bg-muted/30"
          />
        </CardContent>
      </Card>

      {report.aiSuspicious && (
        <EXIFIndicator aiSuspicious={report.aiSuspicious} aiReason={report.aiReason || ''} />
      )}

      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Criada em {date}
      </div>
    </div>
  )
}
