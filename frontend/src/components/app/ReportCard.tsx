import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Copy, Eye } from "lucide-react";
import { useState } from "react";
import type { Report } from "@/types/api";

interface ReportCardProps {
  report: Report;
  index?: number;
}

export function ReportCard({ report, index }: ReportCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopyShortId() {
    await navigator.clipboard.writeText(report.reported.shortId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card
      className={`group overflow-hidden p-0 gap-0 transition-shadow duration-150 hover:ring-1 hover:ring-foreground/10${index !== undefined ? " card-enter" : ""}`}
      style={
        index !== undefined ? { animationDelay: `${index * 60}ms` } : undefined
      }
    >
      <Dialog>
        <DialogTrigger asChild>
          <div className="relative cursor-pointer overflow-hidden">
            <img
              src={report.proofImagePath}
              alt="Prova"
              className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Eye className="size-8 text-white" />
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-7xl! *:data-[slot=dialog-close]:bg-black/80 *:data-[slot=dialog-close]:backdrop-blur-sm">
          <DialogTitle className="sr-only">Imagem de prova</DialogTitle>
          <img
            src={report.proofImagePath}
            alt="Prova"
            className="w-full max-h-[80vh] object-contain"
          />
        </DialogContent>
      </Dialog>

      <CardHeader className="pb-2 pt-6 space-y-1">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Denunciante:</span>
          <span className="text-muted-foreground">
            {report.reporter.fighterId || report.reporter.shortId}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Quiter:</span>
          <span className="text-muted-foreground">
            {report.reported.fighterId || report.reported.shortId}
          </span>
        </div>
        <div
          className="flex items-center justify-between text-sm cursor-pointer transition-colors"
          onClick={handleCopyShortId}
        >
          <span className="font-medium">ID do Quiter:</span>
          <span className="flex items-center gap-1">
            <Copy
              className={`size-3.5 ${copied ? "hidden" : "text-muted-foreground hover:text-foreground"}`}
            />
            <Check
              className={`size-3.5 text-green-500 ${copied ? "" : "hidden"}`}
            />
            <span
              className={`${copied ? "text-green-500" : "text-muted-foreground hover:text-foreground"}`}
            >
              {report.reported.shortId}
            </span>
            {copied && <span className="text-green-500 text-xs">Copiado</span>}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground leading-relaxed text-center">
          {report.comment}
        </p>
      </CardContent>

      <Separator />
      <CardFooter className="py-3 justify-center">
        <span className="text-xs text-muted-foreground">
          {new Date(report.createdAt).toLocaleDateString("pt-BR")}
        </span>
      </CardFooter>
    </Card>
  );
}
