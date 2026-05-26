import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { useMemo } from 'react'

interface EXIFViewerProps {
  exifData: string
}

interface ExifEntry {
  key: string
  value: string
}

export function EXIFViewer({ exifData }: EXIFViewerProps) {
  const entries = useMemo<ExifEntry[]>(() => {
    try {
      const parsed = JSON.parse(exifData)
      if (typeof parsed !== 'object' || parsed === null) return []
      return Object.entries(parsed).map(([key, value]) => ({
        key,
        value: typeof value === 'object' ? JSON.stringify(value) : String(value),
      }))
    } catch {
      return [{ key: 'Erro', value: 'JSON inválido' }]
    }
  }, [exifData])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Dados EXIF</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sem dados</AlertTitle>
            <AlertDescription>Nenhum dado EXIF disponível para esta imagem.</AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Campo</TableHead>
                  <TableHead>Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry.key}>
                    <TableCell className="font-mono text-sm text-muted-foreground">{entry.key}</TableCell>
                    <TableCell className="font-mono text-sm max-w-md break-all">{entry.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
