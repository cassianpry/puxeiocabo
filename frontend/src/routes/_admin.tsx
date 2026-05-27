import { createFileRoute, redirect, Outlet } from '@tanstack/react-router'
import { api } from '@/lib/api'
import { queryClient } from '@/lib/queryClient'
import { getProtectedHomePath } from '@/lib/admin-routing'

import type { User } from '@/types/api'

export const Route = createFileRoute('/_admin')({
  beforeLoad: async () => {
    const user = await api<User>('/auth/me').catch(() => null)
    if (!user) {
      queryClient.setQueryData(['auth', 'me'], null)
      throw redirect({ to: '/login' })
    }

    if (user.role !== 'admin') {
      throw redirect({ to: getProtectedHomePath(user.role) })
    }

    return { user }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return <Outlet />
}
