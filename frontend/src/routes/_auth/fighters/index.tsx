import { createFileRoute } from '@tanstack/react-router'
import { useFighterSearch } from '@/hooks/useFighterSearch'
import { FighterCard } from '@/components/app/FighterCard'
import { Link } from '@tanstack/react-router'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/fighters/')({
  component: FightersPage,
})

function FightersPage() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useFighterSearch(search)
  const fighters = data?.fighters ?? []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Lutadores</h1>
        <p className="mt-1 text-muted-foreground">Busque lutadores por nome ou short_id.</p>
      </div>

      <div className="max-w-md space-y-2">
        <Label htmlFor="search">Buscar lutador</Label>
        <Input
          id="search"
          placeholder="Nome ou short_id..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border p-6 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && fighters.length === 0 && search.length > 1 && (
        <Alert>
          <AlertDescription>Nenhum lutador encontrado.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fighters.map((fighter) => (
          <Link
            key={fighter.shortId}
            to="/fighters/$id"
            params={{ id: fighter.shortId }}
            className="block"
          >
            <FighterCard fighter={fighter} />
          </Link>
        ))}
      </div>
    </div>
  )
}
