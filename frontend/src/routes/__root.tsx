import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { useAnalytics } from '@/hooks/useAnalytics'
import { LgpdConsentBanner } from '@/components/app/LgpdConsentBanner'
import { AppHeader } from '@/components/layout/AppHeader'
import { AppFooter } from '@/components/layout/AppFooter'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { isAuthenticated, user } = useAuth()
  const { logout } = useLogout()
  useAnalytics()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppHeader
        title="Puxei o Cabo"
        isAuthenticated={isAuthenticated}
        isLinked={!!user?.shortId}
        role={user?.role ?? null}
        onLogout={logout}
      />
      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-8">
          <Outlet />
      </main>
      <AppFooter />
      <LgpdConsentBanner />
      {import.meta.env.DEV && <TanStackRouterDevtools position="bottom-right" />}
    </div>
  )
}
