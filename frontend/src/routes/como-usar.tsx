import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Search,
  Upload,
  ClipboardCheck,
  ShieldCheck,
  Eye,
  ArrowRight,
  Camera,
  Users,
  ScrollText,
} from "lucide-react";

export const Route = createFileRoute("/como-usar")({
  head: () => ({
    meta: [
      {
        title: "Como usar o Puxei o Cabo — Denuncie rage-quitters no SF6",
      },
      {
        name: "description",
        content:
          "Denuncie rage-quitters do Street Fighter 6 e consulte a block list da comunidade. Busque um jogador, envie a prova em JPEG e veja quem já foi denunciado antes de aceitar uma revanche.",
      },
      { property: "og:title", content: "Como usar o Puxei o Cabo" },
      {
        property: "og:description",
        content:
          "Block list comunitária do SF6. Denuncie rage-quitters, veja o histórico de denúncias de qualquer jogador e proteja a comunidade brasileira de quem desconecta para não perder pontos.",
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

const steps = [
  {
    icon: Search,
    image: "/playerSearch.png",
    title: "Busque o jogador",
    description:
      'Pesquise pelo nome ou código de usuário do oponente que desconectou. O sistema consulta o ranking oficial da Capcom e retorna o perfil do lutador. O código de usuário único garante que não haja confusão entre jogadores com nomes parecidos.',
  },
  {
    icon: Upload,
    image: "/playerProof.png",
    title: "Envie a prova",
    description:
      "Faça upload do print da tela de desconexão. Só JPEG é aceito — isso faz parte da verificação de autenticidade. A imagem passa por análise EXIF automaticamente para detectar falsificações.",
  },
  {
    icon: ClipboardCheck,
    image: "/descriptionReport.png",
    title: "Descreva o ocorrido",
    description:
      "Adicione um comentário com detalhes da partida: horário, plataforma (PC, PS5, Xbox) e qualquer contexto que ajude a moderação. Seu relato é a peça principal da denúncia.",
  },
  {
    icon: ShieldCheck,
    image: "/moderationReview.png",
    title: "Acompanhe a moderação",
    description:
      "Sua denúncia entra na fila de revisão. Um administrador analisa o caso — a prova, os metadados EXIF e seu relato — e decide: aprovada, rejeitada ou sinalizada pela IA. Você recebe o status e, se rejeitada, o motivo.",
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
      "Um administrador analisa cada denúncia sinalizada: confere a imagem, o comentário, os metadados EXIF e o histórico do jogador denunciado. O veredito pode ser aprovado, rejeitado (com motivo) ou sinalizado pela IA para atenção extra.",
  },
  {
    icon: ScrollText,
    title: "Status da denúncia",
    description:
      "Pendente: aguardando revisão. Aprovada: confirmada e visível na página inicial. Rejeitada: você recebe o motivo e pode editar e reenviar a denúncia com novas informações. Cada status é comunicado com clareza.",
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

function ComoUsarPage() {
  return (
    <div className="pb-32">
      <section className="relative overflow-hidden pt-20 md:pt-32 pb-16 md:pb-24">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-arcade-blue/5 blur-[120px]" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-arcade-blue/5 blur-[120px]" />
        <div className="relative grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-6">
              Denuncie com confiança
            </p>
            <h1 className="text-5xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              Puxei
              <br />o Cabo
            </h1>
            <div className="mt-4 h-1 w-24 bg-arcade-blue rounded-full" />
            <p className="mt-8 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
            A block list da comunidade brasileira de Street Fighter 6.
            Denuncie rage-quitters, consulte o histórico de qualquer jogador
            e saiba com quem você está aceitando jogar antes da partida começar.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="gap-2 group">
                  Começar agora{" "}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline">
                  Ver denúncias recentes
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

      <section className="py-20 md:py-28">
        <div className="max-w-2xl">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Passo a passo
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">Como denunciar</h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Quatro passos. Leva menos de dois minutos.
          </p>
        </div>
        <div className="mt-16 md:mt-20 grid gap-16 md:gap-20">
          {steps.map((step, index) => (
            <div
              key={step.title}
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

      <section className="py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div className="md:sticky md:top-32">
            <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
              Moderação
            </p>
            <h2 className="text-3xl md:text-5xl leading-tight">
              Depois da denúncia
            </h2>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              Toda denúncia passa por duas camadas de verificação antes de ser
              aprovada.
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

      <section className="py-20 md:py-28">
        <div className="max-w-2xl mb-16">
          <p className="text-xs font-medium tracking-[0.15em] text-arcade-blue uppercase mb-3">
            Credibilidade
          </p>
          <h2 className="text-3xl md:text-5xl leading-tight">
            Por que confiar
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

      <section className="relative overflow-hidden rounded-2xl border border-arcade-blue/10 bg-gradient-to-br from-arcade-blue/[0.03] to-transparent py-16 md:py-20 px-8 mt-12">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-arcade-blue/5 blur-[100px]" />
        <div className="relative max-w-xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl leading-tight">
            Pronto para denunciar?
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Crie sua conta em segundos. É gratis, não pedimos seu CPF nem seu
            email verdadeiro. Só um email válido e o código de usuário do seu lutador na
            Capcom.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2 group">
                Criar conta{" "}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Já tenho conta
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">
            Perguntas? Dúvidas? A comunidade responde.
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
