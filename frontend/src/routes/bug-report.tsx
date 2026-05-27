import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiJson } from "@/lib/api";

export const Route = createFileRoute("/bug-report")({
  head: () => ({
    meta: [
      {
        title: "Reportar um bug — Puxei o Cabo",
      },
      {
        name: "description",
        content:
          "Encontrou um bug no Puxei o Cabo? Reporte aqui para ajudar a melhorar a plataforma.",
      },
    ],
  }),
  component: BugReportPage,
});

function BugReportPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!subject.trim() || !description.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      await apiJson("/contact/bug-report", {
        subject: subject.trim(),
        description: description.trim(),
      });
      toast.success("Bug report enviado com sucesso!");
      setSubject("");
      setDescription("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao enviar bug report"
      );
      setError(
        err instanceof Error ? err.message : "Erro ao enviar bug report"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Reportar um bug</h1>
        <p className="text-muted-foreground">
          Encontrou algo que não funciona? Descreva o problema para que
          possamos corrigir.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            placeholder="Ex: Botão de enviar não funciona"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            placeholder="Descreva o bug em detalhes. O que você fez? O que aconteceu? O que era esperado?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            required
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enviando..." : "Enviar"}
        </Button>
      </form>

      <div className="text-center pt-4">
        <Link
          to="/"
          className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors duration-150"
        >
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
