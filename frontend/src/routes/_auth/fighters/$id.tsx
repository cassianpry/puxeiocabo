import { createFileRoute } from '@tanstack/react-router'
import { useFighter } from '@/hooks/useFighter'
import { FighterCard } from '@/components/app/FighterCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link } from '@tanstack/react-router'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Shield } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/_auth/fighters/$id')({
  component: FighterDetailPage,
})

function FighterDetailPage() {
  const { id } = Route.useParams()
  const { data: fighter, isLoading } = useFighter(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-24" />
        <div className="rounded-lg border p-6 space-y-3">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    )
  }

  if (!fighter) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Lutador não encontrado.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/fighters">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </Link>

      <FighterCard fighter={fighter} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Denúncias envolvendo este lutador
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Em breve: lista de denúncias onde este lutador foi denunciado.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
