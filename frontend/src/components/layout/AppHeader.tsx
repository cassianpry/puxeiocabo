import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
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
          <motion.div whileHover="hover" className="relative">
            <Link
              to="/como-usar"
              className="text-sm text-muted-foreground transition-colors duration-150 hover:text-primary"
            >
              Como usar
            </Link>
            <motion.span
              className="absolute -bottom-0.5 left-0 h-px bg-primary"
              variants={{ hover: { scaleX: 1 } }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ originX: "left" }}
            />
          </motion.div>
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
