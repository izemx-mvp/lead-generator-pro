import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prospects, statutLabels, statutColors, type Statut } from "@/lib/mock-data";
import { ArrowLeft, Check, X, Circle, Mail, Phone, MapPin, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/prospects/$id")({
  head: () => ({ meta: [{ title: "Fiche prospect — Naïma AI" }] }),
  component: ProspectDetail,
  notFoundComponent: () => <div className="p-10 text-center">Prospect introuvable.</div>,
});

const criteresLabels: Record<string, string> = {
  bienAVendre: "Bien à vendre",
  plusDeDixAns: "Vit sur place > 10 ans",
  moinsSixMois: "Vente < 6 mois",
  accordEstimation: "Accord estimation gratuite",
};

function ProspectDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const p = prospects.find((x) => x.id === id);
  if (!p) return <AppShell title="Introuvable"><div>Prospect introuvable.</div></AppShell>;

  const [statut, setStatut] = useState<Statut>(p.statut);
  const isQualified = statut === "qualifie";

  const changeStatut = (v: Statut) => {
    setStatut(v);
    p.statut = v; // mock mutation
    toast.success("Statut mis à jour", { description: `Nouveau statut : ${statutLabels[v]}` });
  };

  return (
    <AppShell title={`${p.prenom} ${p.nom}`} subtitle={`${p.ville} · ${p.pays === "BE" ? "Belgique" : "France"}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/prospects" })} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">
        <div className="space-y-4">
          <Card className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-lg">
                {p.prenom[0]}{p.nom[0]}
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{p.prenom} {p.nom}</div>
                <Badge className={statutColors[statut]}>{statutLabels[statut]}</Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {p.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> <span className="font-mono">{p.telephone}</span> <Badge variant="outline" className="ml-1 text-[10px]">{p.telephoneType}</Badge></div>
              <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5" /> <span>{p.adresse}<br />{p.ville}, {p.pays}</span></div>
            </div>
          </Card>

          <Card className="glass-card p-5">
            <h4 className="font-display font-semibold mb-3">Changer le statut</h4>
            <Select value={statut} onValueChange={(v) => changeStatut(v as Statut)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(statutLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">Passez le prospect en « Qualifié » pour l'ajouter aux leads chauds téléchargeables.</p>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="glass-card p-5">
            <h4 className="font-display font-semibold mb-3">Critères de qualification</h4>
            <div className="space-y-2">
              {(Object.keys(criteresLabels) as (keyof typeof p.criteres)[]).map((key) => {
                const v = p.criteres[key];
                return (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-background/50 border border-border/60 p-2.5">
                    <span className="text-sm">{criteresLabels[key]}</span>
                    {v === true ? (
                      <Badge className="gap-1 bg-success/15 text-success border-success/30"><Check className="h-3 w-3" /> Oui</Badge>
                    ) : v === false ? (
                      <Badge className="gap-1 bg-destructive/15 text-destructive border-destructive/30"><X className="h-3 w-3" /> Non</Badge>
                    ) : (
                      <Badge variant="outline" className="gap-1 text-muted-foreground"><Circle className="h-3 w-3" /> À valider</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {isQualified && (
            <Card className="p-5 relative overflow-hidden text-primary-foreground" style={{ background: "var(--gradient-primary)" }}>
              <Sparkles className="absolute top-3 right-3 h-5 w-5 text-gold" />
              <div className="font-display text-lg font-semibold">🔥 Lead qualifié</div>
              <p className="text-sm text-primary-foreground/80 mt-1">Ce prospect est prêt à être transmis à une agence partenaire.</p>
              <Button className="w-full mt-4 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => toast.success("Lead transmis", { description: "Prêt pour attribution à une agence partenaire." })}>
                <Send className="h-4 w-4 mr-2" /> Transmettre à une agence
              </Button>
            </Card>
          )}
        </div>
      </div>
    </AppShell>
  );
}
