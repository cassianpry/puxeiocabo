import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Fighter } from '@/types/api'

interface FighterCardProps {
  fighter: Fighter
  onClick?: () => void
}

export function FighterCard({ fighter, onClick }: FighterCardProps) {
  return (
    <Card onClick={onClick} className="cursor-pointer transition-all duration-150 hover:ring-1 hover:ring-foreground/10">
      <CardHeader className="pb-3">
        <CardTitle>{fighter.platformName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div>Código de usuário: {fighter.shortId}</div>
          <div>Plataforma: {fighter.platformTool}</div>
          {fighter.fighterId && <div>Nome: {fighter.fighterId}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
