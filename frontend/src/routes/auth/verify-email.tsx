import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/auth/verify-email")({
  validateSearch: (search: Record<string, string>) => ({
    token: search.token as string | undefined,
  }),
  component: VerifyEmailPage,
});

function VerifyEmailPage() {
  const { token } = useSearch({ from: "/auth/verify-email" });
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Link inválido — token não encontrado.");
      return;
    }

    fetch("/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setStatus("success");
          setMessage("E-mail verificado com sucesso!");
        } else {
          setStatus("error");
          setMessage(data.message || "Erro ao confirmar e-mail.");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Erro de conexão. Tente novamente.");
      });
  }, [token]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">
          {status === "loading" && "Confirmando..."}
          {status === "success" && "E-mail verificado"}
          {status === "error" && "Falha na verificação"}
        </h1>
        <p className="text-muted-foreground">{message}</p>
        {status !== "loading" && (
          <Link
            to="/login"
            className="inline-block text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            {status === "success" ? "Ir para o login" : "Voltar para o login"}
          </Link>
        )}
      </div>
    </div>
  );
}
