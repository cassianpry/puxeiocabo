import { createFileRoute, redirect, Outlet, useRouter } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { getProtectedHomePath, shouldRequireFighterLink } from '@/lib/admin-routing'
import { useLogout } from '@/hooks/useLogout'
import { useLinkShortId } from '@/hooks/useLinkShortId'
import { LinkFighterModal } from '@/components/app/LinkFighterModal'

export const Route = createFileRoute('/_auth')({
  beforeLoad: async () => {
    const user = await api<{ accountId: number; shortId: string | null; role: string }>('/auth/me').catch(() => null)
    if (!user) {
      queryClient.setQueryData(['auth', 'me'], null)
      throw redirect({ to: '/login' })
    }
    if (user.role === 'admin') throw redirect({ to: getProtectedHomePath(user.role) })
    return { user, needsLink: shouldRequireFighterLink(user) }
  },
  component: AuthLayout,
})

function AuthLayout() {
  const { needsLink } = Route.useRouteContext()
  const router = useRouter()
  const { logout } = useLogout()
  const { linkShortId } = useLinkShortId()

  async function handleLink(shortId: string) {
    await linkShortId(shortId)
    router.navigate({ to: '/como-usar', search: { tour: true } })
  }

  if (needsLink) {
    return (
      <LinkFighterModal
        open
        onLink={handleLink}
        onLogout={logout}
      />
    )
  }

  return <Outlet />
}
