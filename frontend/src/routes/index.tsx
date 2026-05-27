import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Search, X } from "lucide-react";
import type { Report, PaginatedResponse } from "@/types/api";
import { ReportCard } from "@/components/app/ReportCard";
import { AppPagination } from "@/components/app/Pagination";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const { data, isLoading } = useQuery<PaginatedResponse<Report>>({
    queryKey: ["reports", page, limit, search],
    queryFn: () =>
      api<PaginatedResponse<Report>>(`/reports?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`),
  })

  const reports = data?.reports ?? []
  const total = data?.total ?? 0
  const totalPages = data?.totalPages ?? 1

  function handleLimitChange(value: string) {
    setLimit(Number(value))
    setPage(1)
  }

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold">
          Denuncie rage-quitters do Street Fighter 6
        </h1>
      </section>

      <section className="text-center max-w-2xl mx-auto space-y-4 pb-8">
        <p>
          O Puxei o Cabo é um sistema colaborativo para denunciar jogadores
          que abandonam partidas (rage-quit) no Street Fighter 6.
        </p>
        <p>
          Pesquise pelo ID ou nome do quiter, veja as denúncias mais recentes
          e ajude a comunidade a identificar quem sai no meio da luta.
        </p>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Denúncias Recentes</h2>
          <span className="text-sm text-muted-foreground">
            {total} no total
          </span>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 w-full sm:max-w-xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ID ou nome do quiter..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9"
              />
            </div>
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
              >
                <X className="h-4 w-4" />
                Limpar busca
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Itens por página:</span>
            <Select value={String(limit)} onValueChange={handleLimitChange}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-64 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : reports.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            {search ? "Nenhuma denúncia encontrada para essa busca." : "Sem denúncias no momento"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((report, index) => (
              <ReportCard key={report.id} report={report} index={index} />
            ))}
          </div>
        )}

        <AppPagination page={page} totalPages={totalPages} onPageChange={setPage} className="mt-8" />
      </section>
    </div>
  );
}
