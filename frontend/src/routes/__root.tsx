import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { AppHeader } from '@/components/layout/AppHeader'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated, user } = useAuth()
  const { logout } = useLogout()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader
        title="Puxei o Cabo"
        isAuthenticated={isAuthenticated}
        isLinked={!!user?.shortId}
        role={user?.role ?? null}
        onLogout={logout}
      />
      <main className="mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
