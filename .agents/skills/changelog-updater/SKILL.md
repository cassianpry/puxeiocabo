---
name: changelog-updater
description: Atualiza a página /changelog com commits recentes do GitHub. Use quando o usuário pedir "atualizar changelog", "gerar changelog", "novidades", ou "update changelog".
---

# Changelog Updater

Atualiza a página estática de changelog com commits do último mês.

## ⚠️ Segurança — Sanitização Obrigatória

**Nunca** publique detalhes técnicos que possam auxiliar ataques:

- ❌ Flags de configuração, nomes de endpoints, detalhes de cache
- ❌ Mecanismos internos de validação (EXIF, rate-limit, auth flow)
- ❌ Estrutura de banco, nomes de tabelas, lógica de filtros
- ❌ Versões de dependências ou bibliotecas
- ❌ Estratégias de rollback ou recovery
- ❌ Nomes de ferramentas ou serviços de terceiros — nunca "GA", "Google Analytics", "Sentry", etc.

**Regra de ouro:** a mensagem no changelog deve ser o que o *usuário* percebe, não o que o *código* faz.

| Commit original | ✅ Changelog seguro |
|---|---|
| "Remove falso positivo na verificação de EXIF" | "Corrige verificação de autenticidade de imagens" |
| "Limpa cache de autenticação antes de redirect" | "Corrige transição de sessão na página de login" |
| "Corrige filtro do backend para apenas approved" | "Corrige exibição de conteúdo na página inicial" |

## Workflow

1. Buscar commits com `github_list_commits(owner: "cassianpry", repo: "puxeiocabo", sha: "main", since: <30 dias atrás>, perPage: 100)` — **sempre usar `sha: "main"`** pois o repositório usa `main` como branch ativa (padrão do GitHub é `master`).
2. Filtrar merge commits (mensagem startsWith "Merge")
3. Gerar conteúdo da rota `/changelog`
4. Garantir link "Novidades" no footer

## Gerar Página

Arquivo: `frontend/src/routes/changelog.tsx`

- Card container, título "Novidades", subtítulo "Últimas atualizações do Puxei o Cabo"
- Commits agrupados por dia (`dd \`de\` Mês`)
- Cada linha: Badge(tipo) + mensagem + link para `https://github.com/cassianpry/puxeiocabo/commit/{sha}`
- Badge mapeamento: feat→default(green), fix→destructive(red), docs→secondary(yellow), outros→outline

## Footer

Adicionar em `AppFooter.tsx` antes do Contato:

```tsx
<Link
  to="/changelog"
  className="text-muted-foreground hover:text-primary transition-colors duration-150"
>
  Novidades
</Link>
```

## Checklist

- [ ] Página renderiza sem erros
- [ ] Link no footer presente
- [ ] Badges correspondem ao tipo do commit
- [ ] Merge commits filtrados
- [ ] Commits agrupados por data
- [ ] Branch `main` usada na consulta (não o padrão do repositório)
