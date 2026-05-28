import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFighterSearch } from '@/hooks/useFighterSearch'
import { toast } from 'sonner'
import type { Fighter } from '@/types/api'

interface LinkFighterModalProps {
  open: boolean
  onLink: (shortId: string) => Promise<void>
  onLogout: () => void
}

export function LinkFighterModal({ open, onLink, onLogout }: LinkFighterModalProps) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Fighter | null>(null)
  const [openPopover, setOpenPopover] = useState(false)
  const [linking, setLinking] = useState(false)

  const { data, isFetching } = useFighterSearch(search)

  const fighters = data?.fighters ?? []

  async function handleLink() {
    if (!selected) return
    setLinking(true)
    try {
      await onLink(selected.shortId)
      toast.success('Conta vinculada com sucesso!')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Erro ao vincular conta')
    } finally {
      setLinking(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onLogout()
      }}
    >
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Vincular sua conta</DialogTitle>
          <DialogDescription>
            Pesquise seu lutador do Street Fighter 6 para vincular à sua conta.
            Essa etapa é obrigatória para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Popover open={openPopover} onOpenChange={setOpenPopover}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              >
                {selected
                  ? `${selected.fighterId ?? selected.shortId} (${selected.shortId})`
                  : "Buscar pelo nome ou código de usuário..."}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
              <div className="p-2">
                <Input
                  placeholder="Buscar pelo nome ou código de usuário..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    setSelected(null)
                  }}
                  className="bg-background"
                  autoFocus
                />
              </div>
              <div className="max-h-[260px] overflow-y-auto">
                <Command shouldFilter={false}>
                  <CommandList className="max-h-none overflow-y-visible">
                    {isFetching && (
                      <CommandEmpty>Buscando...</CommandEmpty>
                    )}
                    {!isFetching && fighters.length === 0 && search.length > 1 && (
                      <CommandEmpty>Nenhum lutador encontrado.</CommandEmpty>
                    )}
                    {search.length <= 1 && (
                      <CommandEmpty>Digite pelo menos 2 caracteres.</CommandEmpty>
                    )}
                    <CommandGroup>
                      {fighters.map((fighter) => (
                        <CommandItem
                          key={fighter.shortId}
                          value={fighter.shortId}
                          className="bg-background"
                          onSelect={() => {
                            setSelected(fighter)
                            setSearch(`${fighter.fighterId ?? fighter.shortId} (${fighter.shortId})`)
                            setOpenPopover(false)
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{fighter.fighterId ?? `(${fighter.shortId})`}</span>
                            <span className="text-xs text-muted-foreground">
                              Código de usuário: {fighter.shortId} · {fighter.platformTool}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            </PopoverContent>
          </Popover>

          {selected && (
            <div className="rounded-md border bg-muted/50 p-3 text-sm">
              <div className="font-medium">{selected.fighterId ?? selected.shortId}</div>
              <div className="text-muted-foreground">
                Código de usuário: {selected.shortId} · Plataforma: {selected.platformTool}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onLogout}>
              Sair
            </Button>
            <Button onClick={handleLink} disabled={!selected || linking}>
              {linking ? 'Vinculando...' : 'Vincular'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
