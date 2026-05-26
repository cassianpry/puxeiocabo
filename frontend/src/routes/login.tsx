import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { getPostAuthPath } from '@/lib/admin-routing'
import { useLogin } from '@/hooks/useLogin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/login')({
  beforeLoad: async () => {
    const user = await api<{ role: string }>('/auth/me').catch(() => null)
    if (user) {
      throw redirect({ to: getPostAuthPath(user.role) })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const { login } = useLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login({ email, password })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao fazer login')
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="mt-2 text-muted-foreground">Insira suas credenciais para continuar.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  )
}
