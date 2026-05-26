import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/_auth/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="space-y-4">Carregando...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="mt-1 text-muted-foreground">Gerencie sua conta.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações da conta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-muted-foreground">E-mail</Label>
            <div className="text-lg">{user?.email || '—'}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Criada em</Label>
            <div className="text-lg">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : '—'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
