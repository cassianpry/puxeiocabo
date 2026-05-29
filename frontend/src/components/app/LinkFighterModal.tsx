import { useState, useRef, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useFighterSearch } from '@/hooks/useFighterSearch'
import { toast } from 'sonner'
import { Search, LogOut, Link } from 'lucide-react'
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
  const popoverRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleWheel = useCallback((e: React.WheelEvent) => {
    const el = popoverRef.current
    if (!el) return
    const atTop = el.scrollTop === 0
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight
    const goingUp = e.deltaY < 0
    if ((atTop && goingUp) || (atBottom && !goingUp)) return
    el.scrollTop += e.deltaY
  }, [])

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
      <DialogContent className="sm:max-w-md bg-card border-t-2 border-t-primary" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Vincular sua conta</DialogTitle>
          <DialogDescription className="text-muted-foreground">
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
            <PopoverContent
              ref={popoverRef}
              className="w-[var(--radix-popover-trigger-width)] p-0 max-h-[320px] overflow-y-auto bg-muted border-muted"
              align="start"
              onOpenAutoFocus={(e) => {
                e.preventDefault()
                inputRef.current?.focus()
              }}
              onWheel={handleWheel}
            >
              <div className="sticky top-0 z-10 bg-muted p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder="Buscar pelo nome ou código de usuário..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value)
                      setSelected(null)
                    }}
                    className="pl-9"
                  />
                </div>
              </div>
              <Command shouldFilter={false}>
                <CommandList className="max-h-none overflow-visible">
                  {isFetching && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Buscando...
                    </div>
                  )}
                  {!isFetching && search.length > 2 && fighters.length === 0 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Nenhum lutador encontrado.
                    </div>
                  )}
                  {search.length <= 2 && (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Digite pelo menos 3 caracteres.
                    </div>
                  )}
                  <CommandGroup>
                    {fighters.map((fighter) => (
                      <CommandItem
                        key={fighter.shortId}
                        value={fighter.shortId}
                        className="bg-card hover:bg-accent/10 data-[selected=true]:bg-accent/10"
                        onSelect={() => {
                          setSelected(fighter)
                          setSearch(`${fighter.fighterId ?? fighter.shortId} (${fighter.shortId})`)
                          setOpenPopover(false)
                        }}
                      >
                        <div className="flex flex-col">
                          <span>{fighter.fighterId ?? fighter.shortId}</span>
                          <span className="text-xs text-muted-foreground">
                            Código de usuário: {fighter.shortId} · {fighter.platformTool}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selected && (
            <div className="rounded-md border border-border bg-card p-3 text-sm border-t-2 border-t-primary">
              <div className="font-medium">{selected.fighterId ?? selected.shortId}</div>
              <div className="text-muted-foreground">
                Código de usuário: {selected.shortId} · Plataforma: {selected.platformTool}
              </div>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onLogout}>
              Sair<LogOut />
            </Button>
            <Button onClick={handleLink} disabled={!selected || linking}>
              {linking ? 'Vinculando...' : 'Vincular'}
              {!linking && <Link />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
