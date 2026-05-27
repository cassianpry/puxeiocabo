import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

interface ContactInquiry {
  id: number
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
}

export const Route = createFileRoute('/_admin/admin/contact')({
  component: AdminContactPage,
})

function AdminContactPage() {
  const { data: inquiries, isLoading } = useQuery<ContactInquiry[]>({
    queryKey: ['contact', 'inquiries'],
    queryFn: () => api<ContactInquiry[]>('/contact/inquiries'),
  })
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contatos</h1>
        <p className="mt-1 text-muted-foreground">Mensagens recebidas pelo formulário de contato.</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : inquiries && inquiries.length > 0 ? (
        <div className="space-y-3">
          {inquiries.map((inq) => (
            <Card key={inq.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{inq.subject}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {inq.name} — {inq.email}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expanded === inq.id ? 'Recolher' : 'Ver detalhes'}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(inq.createdAt).toLocaleString('pt-BR')}
                </p>
              </CardHeader>
              {expanded === inq.id && (
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {inq.message}
                  </p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum contato recebido.</p>
      )}
    </div>
  )
}
