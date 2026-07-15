import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useConfig, joursLabels, type AppConfig } from "@/lib/config-store";
import { Clock, CalendarClock, MessagesSquare, Save, RefreshCw, Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/configuration")({
  head: () => ({ meta: [{ title: "Configuration — Naïma AI" }] }),
  component: ConfigurationPage,
});

function ConfigurationPage() {
  const { config, update } = useConfig();

  const save = () => toast.success("Configuration enregistrée", { description: "Vos préférences ont été mises à jour." });

  const addQuestion = () =>
    update((c) => ({ ...c, script: { questions: [...c.script.questions, "Nouvelle question ?"] } }));

  const removeQuestion = (i: number) =>
    update((c) => ({ ...c, script: { questions: c.script.questions.filter((_, idx) => idx !== i) } }));

  const updateQuestion = (i: number, v: string) =>
    update((c) => ({
      ...c,
      script: { questions: c.script.questions.map((q, idx) => (idx === i ? v : q)) },
    }));

  return (
    <AppShell title="Configuration" subtitle="Paramètres de relance, plages horaires et script IA">
      <Tabs defaultValue="relances" className="w-full">
        <TabsList className="glass-card p-1 h-auto">
          <TabsTrigger value="relances" className="gap-2"><RefreshCw className="h-3.5 w-3.5" /> Relances</TabsTrigger>
          <TabsTrigger value="plages" className="gap-2"><CalendarClock className="h-3.5 w-3.5" /> Plages horaires</TabsTrigger>
          <TabsTrigger value="script" className="gap-2"><MessagesSquare className="h-3.5 w-3.5" /> Script IA</TabsTrigger>
        </TabsList>

        {/* --- Relances --- */}
        <TabsContent value="relances" className="mt-6 space-y-4">
          <Card className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold mb-1">Stratégie de relance</h3>
            <p className="text-sm text-muted-foreground mb-6">Définit à quel moment et à quelle fréquence l'IA relance les prospects qui n'ont pas répondu.</p>

            <div className="grid gap-6 md:grid-cols-3">
              <SliderField
                label="Délai avant la 1ère relance"
                value={config.relance.delaiPremiereHeures}
                min={1} max={168} step={1} suffix="h"
                onChange={(v) => update((c) => ({ ...c, relance: { ...c.relance, delaiPremiereHeures: v } }))}
                hint={`${humanHours(config.relance.delaiPremiereHeures)} après le 1er message`}
              />
              <SliderField
                label="Nombre maximum de relances"
                value={config.relance.nombreMax}
                min={1} max={10} step={1}
                onChange={(v) => update((c) => ({ ...c, relance: { ...c.relance, nombreMax: v } }))}
                hint={`${config.relance.nombreMax} relance${config.relance.nombreMax > 1 ? "s" : ""} avant abandon`}
              />
              <SliderField
                label="Intervalle entre relances"
                value={config.relance.intervalleHeures}
                min={1} max={168} step={1} suffix="h"
                onChange={(v) => update((c) => ({ ...c, relance: { ...c.relance, intervalleHeures: v } }))}
                hint={humanHours(config.relance.intervalleHeures)}
              />
            </div>
          </Card>

          <SaveBar onSave={save} />
        </TabsContent>

        {/* --- Plages horaires --- */}
        <TabsContent value="plages" className="mt-6 space-y-4">
          <Card className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-semibold">Plages horaires autorisées</h3>
                <p className="text-sm text-muted-foreground">L'IA ne contactera les prospects que dans ces créneaux.</p>
              </div>
              <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> {config.plages.fuseau}</Badge>
            </div>

            <div className="space-y-2.5">
              {(Object.keys(joursLabels) as (keyof AppConfig["plages"]["jours"])[]).map((k) => {
                const j = config.plages.jours[k];
                return (
                  <div key={k} className={`grid grid-cols-12 items-center gap-3 rounded-lg border p-3 transition-colors ${j.actif ? "bg-background/60 border-border" : "bg-muted/40 border-border/40 opacity-70"}`}>
                    <div className="col-span-4 md:col-span-3 flex items-center gap-3">
                      <Switch checked={j.actif} onCheckedChange={(v) => update((c) => ({ ...c, plages: { ...c.plages, jours: { ...c.plages.jours, [k]: { ...j, actif: v } } } }))} />
                      <span className="font-medium">{joursLabels[k]}</span>
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <Label className="text-[10px] uppercase text-muted-foreground">Début</Label>
                      <Input type="time" value={j.debut} disabled={!j.actif}
                        onChange={(e) => update((c) => ({ ...c, plages: { ...c.plages, jours: { ...c.plages.jours, [k]: { ...j, debut: e.target.value } } } }))} />
                    </div>
                    <div className="col-span-4 md:col-span-3">
                      <Label className="text-[10px] uppercase text-muted-foreground">Fin</Label>
                      <Input type="time" value={j.fin} disabled={!j.actif}
                        onChange={(e) => update((c) => ({ ...c, plages: { ...c.plages, jours: { ...c.plages.jours, [k]: { ...j, fin: e.target.value } } } }))} />
                    </div>
                    <div className="hidden md:block col-span-3 text-xs text-muted-foreground text-right">
                      {j.actif ? `${durationHours(j.debut, j.fin)}h de plage active` : "Inactif"}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <Card className="glass-card p-6">
            <h4 className="font-display font-semibold mb-3">Aperçu de la semaine type</h4>
            <div className="relative">
              <div className="flex text-[10px] text-muted-foreground mb-1 pl-16">
                {Array.from({ length: 25 }).map((_, h) => h % 4 === 0 && (
                  <div key={h} style={{ width: `${(4 / 24) * 100}%` }}>{String(h).padStart(2, "0")}h</div>
                ))}
              </div>
              {(Object.keys(joursLabels) as (keyof AppConfig["plages"]["jours"])[]).map((k) => {
                const j = config.plages.jours[k];
                const startPct = (toMin(j.debut) / (24 * 60)) * 100;
                const widthPct = ((toMin(j.fin) - toMin(j.debut)) / (24 * 60)) * 100;
                return (
                  <div key={k} className="flex items-center gap-2 mb-1.5">
                    <div className="w-14 text-xs text-muted-foreground">{joursLabels[k].slice(0, 3)}</div>
                    <div className="relative flex-1 h-6 rounded bg-muted/60">
                      {j.actif && (
                        <div className="absolute inset-y-0 rounded" style={{ left: `${startPct}%`, width: `${widthPct}%`, background: "var(--gradient-gold)" }} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <SaveBar onSave={save} />
        </TabsContent>

        {/* --- Script --- */}
        <TabsContent value="script" className="mt-6 space-y-4">
          <Card className="glass-card p-6">
            <div className="flex items-start justify-between mb-6 gap-4">
              <div>
                <h3 className="font-display text-lg font-semibold mb-1">Script de qualification IA</h3>
                <p className="text-sm text-muted-foreground">Ajoutez, modifiez ou supprimez les questions que l'IA pose à chaque prospect pour qualifier un lead.</p>
              </div>
              <Button onClick={addQuestion} size="sm"><Plus className="h-4 w-4 mr-1" /> Ajouter une question</Button>
            </div>
            <div className="space-y-3">
              {config.script.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="flex flex-col items-center gap-1 pt-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center">{i + 1}</span>
                  </div>
                  <Textarea
                    rows={2}
                    value={q}
                    onChange={(e) => updateQuestion(i, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(i)}
                    disabled={config.script.questions.length <= 1}
                    aria-label="Supprimer"
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {config.script.questions.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-6">Aucune question. Ajoutez-en une pour commencer.</div>
              )}
            </div>
          </Card>
          <SaveBar onSave={save} />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function SliderField({ label, value, min, max, step, suffix = "", onChange, hint }: { label: string; value: number; min: number; max: number; step: number; suffix?: string; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <span className="font-display text-xl font-semibold">{value}{suffix}</span>
      </div>
      <Slider value={[value]} min={min} max={max} step={step} onValueChange={(v) => onChange(v[0])} />
      {hint && <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>}
    </div>
  );
}

function SaveBar({ onSave }: { onSave: () => void }) {
  return (
    <div className="sticky bottom-4 flex justify-end">
      <Button onClick={onSave} className="shadow-[var(--shadow-elegant)]"><Save className="h-4 w-4 mr-2" /> Enregistrer les changements</Button>
    </div>
  );
}

function humanHours(h: number) {
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  const rest = h % 24;
  return rest ? `${d}j ${rest}h` : `${d} jour${d > 1 ? "s" : ""}`;
}

function toMin(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function durationHours(a: string, b: string) {
  return Math.max(0, Math.round(((toMin(b) - toMin(a)) / 60) * 10) / 10);
}
