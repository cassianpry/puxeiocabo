import { Link } from "@tanstack/react-router";

export function AppFooter() {
  return (
    <footer className="border-t-2 border-t-primary bg-background px-6 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Puxei o Cabo" className="h-8 w-auto" />
          <span className="text-sm text-muted-foreground">© 2026 cassianpry</span>
        </div>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          <Link
            to="/privacidade"
            className="text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Privacidade
          </Link>
          <Link
            to="/termos-de-servico"
            className="text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Termos de Serviço
          </Link>
          <Link
            to="/bug-report"
            className="text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Reportar um bug
          </Link>
          <Link
            to="/contato"
            className="text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Contato
          </Link>
        </nav>
      </div>
    </footer>
  )
}
