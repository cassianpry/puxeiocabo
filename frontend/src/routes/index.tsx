import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { getPostAuthPath } from "@/lib/admin-routing";
import type { Report } from "@/types/api";
import { Button } from "@/components/ui/button";
import { ReportCard } from "@/components/app/ReportCard";

export const Route = createFileRoute("/")({
  loader: async () => {
    const user = await api<{ role: string }>("/auth/me").catch(() => null);

    if (user) {
      throw redirect({ to: getPostAuthPath(user.role) });
    }

    try {
      const reports = await api<{ reports: Report[]; total: number }>(
        "/reports?page=1&limit=10",
      );
      return { reports: reports.reports, total: reports.total };
    } catch {
      return { reports: [], total: 0 };
    }
  },
  component: HomePage,
});

function HomePage() {
  const { reports, total } = Route.useLoaderData();

  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold">Puxei o Cabo</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Denuncie rage-quitters do Street Fighter 6
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link to="/login">
            <Button>Entrar</Button>
          </Link>
          <Link to="/register">
            <Button variant="outline">Cadastrar</Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Denúncias Recentes</h2>
          <span className="text-sm text-muted-foreground">
            {total} no total
          </span>
        </div>

        {reports.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Sem denúncias no momento
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
