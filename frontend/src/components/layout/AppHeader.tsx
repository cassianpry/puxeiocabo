import { Link } from '@tanstack/react-router'
import { AuthNav } from './AuthNav'
import type { Role } from '@/types/api'

export interface AppHeaderProps {
  title: string
  isAuthenticated: boolean
  isLinked: boolean
  role: Role | null
  onLogout: () => void
}

export function AppHeader({ title, isAuthenticated, isLinked, role, onLogout }: AppHeaderProps) {
  return (
    <header className="border-b-2 border-b-primary bg-background px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link to="/" className="text-lg font-bold">
          {title}
        </Link>
        <AuthNav
          isAuthenticated={isAuthenticated}
          isLinked={isLinked}
          isAdmin={role === 'admin'}
          onLogout={onLogout}
        />
      </div>
    </header>
  )
}
