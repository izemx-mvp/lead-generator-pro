import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prospects, statutLabels, statutColors } from "@/lib/mock-data";
import { ArrowLeft, Check, X, Circle, Mail, Phone, MapPin, Send, Sparkles, Bot, User2 } from "lucide-react";
import { toast } from "sonner";

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

  const isQualified = p.statut === "qualifie";

  return (
    <AppShell title={`${p.prenom} ${p.nom}`} subtitle={`${p.ville} · ${p.pays === "BE" ? "Belgique" : "France"}`}>
      <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/prospects" })} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Retour à la liste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne gauche - infos & critères */}
        <div className="space-y-4">
          <Card className="glass-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 text-primary font-semibold flex items-center justify-center text-lg">
                {p.prenom[0]}{p.nom[0]}
              </div>
              <div>
                <div className="font-display text-lg font-semibold">{p.prenom} {p.nom}</div>
                <Badge className={statutColors[p.statut]}>{statutLabels[p.statut]}</Badge>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Mail className="h-4 w-4" /> {p.email}</div>
              <div className="flex items-center gap-2 text-muted-foreground"><Phone className="h-4 w-4" /> <span className="font-mono">{p.telephone}</span> <Badge variant="outline" className="ml-1 text-[10px]">{p.telephoneType}</Badge></div>
              <div className="flex items-start gap-2 text-muted-foreground"><MapPin className="h-4 w-4 mt-0.5" /> <span>{p.adresse}<br />{p.ville}, {p.pays}</span></div>
            </div>
          </Card>

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
              <Button className="w-full mt-4 bg-gold text-gold-foreground hover:bg-gold/90" onClick={() => toast.success("Lead transmis à Mme Naïma", { description: "Prêt pour attribution à une agence partenaire." })}>
                <Send className="h-4 w-4 mr-2" /> Transmettre à Mme Naïma
              </Button>
            </Card>
          )}
        </div>

        {/* Conversation */}
        <Card className="glass-card p-0 lg:col-span-2 flex flex-col overflow-hidden max-h-[720px]">
          <div className="border-b border-border p-4 flex items-center justify-between bg-background/40">
            <div>
              <h3 className="font-display font-semibold">Conversation IA</h3>
              <p className="text-xs text-muted-foreground">Canal : {p.canal === "whatsapp" ? "WhatsApp" : "Email"}</p>
            </div>
            <Badge variant="outline" className="gap-1"><Bot className="h-3 w-3" /> Assistante IA</Badge>
          </div>
          <div className="flex-1 overflow-auto p-6 space-y-4" style={{ background: "color-mix(in oklab, var(--color-muted) 40%, transparent)" }}>
            {p.conversation.length === 0 ? (
              <div className="text-center text-muted-foreground text-sm py-10">Aucun message envoyé pour le moment.</div>
            ) : (
              p.conversation.map((m, i) => {
                const isIA = m.from === "ia";
                return (
                  <div key={i} className={`flex gap-2 ${isIA ? "" : "flex-row-reverse"}`}>
                    <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center ${isIA ? "bg-primary text-primary-foreground" : "bg-gold text-gold-foreground"}`}>
                      {isIA ? <Bot className="h-4 w-4" /> : <User2 className="h-4 w-4" />}
                    </div>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isIA ? "bg-card border border-border rounded-tl-sm" : "bg-primary text-primary-foreground rounded-tr-sm"}`}>
                      <div>{m.text}</div>
                      <div className={`mt-1 text-[10px] ${isIA ? "text-muted-foreground" : "text-primary-foreground/60"}`}>
                        {new Date(m.time).toLocaleString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-border p-3 bg-background/40 text-xs text-muted-foreground flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> L'IA continue la conversation automatiquement selon vos plages horaires configurées.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
