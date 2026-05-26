import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface AdminStatCardProps {
  label: string
  value: string | number
  icon: React.ReactNode
}

export function AdminStatCard({ label, value, icon }: AdminStatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}
