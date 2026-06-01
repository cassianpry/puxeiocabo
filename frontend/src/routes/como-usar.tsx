import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/useAuth";
import { TourGuide } from "@/components/app/TourGuide";
import { Button } from "@/components/ui/button";
import {
  Search,
  Upload,
  ClipboardCheck,
  ShieldCheck,
  Eye,
  ArrowRight,
  LogIn,
  Camera,
  Users,
  ScrollText,
  UserPlus,
  Link2,
  Ban,
  FileSearch,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/como-usar")({
  validateSearch: (search: Record<string, string>) => {
    const result = search.tour === 'true' ? { tour: true } : {}
    return result
  },
  head: () => ({
    meta: [
      {
        title: "Como usar o Puxei o Cabo — Blocklist comunitária do SF6",
      },
      {
        name: "description",
        content:
          "Blocklist unificada da comunidade brasileira de Street Fighter 6. Consulte rage-quitters antes de aceitar uma revanche, denuncie jogadores que desconectam e bloqueie no jogo pelo CFN.",
      },
      { property: "og:title", content: "Como usar o Puxei o Cabo" },
      {
        property: "og:description",
        content:
          "Blocklist comunitária do SF6. Consulte antes de jogar, denuncie rage-quitters e bloqueie no jogo. Proteja a comunidade brasileira de quem desconecta para não perder pontos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      {
        rel: "canonical",
        href: "https://puxeiocabo.com/como-usar",
      },
    ],
  }),
  component: ComoUsarPage,
});

const ecosystemActs = [
  {
    icon: Search,
    title: "Consulte",
    description:
      "Antes de aceitar uma revanche, pesquise o nome ou código de usuário do oponente no site. Se ele tiver denúncias confirmadas, não aceite a luta. A consulta é pública e não requer cadastro.",
  },
  {
    icon: Upload,
    title: "Denuncie",
    description:
      "Caiu com um rage-quitter? Registre-se, vincule seu lutador e envie a prova em JPEG. Sua denúncia passará por moderação e, se aprovada, aparecerá no site para que todos vejam.",
  },
  {
    icon: Ban,
    title: "Bloqueie",
    description:
      "Com o código de usuário ou o nome do jogador denunciado, vá no SF6 → CFN → Buscar Jogador → Bloqueie. A blocklist do site vira sua blocklist pessoal no jogo.",
  },
];

const consultSteps = [
  {
    icon: FileSearch,
    title: "Veja as denúncias recentes",
    description:
      "Na página inicial do site você encontra as denúncias mais recentes aprovadas pela moderação. Use a busca para filtrar por nome ou código de usuário.",
  },
  {
    icon: Search,
    title: "Pesquise um jogador",
    description:
      "Digite o nome ou o código de usuário do oponente. O sistema consulta o banco de dados oficial da Capcom e retorna o perfil do lutador com o histórico completo de denúncias.",
  },
  {
    icon: Eye,
    title: "Consulte o histórico",
    description:
      "Veja todas as denúncias aprovadas contra aquele jogador. Se houver registos confirmados de rage-quit, recuse a revanche e bloqueie o jogador no CFN.",
  },
];

const reportSteps = [
  {
    icon: UserPlus,
    image: "/playerSearch.png",
    title: "Crie sua conta",
    description:
      "Registre-se com seu email e uma senha. Verifique seu email para ativar a conta. É rápido, gratuito e não pedimos informações pessoais além do necessário para a LGPD.",
  },
  {
    icon: Link2,
    image: "/playerProof.png",
    title: "Vincule seu lutador",
    description:
      "Busque seu shortId (código de usuário) no banco de dados oficial da Capcom e vincule à sua conta. Isso garante que cada denúncia venha de um jogador real do SF6.",
  },
  {
    icon: Upload,
    image: "/descriptionReport.png",
    title: "Envie a denúncia",
    description:
      "Busque o rage-quitter pelo nome ou shortId, escreva um comentário com os detalhes da partida e anexe o print em JPEG. O print precisa mostrar seu nome, o nome do oponente e a mensagem de desconexão.",
  },
  {
    icon: ClipboardCheck,
    image: "/moderationReview.png",
    title: "Acompanhe",
    description:
      "A denúncia entra na fila de moderação. Você acompanha o status pelo painel: pendente, aprovada ou rejeitada. Se rejeitada, veja o motivo, edite e reenvie.",
  },
];

const moderationStages = [
  {
    icon: Camera,
    title: "Análise automática (EXIF)",
    description:
      "No upload, o sistema extrai os metadados EXIF da imagem. Fotos geradas por IA (Midjourney, DALL-E, Stable Diffusion) deixam assinaturas digitais nos metadados — o sistema detecta e rejeita automaticamente. Imagens sem dados de câmera ou sem data/hora são sinalizadas para revisão manual.",
  },
  {
    icon: Users,
    title: "Revisão humana",
    description:
      "Um administrador analisa cada denúncia sinalizada: confere a imagem, o comentário, os metadados EXIF e o histórico do jogador denunciado. Só denúncias com provas reais entram na blocklist.",
  },
  {
    icon: ScrollText,
    title: "Status da denúncia",
    description:
      "Pendente: aguardando revisão. Aprovada: confirmada e visível para todos no site. Rejeitada: você recebe o motivo e pode editar e reenviar. Cada status é comunicado com clareza.",
  },
];

const trustPoints = [
  {
    icon: Eye,
    title: "Transparência total",
    description:
      "Denúncias aprovadas ficam visíveis para qualquer visitante na página inicial. O histórico de cada jogador é público. Não existe denúncia secreta — tudo que é aprovado está à vista de todos.",
  },
  {
    icon: ShieldCheck,
    title: "Proteção contra abuso",
    description:
      "A análise EXIF impede prints falsos gerados por IA. A moderação humana revisa cada caso. Denúncias rejeitadas incluem o motivo e você pode contestar reenviando com mais provas.",
  },
  {
    icon: Search,
    title: "Dados oficiais da Capcom",
    description:
      "A base de jogadores vem do ranking oficial da Capcom. Todo código de usuário é verificado contra os dados do Buckler's Boot Camp. Sem perfis falsos, sem contas duplicadas.",
  },
];

const tourSteps = [
  {
    title: "Bem-vindo à blocklist",
    description:
      "Você agora faz parte da blocklist colaborativa da comunidade brasileira de SF6. Consulte, denuncie e bloqueie rage-quitters no jogo pelo código de usuário.",
    sectionId: "tour-hero",
  },
  {
    title: "Como funciona",
    description:
      "Antes de aceitar uma revanche, pesquise o nome ou código de usuário do oponente no site. A consulta é pública e não requer cadastro.",
    sectionId: "tour-ecosystem",
  },
  {
    title: "Denuncie",
    description:
      "Caiu com um rage-quitter? Registre-se, vincule seu lutador e envie a prova em JPEG. Sua denúncia passará por moderação e, se aprovada, aparecerá no site.",
    sectionId: "tour-ecosystem",
  },
  {
    title: "Bloqueie",
    description:
      "Com o código de usuário ou nome do jogador denunciado, vá no SF6 → CFN → Buscar Jogador → Bloqueie. A blocklist do site vira sua blocklist pessoal no jogo.",
    sectionId: "tour-ecosystem",
    position: "left",
  },
  {
    title: "Pesquise antes de jogar",
    description:
      "Na página inicial, busque pelo nome ou código de usuário do oponente. Veja o histórico de denúncias aprovadas e decida se aceita a revanche. Não precisa de cadastro.",
    sectionId: "tour-consult",
    offsetTop: "-200px",
  },
  {
    title: "01 — Crie sua conta",
    description:
      "Registre-se com seu email e uma senha. Verifique seu email para ativar a conta. É rápido, gratuito e não pedimos informações pessoais além do necessário para a LGPD.",
    sectionId: "tour-report-1",
  },
  {
    title: "02 — Vincule seu lutador",
    description:
      "Busque seu shortId (código de usuário) no banco de dados oficial da Capcom e vincule à sua conta. Isso garante que cada denúncia venha de um jogador real do SF6.",
    sectionId: "tour-report-2",
  },
  {
    title: "03 — Envie a denúncia",
    description:
      "Busque o rage-quitter pelo nome ou shortId, escreva um comentário com os detalhes da partida e anexe o print em JPEG. O print precisa mostrar seu nome, o nome do oponente e a mensagem de desconexão.",
    sectionId: "tour-report-3",
  },
  {
    title: "04 — Acompanhe",
    description:
      "A denúncia entra na fila de moderação. Você acompanha o status pelo painel: pendente, aprovada ou rejeitada. Se rejeitada, veja o motivo, edite e reenvie.",
    sectionId: "tour-report-4",
  },
  {
    title: "Depois da denúncia",
    description:
      "Toda denúncia passa por duas camadas de verificação: análise automática de metadados e revisão humana. Você acompanha cada status pelo painel.",
    sectionId: "tour-moderation",
    position: "left",
    offsetTop: "100px",
  },
  {
    title: "Por que confiar na blocklist",
    description:
      "Denúncias aprovadas são públicas para todos. Análise EXIF impede prints falsos. A base de jogadores vem dos dados oficiais da Capcom.",
    sectionId: "tour-trust",
    offsetTop: "-200px",
  },
  {
    title: "Faça parte da blocklist",
    description:
      "Crie sua conta em segundos. Só um email válido é necessário. Quanto mais denúncias, mais completa fica a lista para todo mundo.",
    sectionId: "tour-cta",
  },
]

function ComoUsarPage() {
  const { tour } = Route.useSearch()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [tourDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('tourDone') === '1'
    }
    return false
  })

  function handleTourEnd() {
    localStorage.setItem('tourDone', '1')
    navigate({ to: '/dashboard' })
  }

  const showTour = tour === true && isAuthenticated && !tourDone

  return (
    <div className="pb-32">
      {showTour && (
        <TourGuide
          steps={tourSteps}
          onComplete={handleTourEnd}
          onSkip={handleTourEnd}
        />
      )}
      <section id="tour-hero" className="relative overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-arcade-blue/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-arcade-blue/5 blur-[120px]" />
        <div className="relative grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-6">
              Blocklist comunitária do SF6
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              Puxei
              <br />o Cabo
            </h1>
            <div className="mt-4 h-1 w-24 bg-arcade-blue rounded-full" />
            <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              A blocklist unificada da comunidade brasileira de Street Fighter 6.
              Consulte rage-quitters antes de aceitar uma revanche,
              denuncie quem desconecta e bloqueie no jogo pelo CFN.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg">
                  Começar agora{" "}
                  <ArrowRight />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Ver denúncias recentes{" "}
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <img
              src="/logo.png"
              alt="Puxei o Cabo"
              className="w-full max-w-xl h-auto opacity-80 hover:opacity-100 transition-opacity duration-150"
            />
          </div>
        </div>
      </section>

      <section id="tour-ecosystem" className="py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Ecossistema
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">Como funciona</h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Consulte, denuncie, bloqueie. Três passos para uma comunidade mais justa.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {ecosystemActs.map((act, index) => (
            <div
              key={act.title}
              className="rounded-xl border border-arcade-blue/10 bg-arcade-blue/[0.02] p-8"
            >
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-arcade-blue/20 leading-none">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="h-px flex-1 bg-arcade-blue/20" />
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-arcade-blue/10 mb-5">
                <act.icon className="h-6 w-6 text-arcade-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{act.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {act.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="tour-consult" className="py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Para jogadores
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">
            Consultar antes de jogar
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Descubra se o oponente já foi denunciado antes de aceitar a revanche.
            Não precisa de cadastro.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {consultSteps.map((step) => (
            <div
              key={step.title}
              className="group rounded-xl border border-arcade-blue/10 bg-arcade-blue/[0.02] p-8 transition-all duration-150 hover:border-arcade-blue/30 hover:shadow-[0_0_24px_oklch(0.60_0.22_235_/_0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-arcade-blue/10 mb-5 group-hover:bg-arcade-blue/15 transition-colors duration-150">
                <step.icon className="h-6 w-6 text-arcade-blue" />
              </div>
              <h3 className="text-base font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="tour-report" className="py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Passo a passo
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">
            Contribuir com a blocklist
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Quatro passos. Sua denúncia ajuda a comunidade inteira.
          </p>
        </div>
        <div className="mt-16 md:mt-20 grid gap-16 md:gap-20">
          {reportSteps.map((step, index) => (
            <div
              key={step.title}
              id={`tour-report-${index + 1}`}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-start"
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-5xl md:text-6xl font-bold text-arcade-blue/20 leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px flex-1 bg-arcade-blue/20" />
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-arcade-blue/10">
                    <step.icon className="h-5 w-5 text-arcade-blue" />
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                </div>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
              <div className={index % 2 === 1 ? "md:order-1" : ""}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full rounded-xl border border-arcade-blue/10"
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="tour-moderation" className="py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="md:sticky md:top-32">
            <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
              Moderação
            </p>
            <h2 className="text-3xl md:text-5xl leading-tight">
              Depois da denúncia
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Toda denúncia passa por duas camadas de verificação antes de entrar
              na blocklist.
            </p>
          </div>
          <div className="space-y-8">
            {moderationStages.map((stage) => (
              <div
                key={stage.title}
                className="rounded-xl border border-arcade-blue/10 bg-arcade-blue/[0.02] p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-arcade-blue/10">
                    <stage.icon className="h-5 w-5 text-arcade-blue" />
                  </div>
                  <h3 className="text-sm font-semibold text-arcade-blue tracking-wider uppercase">
                    {stage.title}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="tour-trust" className="py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Credibilidade
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">
            Por que confiar na blocklist
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            O Puxei o Cabo é uma ferramenta da comunidade, não uma empresa. Sem
            dados vendidos, sem anúncios, sem agenda oculta.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="group rounded-xl border border-arcade-blue/10 bg-arcade-blue/[0.02] p-8 transition-all duration-150 hover:border-arcade-blue/30 hover:shadow-[0_0_24px_oklch(0.60_0.22_235_/_0.08)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-arcade-blue/10 mb-5 group-hover:bg-arcade-blue/15 transition-colors duration-150">
                <point.icon className="h-6 w-6 text-arcade-blue" />
              </div>
              <h3 className="text-base font-semibold mb-2">{point.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="tour-cta" className="relative overflow-hidden rounded-2xl border border-arcade-blue/10 bg-gradient-to-br from-arcade-blue/[0.03] to-transparent py-16 md:py-20 px-8 mt-12">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-arcade-blue/5 blur-[100px]" />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl leading-tight">
            Faça parte da blocklist
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Quanto mais denúncias, mais completa fica a lista para todo mundo.
            Crie sua conta em segundos. Só um email válido para criar sua conta.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg">
                  Criar conta{" "}
                  <ArrowRight />
                </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                  Já tenho conta{" "}
                  <LogIn />
                </Button>
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Consulte, denuncie, bloqueie. A comunidade agradece.
          </p>
        </div>
      </section>

      <section className="mt-6 text-center">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-arcade-blue transition-colors duration-150 underline underline-offset-4"
        >
          Voltar para página inicial
        </Link>
      </section>
    </div>
  );
}
