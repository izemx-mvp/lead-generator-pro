import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { campagnes, prospects, statutLabels, statutColors, type Campagne } from "@/lib/mock-data";
import { Rocket, Pause, Play, Users, MessageSquare, Flame, CalendarClock } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/campagnes")({
  head: () => ({ meta: [{ title: "Campagnes IA — Naïma AI" }] }),
  component: CampagnesPage,
});

const statutMap: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: "Active", className: "bg-success/15 text-success border-success/30", icon: Play },
  pause: { label: "En pause", className: "bg-warning/20 text-warning-foreground border-warning/30", icon: Pause },
  terminee: { label: "Terminée", className: "bg-muted text-muted-foreground", icon: Rocket },
};

function CampagnesPage() {
  const [selected, setSelected] = useState<Campagne | null>(null);

  return (
    <AppShell title="Campagnes IA" subtitle="Suivi en temps réel des campagnes de prospection automatisée">
      <div className="grid gap-4">
        {campagnes.map((c) => {
          const s = statutMap[c.statut];
          const pct = Math.round((c.envoyes / c.nbProspects) * 100);
          return (
            <Card key={c.id} className="glass-card p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{c.nom}</h3>
                    <Badge className={s.className}><s.icon className="h-3 w-3 mr-1" /> {s.label}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Importée le {new Date(c.dateImport).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => setSelected(c)}>Détails</Button>
                  {c.statut === "active" ? <Button variant="outline" size="sm"><Pause className="h-3 w-3 mr-1" /> Suspendre</Button> :
                   c.statut === "pause" ? <Button size="sm"><Play className="h-3 w-3 mr-1" /> Reprendre</Button> : null}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Metric icon={Users} label="Prospects" value={c.nbProspects} />
                <Metric icon={MessageSquare} label="Envoyés" value={c.envoyes} />
                <Metric icon={MessageSquare} label="Réponses" value={c.reponses} tone="chart-2" />
                <Metric icon={Flame} label="Leads qualifiés" value={c.qualifies} tone="success" />
              </div>

              <div className="mt-5">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">Progression des envois</span>
                  <span className="font-medium">{pct}%</span>
                </div>
                <Progress value={pct} className="h-2" />
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="font-display text-xl">{selected.nom}</DialogTitle>
                <DialogDescription className="flex items-center gap-1.5 text-xs">
                  <CalendarClock className="h-3 w-3" />
                  Importée le {new Date(selected.dateImport).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                <Metric icon={Users} label="Prospects" value={selected.nbProspects} />
                <Metric icon={MessageSquare} label="Envoyés" value={selected.envoyes} />
                <Metric icon={MessageSquare} label="Réponses" value={selected.reponses} tone="chart-2" />
                <Metric icon={Flame} label="Qualifiés" value={selected.qualifies} tone="success" />
              </div>

              <div>
                <h4 className="font-display font-semibold text-sm mb-2 mt-2">Prospects de la campagne</h4>
                <div className="max-h-72 overflow-auto rounded-lg border border-border/60">
                  {prospects.filter((p) => p.campagneId === selected.id).map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 border-b border-border/40 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary text-[10px] font-semibold flex items-center justify-center">
                          {p.prenom[0]}{p.nom[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{p.prenom} {p.nom}</div>
                          <div className="text-xs text-muted-foreground">{p.ville}, {p.pays}</div>
                        </div>
                      </div>
                      <Badge className={statutColors[p.statut]}>{statutLabels[p.statut]}</Badge>
                    </div>
                  ))}
                  {prospects.filter((p) => p.campagneId === selected.id).length === 0 && (
                    <div className="text-center text-sm text-muted-foreground py-6">Aucun prospect rattaché.</div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Metric({ icon: Icon, label, value, tone = "primary" }: { icon: React.ComponentType<{ className?: string }>; label: string; value: number; tone?: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-background/40 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className={`h-3.5 w-3.5 text-${tone}`} /> {label}
      </div>
      <div className="mt-1 font-display text-2xl font-semibold">{value}</div>
    </div>
  );
}
