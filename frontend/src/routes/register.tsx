import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { api, apiJson } from "@/lib/api";
import { getPostAuthPath } from "@/lib/admin-routing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { Mail, Eye, EyeOff, CheckCircle2, UserPlus } from "lucide-react";

export const Route = createFileRoute("/register")({
  beforeLoad: async () => {
    const user = await api<{ role: string }>("/auth/me").catch(() => null);
    if (user) {
      throw redirect({ to: getPostAuthPath(user.role) });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [consent, setConsent] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não conferem.");
      return;
    }

    if (!consent) {
      setError("Você precisa aceitar a Política de Privacidade.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await apiJson<{ email: string }>("/auth/register", { email, password, consent: true });
      setRegisteredEmail(result.email);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (registeredEmail) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm text-center space-y-6">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
          <h1 className="text-2xl font-bold">Conta criada!</h1>
          <p className="text-muted-foreground">
            Enviamos um e-mail de confirmação para{" "}
            <strong className="text-foreground">{registeredEmail}</strong>.
            Verifique sua caixa de entrada e clique no link para ativar sua conta.
          </p>
          <p className="text-sm text-muted-foreground">
            Não recebeu?{" "}
            <button
              type="button"
              onClick={() => setRegisteredEmail(null)}
              className="underline underline-offset-4 hover:text-foreground transition-colors"
            >
              Tentar novamente
            </button>
          </p>
          <Link
            to="/login"
            className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="mt-2 text-muted-foreground">
            Preencha os dados para criar sua conta.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pr-10"
                required
              />
              <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo de 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Reppita a senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input
              id="consent"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-muted-foreground bg-background text-primary focus:ring-primary"
              required
            />
            <Label htmlFor="consent" className="text-sm text-muted-foreground leading-relaxed cursor-pointer">
              Li e aceito a{" "}
              <Link
                to="/privacidade"
                className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150"
              >
                Política de Privacidade
              </Link>
            </Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar conta"}{" "}
            <UserPlus />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
