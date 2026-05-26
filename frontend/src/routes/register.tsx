import { createFileRoute, redirect, Link } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { getPostAuthPath } from '@/lib/admin-routing'
import { useRegister } from '@/hooks/useRegister'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/register')({
  beforeLoad: async () => {
    const user = await api<{ role: string }>('/auth/me').catch(() => null)
    if (user) {
      throw redirect({ to: getPostAuthPath(user.role) })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { register } = useRegister()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await register({ email, password })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar conta')
      setError(err instanceof Error ? err.message : 'Erro ao criar conta')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="mt-2 text-muted-foreground">Preencha os dados para criar sua conta.</p>
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
            {isSubmitting ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
