import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prospects, campagnes, serieActivite, leadsQualifies } from "@/lib/mock-data";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Legend } from "recharts";
import { ArrowUpRight, MessageSquare, Send, Flame, Users, Sparkles, MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Tableau de bord — Naïma AI" }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const totalEnvoyes = campagnes.reduce((s, c) => s + c.envoyes, 0);
  const totalReponses = campagnes.reduce((s, c) => s + c.reponses, 0);
  const tauxReponse = Math.round((totalReponses / Math.max(1, totalEnvoyes)) * 100);

  const kpis = [
    { label: "Prospects importés", value: prospects.length, hint: "+12 cette semaine", icon: Users, tone: "primary" },
    { label: "Messages envoyés", value: totalEnvoyes, hint: `${totalReponses} réponses`, icon: Send, tone: "chart-1" },
    { label: "Taux de réponse", value: `${tauxReponse}%`, hint: "Moyenne 30 jours", icon: MessageSquare, tone: "chart-2" },
    { label: "Leads chauds", value: leadsQualifies.length, hint: "Prêts à revendre", icon: Flame, tone: "success" },
  ];

  const canalData = [
    { name: "WhatsApp", value: prospects.filter((p) => p.canal === "whatsapp").length },
    { name: "Email", value: prospects.filter((p) => p.canal === "email").length },
  ];
  const canalColors = ["oklch(0.62 0.14 155)", "oklch(0.55 0.15 265)"];

  const activite = [...prospects]
    .sort((a, b) => (a.derniereActivite < b.derniereActivite ? 1 : -1))
    .slice(0, 6);

  return (
    <AppShell title="Tableau de bord" subtitle="Vue d'ensemble de vos campagnes IA en cours">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label} className="glass-card p-5 relative overflow-hidden">
            <div className={`absolute top-0 right-0 h-24 w-24 -mr-6 -mt-6 rounded-full bg-${k.tone}/10 blur-2xl`} />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{k.label}</div>
                <div className="mt-2 font-display text-3xl font-semibold">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.hint}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <k.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Graph + Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-semibold">Activité IA — 30 derniers jours</h3>
              <p className="text-xs text-muted-foreground">Messages envoyés, réponses obtenues et leads qualifiés.</p>
            </div>
            <Badge variant="outline" className="gap-1"><Sparkles className="h-3 w-3" /> Temps réel</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={serieActivite}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.15 265)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.55 0.15 265)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.72 0.13 65)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.72 0.13 65)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.62 0.14 155)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.62 0.14 155)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="envoyes" name="Envoyés" stroke="oklch(0.55 0.15 265)" fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="reponses" name="Réponses" stroke="oklch(0.72 0.13 65)" fill="url(#g2)" strokeWidth={2} />
                <Area type="monotone" dataKey="qualifies" name="Qualifiés" stroke="oklch(0.62 0.14 155)" fill="url(#g3)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="font-display text-lg font-semibold">Répartition par canal</h3>
          <p className="text-xs text-muted-foreground">Détection automatique mobile / fixe.</p>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={canalData} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={4}>
                  {canalData.map((_, i) => (<Cell key={i} fill={canalColors[i]} />))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Feed activité + quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-semibold">Activité récente</h3>
            <Link to="/prospects"><Button variant="ghost" size="sm">Tout voir <ArrowUpRight className="ml-1 h-3 w-3" /></Button></Link>
          </div>
          <div className="space-y-3">
            {activite.map((p) => (
              <div key={p.id} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/50 p-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {p.prenom[0]}{p.nom[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.prenom} {p.nom} <span className="text-muted-foreground font-normal">· {p.ville}</span></div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.conversation[p.conversation.length - 1]?.text ?? "En attente de contact"}
                  </div>
                </div>
                <Badge variant="outline" className="capitalize">{p.canal}</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6 flex flex-col">
          <h3 className="font-display text-lg font-semibold">Actions rapides</h3>
          <p className="text-xs text-muted-foreground mb-4">Lancez une nouvelle campagne en quelques clics.</p>
          <div className="space-y-2 flex-1">
            <Link to="/import"><Button className="w-full justify-start" variant="default"><Send className="h-4 w-4 mr-2" /> Importer un fichier Excel</Button></Link>
            <Link to="/leads"><Button className="w-full justify-start" variant="outline"><Flame className="h-4 w-4 mr-2" /> Consulter les leads chauds</Button></Link>
            <Link to="/configuration"><Button className="w-full justify-start" variant="outline"><MessagesSquare className="h-4 w-4 mr-2" /> Configurer les relances</Button></Link>
          </div>
          <div className="mt-4 rounded-lg p-3 text-xs" style={{ background: "var(--gradient-gold)", color: "var(--gold-foreground)" }}>
            <div className="font-semibold">💡 Astuce</div>
            L'IA détecte automatiquement le canal optimal (WhatsApp / Email) pour chaque prospect.
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
