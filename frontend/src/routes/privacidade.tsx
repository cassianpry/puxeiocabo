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
      { property: "og:title", content: "Política de Privacidade — Puxei o Cabo" },
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
          O <strong>Puxei o Cabo</strong> é uma plataforma comunitária que permite
          a jogadores de <strong>Street Fighter 6</strong> denunciar e consultar
          denúncias de rage-quitters (jogadores que desconectam intencionalmente
          durante partidas ranqueadas). Nosso objetivo é promover uma comunidade
          mais justa e transparente no cenário competitivo brasileiro de SF6.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Para entrar em contato com nosso Encarregado de Proteção de Dados (DPO),
          envie um e-mail para:{" "}
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
          Coletamos os seguintes dados pessoais:
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
                <td className="py-2 pr-4">Identificação e autenticação da conta</td>
                <td className="py-2">Consentimento (Art. 7º, I)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Hash da senha</td>
                <td className="py-2 pr-4">Autenticação segura da conta</td>
                <td className="py-2">Consentimento (Art. 7º, I)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Short ID (SF6)</td>
                <td className="py-2 pr-4">Vincular perfil ao jogador no SF6</td>
                <td className="py-2">Consentimento (Art. 7º, I)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Nome do lutador (fighterId)</td>
                <td className="py-2 pr-4">Identificação nas denúncias</td>
                <td className="py-2">Interesse legítimo (Art. 7º, IX)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Plataforma de jogo</td>
                <td className="py-2 pr-4">Contexto das denúncias</td>
                <td className="py-2">Interesse legítimo (Art. 7º, IX)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Comentário da denúncia</td>
                <td className="py-2 pr-4">Contexto da denúncia</td>
                <td className="py-2">Interesse legítimo (Art. 7º, IX)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Imagem de prova (JPEG)</td>
                <td className="py-2 pr-4">Comprovação da denúncia</td>
                <td className="py-2">Interesse legítimo (Art. 7º, IX)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">3. Como coletamos</h2>
        <p className="text-muted-foreground leading-relaxed">
          Coletamos dados das seguintes formas:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Cadastro voluntário:</strong> você fornece seu e-mail e senha
            ao criar uma conta.
          </li>
          <li>
            <strong>Vinculação voluntária:</strong> você vincula seu Short ID do
            SF6 à sua conta.
          </li>
          <li>
            <strong>Denúncias:</strong> você envia comentários e imagens ao
            denunciar um jogador.
          </li>
          <li>
            <strong>Dados públicos da Capcom:</strong> os dados dos lutadores
            (nome, plataforma, ranking) são obtidos do site oficial da Capcom
            (Buckler&apos;s Boot Camp) e são de domínio público.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">4. Compartilhamento de dados</h2>
        <p className="text-muted-foreground leading-relaxed">
          Não compartilhamos seus dados pessoais com terceiros. As denúncias
          aprovadas são exibidas publicamente no site, mas sem expor seus dados
          de conta (e-mail). Apenas o Short ID e nome do jogador denunciado são
          visíveis.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">5. Retenção de dados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-muted-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Dado</th>
                <th className="text-left py-2 font-medium">Período de retenção</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Dados da conta</td>
                <td className="py-2">Até a exclusão da conta pelo titular</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Denúncias</td>
                <td className="py-2">Indeterminado (interesse público da comunidade)</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Imagens de prova</td>
                <td className="py-2">Enquanto a denúncia existir</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4">Dados de navegação (cookies)</td>
                <td className="py-2">Sessão (15 min para access token, 7 dias para refresh token)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">6. Seus direitos (LGPD Art. 18)</h2>
        <p className="text-muted-foreground leading-relaxed">
          Você tem os seguintes direitos sobre seus dados pessoais:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Confirmação e acesso:</strong> saiba quais dados tratamos e
            acesse-os através do perfil.
          </li>
          <li>
            <strong>Correção:</strong> corrija dados incompletos ou
            desatualizados.
          </li>
          <li>
            <strong>Portabilidade:</strong> exporte seus dados em formato JSON
            através do perfil.
          </li>
          <li>
            <strong>Exclusão:</strong> delete sua conta e anonimize suas
            denúncias através do perfil. As denúncias permanecem visíveis, mas
            sem identificação do autor.
          </li>
          <li>
            <strong>Revogação do consentimento:</strong> cancele o consentimento
            a qualquer momento excluindo sua conta.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">7. Cookies</h2>
        <p className="text-muted-foreground leading-relaxed">
          Utilizamos exclusivamente cookies essenciais para o funcionamento da
          plataforma:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>accessToken:</strong> cookie httpOnly para autenticação.
            Expira em 15 minutos.
          </li>
          <li>
            <strong>refreshToken:</strong> cookie httpOnly para renovação de
            sessão. Expira em 7 dias.
          </li>
          <li>
            <strong>_ga (Google Analytics):</strong> cookie de análise de
            audiência. Coleta dados anônimos de navegação. Você pode escolher
            entre dois níveis: <strong>Apenas Essenciais</strong> (apenas
            páginas visitadas) ou <strong>Completo</strong> (páginas visitadas
            + interações como login, cadastro e denúncias). Ativado somente
            mediante seu aceite no banner de cookies. Dados armazenados nos
            servidores do Google (EUA).
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Segurança</h2>
        <p className="text-muted-foreground leading-relaxed">
          Adotamos as seguintes medidas de segurança para proteger seus dados:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Senhas armazenadas com hash bcrypt</li>
          <li>Tokens JWT com expiração curta (15 min) e refresh tokens renováveis</li>
          <li>Cookies httpOnly para prevenir acesso via JavaScript</li>
          <li>Conexão HTTPS em produção</li>
          <li>Apenas imagens JPEG são aceitas como prova (validação de tipo MIME)</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">9. Alterações nesta política</h2>
        <p className="text-muted-foreground leading-relaxed">
          Esta política pode ser atualizada periodicamente. Notificaremos os
          usuários sobre mudanças significativas através do e-mail cadastrado.
          Recomendamos revisar esta página regularmente.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">10. Contato</h2>
        <p className="text-muted-foreground leading-relaxed">
          Para exercer seus direitos, tirar dúvidas ou reportar preocupações
          sobre privacidade, entre em contato:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            E-mail do DPO:{" "}
            <a
              href="mailto:dpo@puxeiocabo.com"
              className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors duration-150"
            >
              dpo@puxeiocabo.com
            </a>
          </li>
          <li>Página de perfil: ferramentas de exportação e exclusão de dados</li>
        </ul>
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
