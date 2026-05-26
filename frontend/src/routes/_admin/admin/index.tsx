import { createFileRoute } from '@tanstack/react-router'
import { useAuth } from '@/hooks/useAuth'
import { useAdminStats } from '@/hooks/useAdminStats'
import { AdminStatCard } from '@/components/app/AdminStatCard'
import { Skeleton } from '@/components/ui/skeleton'
import { Users, FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/_admin/admin/')({
  component: AdminDashboardPage,
})

function AdminDashboardPage() {
  const { user } = useAuth()
  const { data: stats, isLoading } = useAdminStats()

  if (user?.role !== 'admin') {
    return null
  }

  const statCards = [
    { label: 'Total de Denúncias', value: stats?.total ?? '—', icon: <FileText className="h-4 w-4" />, iconColor: 'text-primary' },
    { label: 'Pendentes', value: stats?.pending ?? '—', icon: <AlertTriangle className="h-4 w-4" />, iconColor: 'text-[oklch(0.78_0.2_85)]' },
    { label: 'Aprovadas', value: stats?.approved ?? '—', icon: <CheckCircle2 className="h-4 w-4" />, iconColor: 'text-success' },
    { label: 'Rejeitadas', value: stats?.rejected ?? '—', icon: <XCircle className="h-4 w-4" />, iconColor: 'text-destructive' },
    { label: 'Sinalizadas pela IA', value: stats?.flagged ?? '—', icon: <AlertTriangle className="h-4 w-4" />, iconColor: 'text-warning' },
    { label: 'Lutadores Cadastrados', value: stats?.fighterCount ?? '—', icon: <Users className="h-4 w-4" />, iconColor: 'text-primary' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <p className="mt-1 text-muted-foreground">Visão geral e estatísticas do sistema.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-3 rounded-lg border p-6">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))
          : statCards.map((card) => (
              <AdminStatCard
                key={card.label}
                label={card.label}
                value={card.value}
                icon={card.icon}
                iconColor={card.iconColor}
              />
            ))}
      </div>
    </div>
  )
}
