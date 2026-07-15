import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { leadsQualifies, agencesPartenaires } from "@/lib/mock-data";
import { Flame, Check, Mail, Phone, MapPin, Sparkles, Download, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads qualifiés — Naïma AI" }] }),
  component: LeadsPage,
});

function LeadsPage() {
  return (
    <AppShell title="Leads qualifiés" subtitle={`${leadsQualifies.length} prospects prêts à être revendus aux agences partenaires`}>
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-gold" /> Tous ces prospects ont validé les 4 critères du script IA.
        </div>
        <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Exporter (.xlsx)</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {leadsQualifies.map((p) => (
          <Card key={p.id} className="glass-card p-0 overflow-hidden group hover:shadow-[var(--shadow-elegant)] transition-shadow">
            <div className="p-5 relative" style={{ background: "var(--gradient-gold)" }}>
              <Flame className="absolute top-3 right-3 h-5 w-5 text-gold-foreground/70" />
              <div className="text-gold-foreground/80 text-[10px] uppercase tracking-widest">Lead chaud</div>
              <div className="font-display text-xl font-semibold text-gold-foreground mt-1">{p.prenom} {p.nom}</div>
              <div className="text-gold-foreground/80 text-sm">{p.ville}, {p.pays === "BE" ? "Belgique" : "France"}</div>
            </div>
            <div className="p-5 space-y-3">
              <div className="text-xs space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" /> {p.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> <span className="font-mono">{p.telephone}</span></div>
                <div className="flex items-start gap-2"><MapPin className="h-3.5 w-3.5 mt-0.5" /> <span className="text-foreground">{p.adresse}</span></div>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-border/60">
                {[
                  ["Bien à vendre", p.criteres.bienAVendre],
                  [">10 ans sur place", p.criteres.plusDeDixAns],
                  ["Vente < 6 mois", p.criteres.moinsSixMois],
                  ["Estimation OK", p.criteres.accordEstimation],
                ].map(([lbl, val]) => (
                  <div key={lbl as string} className="flex items-center gap-1.5 text-[11px]">
                    <Check className="h-3 w-3 text-success" /> <span className="truncate">{lbl}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 space-y-2">
                <Select onValueChange={(v) => toast.success("Agence assignée", { description: v })}>
                  <SelectTrigger className="h-9 text-xs"><SelectValue placeholder="Assigner à une agence…" /></SelectTrigger>
                  <SelectContent>
                    {agencesPartenaires.map((a) => (
                      <SelectItem key={a.id} value={a.nom}>{a.nom} <Badge variant="outline" className="ml-1 text-[9px]">{a.pays}</Badge></SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Link to="/prospects/$id" params={{ id: p.id }} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Ouvrir la fiche</Button>
                  </Link>
                  <Button size="sm" className="flex-1" onClick={() => toast.success("RDV validé", { description: `${p.prenom} ${p.nom} — planifié.` })}>
                    <CalendarCheck className="h-3.5 w-3.5 mr-1" /> Valider RDV
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
