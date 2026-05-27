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
          Utilizamos cookies para autenticação e, com seu consentimento,
          análise de audiência. Cookies são pequenos arquivos de texto
          armazenados no seu navegador pelo servidor. Abaixo, detalhamos cada
          cookie utilizado:
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-muted-foreground">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 font-medium">Cookie</th>
                <th className="text-left py-2 pr-4 font-medium">Finalidade</th>
                <th className="text-left py-2 pr-4 font-medium">Duração</th>
                <th className="text-left py-2 font-medium">Tipo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-2 pr-4"><strong>accessToken</strong></td>
                <td className="py-2 pr-4">Autenticação. Contém um JWT assinado que
                identifica o usuário nas requisições à API.</td>
                <td className="py-2 pr-4">15 minutos</td>
                <td className="py-2">Essencial</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4"><strong>refreshToken</strong></td>
                <td className="py-2 pr-4">Renovação automática do accessToken
                sem necessidade de novo login.</td>
                <td className="py-2 pr-4">7 dias</td>
                <td className="py-2">Essencial</td>
              </tr>
              <tr className="border-b border-border">
                <td className="py-2 pr-4"><strong>_ga / _ga_CL8EGVEYVH</strong></td>
                <td className="py-2 pr-4">Análise de audiência pelo Google
                Analytics 4 (GA4). Coleta dados anônimos de navegação:
                páginas visitadas, tempo no site, origem do tráfego.</td>
                <td className="py-2 pr-4">2 anos</td>
                <td className="py-2">Análise (mediante consentimento)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          Todos os cookies de autenticação são do tipo <strong>httpOnly</strong>
          (inacessíveis via JavaScript) e utilizam a flag{" "}
          <strong>SameSite=Lax</strong> para proteção contra ataques CSRF. Em
          produção, também utilizam a flag <strong>Secure</strong> (enviados
          apenas via HTTPS).
        </p>
        <p className="text-muted-foreground leading-relaxed">
          O cookie do Google Analytics é carregado dinamicamente via gtag.js
          <strong> apenas </strong> após seu aceite explícito no banner de
          cookies, com três níveis de consentimento:
        </p>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground text-sm">
          <li><strong>Recusar:</strong> nenhum cookie de análise é carregado</li>
          <li><strong>Apenas Essenciais:</strong> apenas páginas visitadas são registradas</li>
          <li><strong>Completo:</strong> páginas visitadas + interações (login, cadastro, denúncias, alteração de senha, exclusão de conta)</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Os dados do Google Analytics são armazenados nos servidores do Google
          (Estados Unidos) sob a conta do Measurement ID{" "}
          <code>G-CL8EGVEYVH</code>. Para mais informações, consulte a{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors duration-150"
          >
            Política de Privacidade do Google
          </a>.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">8. Segurança</h2>
        <p className="text-muted-foreground leading-relaxed">
          Adotamos as seguintes medidas de segurança para proteger seus dados
          pessoais:
        </p>

        <h3 className="text-lg font-semibold mt-6">Senhas</h3>
        <p className="text-muted-foreground leading-relaxed">
          Sua senha <strong>nunca é armazenada em texto puro</strong>. Antes de
          ser salva no banco de dados, a senha passa pelo algoritmo
          <strong> bcrypt </strong> com fator de custo 10, que aplica uma
          função de hash lenta e salting automático. Isso significa que mesmo
          que o banco de dados seja comprometido, as senhas não podem ser
          revertidas para o valor original.
        </p>

        <h3 className="text-lg font-semibold mt-6">Tokens de autenticação (JWT)</h3>
        <p className="text-muted-foreground leading-relaxed">
          Utilizamos <strong>JSON Web Tokens (JWT)</strong> assinados com
          <strong> HMAC-SHA256 </strong> para autenticação. O sistema funciona
          com dois tokens:
        </p>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>
            <strong>Access Token:</strong> válido por 15 minutos. É enviado em
            cada requisição à API para identificar o usuário. Por ter curta
            duração, minimiza o risco em caso de vazamento.
          </li>
          <li>
            <strong>Refresh Token:</strong> válido por 7 dias. Permite obter
            um novo access token automaticamente sem exigir que o usuário faça
            login novamente. O refresh token é armazenado com hash bcrypt no
            banco de dados.
          </li>
        </ul>
        <p className="text-muted-foreground leading-relaxed">
          Ao alterar a senha, um novo par de tokens é gerado e os tokens das
          demais sessões são invalidados automaticamente. Ao fazer logout, o
          refresh token é removido do banco de dados.
        </p>

        <h3 className="text-lg font-semibold mt-6">Cookies de autenticação</h3>
        <p className="text-muted-foreground leading-relaxed">
          Ambos os tokens são armazenados em <strong>cookies httpOnly</strong>,
          o que impede que scripts JavaScript no navegador tenham acesso ao
          conteúdo do token. Isso protege contra ataques XSS (cross-site
          scripting). Os cookies utilizam a flag{" "}
          <strong>SameSite=Lax</strong> para prevenir ataques CSRF
          (cross-site request forgery). Em produção, a flag{" "}
          <strong>Secure</strong> é ativada, garantindo que os cookies só
          sejam enviados em conexões HTTPS.
        </p>

        <h3 className="text-lg font-semibold mt-6">Conexão e armazenamento</h3>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li>Conexão HTTPS em produção (criptografia em trânsito)</li>
          <li>Banco de dados SQLite local no servidor</li>
          <li>Apenas imagens JPEG são aceitas como prova (validação de tipo MIME no servidor)</li>
          <li>Metadados EXIF das imagens são analisados por heurística para detectar possíveis fraudes (imagens geradas por IA)</li>
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
