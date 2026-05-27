import { createFileRoute, Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export const Route = createFileRoute("/changelog")({
  component: ChangelogRoute,
})

type CommitEntry = {
  sha: string
  type: "feat" | "fix" | "docs" | "other"
  message: string
  url: string
}

type DayGroup = {
  label: string
  commits: CommitEntry[]
}

const badgeVariant: Record<CommitEntry["type"], "default" | "destructive" | "secondary" | "outline"> = {
  feat: "default",
  fix: "destructive",
  docs: "secondary",
  other: "outline",
}

const badgeIcon: Record<CommitEntry["type"], string> = {
  feat: "✨",
  fix: "🔧",
  docs: "📄",
  other: "📦",
}

const data: DayGroup[] = [
  {
    label: "27 de Maio",
    commits: [
      {
        sha: "6235d83c38017cc2d6b6000d1168fd09a7a1475b",
        type: "feat",
        message: "Adiciona ferramenta de análise de audiência, footer, termos de serviço e formulário de bug report",
        url: "https://github.com/cassianpry/puxeiocabo/commit/6235d83c38017cc2d6b6000d1168fd09a7a1475b",
      },
      {
        sha: "54f06acb7433f848d74b871de56f0192ae353760",
        type: "docs",
        message: "Expande seções de cookies e segurança na política de privacidade",
        url: "https://github.com/cassianpry/puxeiocabo/commit/54f06acb7433f848d74b871de56f0192ae353760",
      },
      {
        sha: "09abbdbc95310f128207577a8cf199475cec3662",
        type: "fix",
        message: "Restaura card de gestão de dados LGPD na página de perfil",
        url: "https://github.com/cassianpry/puxeiocabo/commit/09abbdbc95310f128207577a8cf199475cec3662",
      },
      {
        sha: "b73465420885d4768839a637e2352a2c5f7ef157",
        type: "feat",
        message: "Adiciona conformidade LGPD — consentimento, exclusão de conta, exportação de dados, política de privacidade",
        url: "https://github.com/cassianpry/puxeiocabo/commit/b73465420885d4768839a637e2352a2c5f7ef157",
      },
      {
        sha: "d228d809d7fac2c3c9a07bee305691b9b853fb4b",
        type: "fix",
        message: "Corrige transição de sessão na página de login",
        url: "https://github.com/cassianpry/puxeiocabo/commit/d228d809d7fac2c3c9a07bee305691b9b853fb4b",
      },
      {
        sha: "6beb0c77f688837d436dc86485f0a6f54741b60d",
        type: "feat",
        message: "Adiciona opção de alteração de senha na página de perfil",
        url: "https://github.com/cassianpry/puxeiocabo/commit/6beb0c77f688837d436dc86485f0a6f54741b60d",
      },
    ],
  },
  {
    label: "26 de Maio",
    commits: [
      {
        sha: "5cf5e861300f7c68f5668291ad5981eeeb9fdd26",
        type: "fix",
        message: "Corrige verificação de autenticidade de imagens",
        url: "https://github.com/cassianpry/puxeiocabo/commit/5cf5e861300f7c68f5668291ad5981eeeb9fdd26",
      },
      {
        sha: "7af92c20e14ea66cf2bf9defc7655a5a7c8eef57",
        type: "feat",
        message: "Adiciona página SEO /como-usar, melhorias na UI de autenticação, logo e regras",
        url: "https://github.com/cassianpry/puxeiocabo/commit/7af92c20e14ea66cf2bf9defc7655a5a7c8eef57",
      },
      {
        sha: "641cde25210fcfb01adc36aad70eca51777093bb",
        type: "fix",
        message: "Corrige exibição de conteúdo na página inicial e ajustes de UI",
        url: "https://github.com/cassianpry/puxeiocabo/commit/641cde25210fcfb01adc36aad70eca51777093bb",
      },
      {
        sha: "a147a4dc842704049c62322007bc8702a0a53c16",
        type: "feat",
        message: "Adiciona painel de revisão inline com comentário de moderação e exibe motivo de rejeição para usuários",
        url: "https://github.com/cassianpry/puxeiocabo/commit/a147a4dc842704049c62322007bc8702a0a53c16",
      },
      {
        sha: "42d6f467cb8bf62085e84ae2ddcbc9a35eaa6b64",
        type: "feat",
        message: "Adiciona circleName ao Fighter, reformula ReportCard e homepage",
        url: "https://github.com/cassianpry/puxeiocabo/commit/42d6f467cb8bf62085e84ae2ddcbc9a35eaa6b64",
      },
      {
        sha: "fcd549641a7e523541a42602ac97b190a8f7d53b",
        type: "feat",
        message: "Redesign arcade — azul elétrico como cor primária, brilhos neon, Archivo Black, rosa arcade para destrutivo",
        url: "https://github.com/cassianpry/puxeiocabo/commit/fcd549641a7e523541a42602ac97b190a8f7d53b",
      },
      {
        sha: "986fa0caa2298099dfb1b370fff5f89d8dc4326d",
        type: "feat",
        message: "Adiciona hit-flash, transições de página, card stagger, lightbox e brilho hover — paleta azul",
        url: "https://github.com/cassianpry/puxeiocabo/commit/986fa0caa2298099dfb1b370fff5f89d8dc4326d",
      },
      {
        sha: "7ff9082b72d611030adb91afa8007a45c968aee6",
        type: "other",
        message: "Primeiro commit — estrutura inicial do projeto",
        url: "https://github.com/cassianpry/puxeiocabo/commit/7ff9082b72d611030adb91afa8007a45c968aee6",
      },
    ],
  },
]

function ChangelogRoute() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-10">
      <div className="space-y-2">
        <h1 className="font-archivo text-3xl tracking-tight">Novidades</h1>
        <p className="text-muted-foreground">
          Últimas atualizações do Puxei o Cabo
        </p>
      </div>

      <div className="space-y-8">
        {data.map((day) => (
          <Card key={day.label}>
            <CardHeader>
              <CardTitle className="text-lg">{day.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {day.commits.map((commit) => (
                  <li key={commit.sha}>
                    <a
                      href={commit.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-md p-1 transition-colors hover:bg-accent/50"
                    >
                      <Badge
                        variant={badgeVariant[commit.type]}
                        className="mt-0.5 shrink-0 font-mono text-[10px]"
                      >
                        {badgeIcon[commit.type]} {commit.type}
                      </Badge>
                      <span className="flex-1 text-sm leading-relaxed">
                        {commit.message}
                      </span>
                      <ExternalLink className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        <Link
          to="/"
          className="underline underline-offset-2 hover:text-primary transition-colors duration-150"
        >
          Voltar ao início
        </Link>
      </p>
    </div>
  )
}
