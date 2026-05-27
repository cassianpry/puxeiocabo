import { Link } from "@tanstack/react-router";
import { AuthNav } from "./AuthNav";
import type { Role } from "@/types/api";

export interface AppHeaderProps {
  title: string;
  isAuthenticated: boolean;
  isLinked: boolean;
  role: Role | null;
  onLogout: () => void;
}

export function AppHeader({
  title,
  isAuthenticated,
  isLinked,
  role,
  onLogout,
}: AppHeaderProps) {
  return (
    <header className="border-b-2 border-b-primary bg-background px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-lg font-bold">
            <img src="/logo.png" alt="Puxei o Cabo" className="h-14 w-auto" />
            {title}
          </Link>
          <Link
            to="/como-usar"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Como usar
          </Link>
          <Link
            to="/privacidade"
            className="text-sm text-muted-foreground hover:text-primary transition-colors duration-150"
          >
            Privacidade
          </Link>
        </div>
        <AuthNav
          isAuthenticated={isAuthenticated}
          isLinked={isLinked}
          isAdmin={role === "admin"}
          onLogout={onLogout}
        />
      </div>
    </header>
  );
}
