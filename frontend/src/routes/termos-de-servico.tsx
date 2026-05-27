import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/termos-de-servico")({
  head: () => ({
    meta: [
      {
        title: "Termos de Serviço — Puxei o Cabo",
      },
      {
        name: "description",
        content:
          "Termos de Serviço do Puxei o Cabo. Saiba as regras de uso, responsabilidades e limitações da plataforma comunitária de denúncias de rage-quit no SF6.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Termos de Serviço</h1>
        <p className="text-muted-foreground">
          Última atualização: maio de 2026
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Aceitação dos Termos</h2>
        <p className="text-muted-foreground leading-relaxed">
          Ao acessar ou usar o <strong>Puxei o Cabo</strong>, você concorda
          com estes Termos de Serviço. Se não concordar, não utilize a
          plataforma. Estes termos podem ser alterados a qualquer momento, e o
          uso continuado após alterações constitui aceitação das novas
          condições.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Uso Aceitável</h2>
        <p className="text-muted-foreground leading-relaxed">
          Você se compromete a:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Não enviar denúncias falsas ou fraudulentas
          </li>
          <li>
            Não usar a plataforma para assediar, difamar ou perseguir outros
            jogadores
          </li>
          <li>
            Não enviar imagens ofensivas, violentas ou ilegais como prova
          </li>
          <li>
            Não tentar manipular o sistema de moderação
          </li>
          <li>
            Não criar múltiplas contas para contornar restrições
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Denúncias</h2>
        <p className="text-muted-foreground leading-relaxed">
          Você é o único responsável pela precisão e veracidade das denúncias
          que enviar. O Puxei o Cabo se reserva o direito de rejeitar, remover
          ou sinalizar denúncias que violem estes termos. Denúncias aprovadas
          são exibidas publicamente e não podem ser removidas após aprovação
          (apenas anonimizadas em caso de exclusão da conta).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Propriedade Intelectual</h2>
        <p className="text-muted-foreground leading-relaxed">
          Você mantém todos os direitos sobre as imagens e textos que enviar.
          Ao enviar conteúdo, você concede ao Puxei o Cabo uma licença não
          exclusiva, gratuita e mundial para exibir o conteúdo na plataforma.
          O código do Puxei o Cabo é de código aberto, exceto onde indicado
          de outra forma.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Isenção de Responsabilidade</h2>
        <p className="text-muted-foreground leading-relaxed">
          O Puxei o Cabo é uma ferramenta comunitária independente. Não somos
          afiliados, endossados ou patrocinados pela Capcom, Sony, Microsoft ou
          qualquer desenvolvedora ou publicadora de Street Fighter 6. As
          denúncias são baseadas em evidências enviadas pela comunidade e não
          representam fatos verificados oficialmente.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Limitação de Responsabilidade</h2>
        <p className="text-muted-foreground leading-relaxed">
          O Puxei o Cabo não se responsabiliza por danos diretos ou indiretos
          decorrentes do uso da plataforma, incluindo mas não se limitando a:
          denúncias imprecisas, perda de acesso à conta, ou ações tomadas por
          terceiros com base em informações publicadas no site.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Alterações</h2>
        <p className="text-muted-foreground leading-relaxed">
          Estes termos podem ser atualizados periodicamente. Notificaremos os
          usuários sobre mudanças significativas através do e-mail cadastrado.
          O uso continuado após alterações constitui aceitação dos novos
          termos.
        </p>
      </section>

      <div className="text-center pt-4">
        <Link
          to="/"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
