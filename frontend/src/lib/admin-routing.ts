export type RoleLike = 'admin' | 'user' | string

export interface LinkState {
  role: RoleLike
  shortId: string | null
}

export interface AuthNavState {
  isAuthenticated: boolean
  isLinked: boolean
  isAdmin: boolean
}

export type AuthNavItem =
  | { to: string; label: string }
  | { action: 'logout'; label: 'Sair' }

export function getPostAuthPath(role: RoleLike) {
  return role === 'admin' ? '/admin' : '/dashboard'
}

export function getProtectedHomePath(role: RoleLike) {
  return role === 'admin' ? '/admin' : '/dashboard'
}

export function shouldRequireFighterLink({ role, shortId }: LinkState) {
  return role !== 'admin' && !shortId
}

export function getAuthNavItems({ isAuthenticated, isLinked, isAdmin }: AuthNavState): AuthNavItem[] {
  if (!isAuthenticated) {
    return [
      { to: '/login', label: 'Entrar' },
      { to: '/register', label: 'Cadastrar' },
    ]
  }

  if (isAdmin) {
    return [
      { to: '/admin', label: 'Painel Admin' },
      { to: '/admin/flagged', label: 'Denúncias Sinalizadas' },
      { to: '/admin/bug-reports', label: 'Relatórios de Bug' },
      { to: '/admin/contact', label: 'Contatos' },
      { action: 'logout', label: 'Sair' },
    ]
  }

  if (!isLinked) {
    return [{ action: 'logout', label: 'Sair' }]
  }

  return [
    { to: '/dashboard', label: 'Painel' },
    { to: '/reports/new', label: 'Nova Denúncia' },
    { to: '/profile', label: 'Perfil' },
    { action: 'logout', label: 'Sair' },
  ]
}
