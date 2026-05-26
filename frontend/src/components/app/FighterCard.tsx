import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Fighter } from '@/types/api'

interface FighterCardProps {
  fighter: Fighter
  onClick?: () => void
}

export function FighterCard({ fighter, onClick }: FighterCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer">
      <CardHeader className="pb-3">
        <CardTitle>{fighter.platformName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>Short ID: {fighter.shortId}</div>
          <div>Plataforma: {fighter.platformTool}</div>
          {fighter.fighterId && <div>Nome: {fighter.fighterId}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
