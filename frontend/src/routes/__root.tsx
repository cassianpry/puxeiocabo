import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { useAuth } from '@/hooks/useAuth'
import { useLogout } from '@/hooks/useLogout'
import { usePageTransition } from '@/hooks/usePageTransition'
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
  const animationClass = usePageTransition()
  useAnalytics()

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
        <div className={animationClass}>
          <Outlet />
        </div>
      </main>
      <AppFooter />
      <LgpdConsentBanner />
      <TanStackRouterDevtools position="bottom-right" />
    </div>
  )
}
