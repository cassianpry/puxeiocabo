import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'

interface EXIFIndicatorProps {
  aiSuspicious: boolean
  aiReason: string
}

export function EXIFIndicator({ aiSuspicious, aiReason }: EXIFIndicatorProps) {
  if (!aiSuspicious) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Suspeita de IA</AlertTitle>
      <AlertDescription>{aiReason || 'Dados de imagem suspeitos.'}</AlertDescription>
    </Alert>
  )
}
