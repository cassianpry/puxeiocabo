import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      {
        title: "Política de Privacidade — Puxei o Cabo",
      },
      {
        name: "description",
        content:
          "Política de Privacidade do Puxei o Cabo. Saiba como coletamos, usamos e protegemos seus dados pessoais em conformidade com a LGPD.",
      },
      {
        property: "og:title",
        content: "Política de Privacidade — Puxei o Cabo",
      },
      {
        property: "og:description",
        content:
          "Saiba como o Puxei o Cabo trata seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Política de Privacidade</h1>
        <p className="text-muted-foreground">
          Última atualização: maio de 2026
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">1. Quem somos</h2>
        <p className="text-muted-foreground leading-relaxed">
          O <strong>Puxei o Cabo</strong> é uma plataforma comunitária voltada à
          denúncia e consulta de ocorrências de desconexão intencional
          (&ldquo;rage quit&rdquo;) em partidas ranqueadas de{" "}
          <strong>Street Fighter 6</strong>, promovendo transparência e
          integridade competitiva na comunidade.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Para assuntos relacionados à privacidade e proteção de dados, entre em
          contato:
        </p>
        <p className="text-muted-foreground">
          E-mail:{" "}
          <a
            href="mailto:dpo@puxeiocabo.com"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors duration-150"
          >
            dpo@puxeiocabo.com
          </a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">2. Dados que coletamos</h2>
        <p className="text-muted-foreground leading-relaxed">
          Coletamos apenas os dados necessários para funcionamento da
          plataforma.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-muted-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Dado</th>
                <th className="text-left py-2 pr-4 font-medium">Finalidade</th>
                <th className="text-left py-2 font-medium">Base legal</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">E-mail</td>
                <td className="py-2 pr-4">Criação e autenticação da conta</td>
                <td className="py-2">Consentimento</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Credenciais de acesso protegidas</td>
                <td className="py-2 pr-4">Segurança e autenticação</td>
                <td className="py-2">Consentimento</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Código de usuário do SF6</td>
                <td className="py-2 pr-4">Vinculação do perfil do jogador</td>
                <td className="py-2">Consentimento</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Nome do lutador e plataforma</td>
                <td className="py-2 pr-4">
                  Identificação pública nas denúncias
                </td>
                <td className="py-2">Interesse legítimo</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Comentários e imagens enviados</td>
                <td className="py-2 pr-4">
                  Contextualização e comprovação de denúncias
                </td>
                <td className="py-2">Interesse legítimo</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Dados básicos de navegação</td>
                <td className="py-2 pr-4">
                  Funcionamento e segurança da plataforma
                </td>
                <td className="py-2">Legítimo interesse</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          3. Como os dados são coletados
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Os dados podem ser coletados das seguintes formas:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            Informações fornecidas diretamente pelo usuário durante cadastro e
            uso da plataforma
          </li>
          <li>Conteúdo enviado em denúncias</li>
          <li>
            Dados públicos relacionados aos perfis de jogadores de Street
            Fighter 6, obtidos a partir do serviço oficial Buckler&apos;s Boot
            Camp, mantido pela Capcom
          </li>
          <li>
            Cookies e tecnologias similares utilizadas para autenticação e
            métricas de uso
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Compartilhamento de dados</h2>
        <p className="text-muted-foreground leading-relaxed">
          Não comercializamos dados pessoais nem compartilhamos informações
          privadas de usuários com terceiros, exceto quando necessário para:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>cumprimento de obrigação legal</li>
          <li>proteção da plataforma contra fraudes e abusos</li>
          <li>
            utilização de serviços essenciais de hospedagem, análise ou
            segurança
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          As denúncias aprovadas podem ser exibidas publicamente na plataforma,
          sem exposição do e-mail do denunciante.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Retenção de dados</h2>
        <p className="text-muted-foreground leading-relaxed">
          Os dados são mantidos apenas pelo período necessário para cumprir as
          finalidades descritas nesta política, respeitando obrigações legais,
          regulatórias e legítimos interesses da plataforma.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Usuários podem solicitar exclusão da conta a qualquer momento,
          observadas limitações legais e operacionais.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Direitos do titular (LGPD)</h2>
        <p className="text-muted-foreground leading-relaxed">
          Nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018),
          você pode solicitar:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>confirmação da existência de tratamento</li>
          <li>acesso aos dados pessoais</li>
          <li>correção de dados incompletos ou desatualizados</li>
          <li>exclusão de dados</li>
          <li>revogação do consentimento</li>
          <li>informações sobre compartilhamento de dados</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Solicitações podem ser realizadas pelo e-mail de contato informado
          nesta política.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">
          7. Cookies e tecnologias similares
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          Utilizamos cookies essenciais para:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>autenticação de usuários</li>
          <li>manutenção de sessões</li>
          <li>segurança da navegação</li>
          <li>preferências da plataforma</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Com consentimento do usuário, também podemos utilizar ferramentas de
          análise de audiência para entender o uso da plataforma e melhorar a
          experiência.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          O usuário pode gerenciar permissões de cookies diretamente no banner
          de consentimento ou nas configurações do navegador.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Segurança da informação</h2>
        <p className="text-muted-foreground leading-relaxed">
          Adotamos medidas técnicas e administrativas adequadas para proteger os
          dados pessoais contra acesso não autorizado, perda, alteração,
          divulgação ou destruição indevida.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Essas medidas incluem, entre outras:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>proteção de credenciais de acesso</li>
          <li>uso de conexões seguras</li>
          <li>controles de autenticação e sessão</li>
          <li>monitoramento contra atividades suspeitas</li>
          <li>restrições de acesso administrativo</li>
          <li>validação de arquivos enviados à plataforma</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Embora adotemos boas práticas de segurança, nenhum sistema é
          completamente imune a riscos.
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
