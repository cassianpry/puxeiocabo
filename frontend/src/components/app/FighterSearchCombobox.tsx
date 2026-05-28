import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { useFighterSearch } from '@/hooks/useFighterSearch'
import type { Fighter } from '@/types/api'

interface FighterSearchComboboxProps {
  value?: string
  onSelect: (fighter: Fighter) => void
}

export function FighterSearchCombobox({ value, onSelect }: FighterSearchComboboxProps) {
  const [search, setSearch] = useState(value || '')
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Fighter | null>(null)

  const { data, isFetching } = useFighterSearch(search)
  const fighters = data?.fighters ?? []

  function handleSelect(fighter: Fighter) {
    setSelected(fighter)
    setSearch(`${fighter.fighterId ?? fighter.shortId} (${fighter.shortId})`)
    setOpen(false)
    onSelect(fighter)
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          placeholder="Buscar lutador por nome ou código de usuário..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setSelected(null)
            setOpen(true)
          }}
        />
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div />
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" onOpenAutoFocus={(e) => e.preventDefault()}>
          <Command shouldFilter={false} className="max-h-[300px] overflow-y-auto">
            <CommandList className="max-h-none overflow-y-visible">
              {isFetching && <CommandEmpty>Buscando...</CommandEmpty>}
              {!isFetching && fighters.length === 0 && search.length > 1 && (
                <CommandEmpty>Nenhum lutador encontrado.</CommandEmpty>
              )}
              {search.length <= 1 && <CommandEmpty>Digite pelo menos 2 caracteres.</CommandEmpty>}
              <CommandGroup>
                {fighters.map((fighter) => (
                  <CommandItem
                    key={fighter.shortId}
                    value={fighter.shortId}
                    className="bg-background"
                    onSelect={() => handleSelect(fighter)}
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
        </PopoverContent>
      </Popover>

      {selected && (
        <div className="rounded-md border bg-muted/50 p-3 text-sm">
          <div className="font-medium">{selected.fighterId ?? `(${selected.shortId})`}</div>
          <div className="text-muted-foreground">
            Código de usuário: {selected.shortId} · Console: {selected.platformTool}
          </div>
        </div>
      )}
    </div>
  )
}
