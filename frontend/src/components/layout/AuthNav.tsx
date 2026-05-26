import { Link } from '@tanstack/react-router'
import { getAuthNavItems } from '@/lib/admin-routing'

export interface AuthNavProps {
  isAuthenticated: boolean
  isLinked: boolean
  isAdmin: boolean
  onLogout: () => void
}

export function AuthNav({ isAuthenticated, isLinked, isAdmin, onLogout }: AuthNavProps) {
  const items = getAuthNavItems({ isAuthenticated, isLinked, isAdmin })

  return (
    <nav className="flex items-center gap-4">
      {items.map((item) =>
        'to' in item ? (
          <Link
            key={item.label}
            to={item.to}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            {item.label}
          </Link>
        ) : (
          <button
            key={item.label}
            type="button"
            onClick={onLogout}
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            {item.label}
          </button>
        ),
      )}
    </nav>
  )
}
