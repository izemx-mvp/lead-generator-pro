import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileSpreadsheet, CheckCircle2, Rocket, Smartphone, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/import")({
  head: () => ({ meta: [{ title: "Import Excel — Naïma AI" }] }),
  component: ImportPage,
});

const previewRows = [
  { nom: "Dubois Marie", email: "m.dubois@mail.com", tel: "+32 475 12 34 56", type: "mobile", ville: "Bruxelles" },
  { nom: "Renard Julien", email: "j.renard@mail.com", tel: "+33 1 45 67 89 01", type: "fixe", ville: "Paris" },
  { nom: "Peeters Sophie", email: "s.peeters@mail.com", tel: "+32 478 55 22 11", type: "mobile", ville: "Anvers" },
  { nom: "Martin Karim", email: "k.martin@mail.com", tel: "+33 4 78 12 34 56", type: "fixe", ville: "Lyon" },
  { nom: "Benali Aïcha", email: "a.benali@mail.com", tel: "+32 496 78 90 12", type: "mobile", ville: "Liège" },
  { nom: "Dupont Pierre", email: "p.dupont@mail.com", tel: "+33 6 12 34 56 78", type: "mobile", ville: "Marseille" },
];

function ImportPage() {
  const navigate = useNavigate();
  const [file, setFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [launching, setLaunching] = useState(false);

  const handleFakeDrop = () => {
    setFile("prospects-immobilier-mars-2026.xlsx");
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 8;
      });
    }, 80);
    toast.success("Fichier analysé", { description: "312 lignes détectées, 4 colonnes mappées." });
  };

  const launch = () => {
    setLaunching(true);
    setTimeout(() => {
      toast.success("Campagne IA lancée", { description: "L'IA a commencé à contacter les prospects selon vos plages horaires." });
      navigate({ to: "/campagnes" });
    }, 900);
  };

  return (
    <AppShell title="Import de prospects" subtitle="Importez un fichier Excel de prospects froids. L'IA détecte automatiquement le canal de contact.">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold mb-4">1. Déposer votre fichier</h3>

          {!file ? (
            <button
              type="button"
              onClick={handleFakeDrop}
              className="w-full border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/60 hover:bg-primary/[0.03] transition-all group"
            >
              <div className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: "var(--gradient-primary)" }}>
                <UploadCloud className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="font-display text-lg font-medium">Glissez votre fichier Excel ici</div>
              <div className="mt-1 text-sm text-muted-foreground">ou cliquez pour parcourir · .xlsx, .xls, .csv — max 20 Mo</div>
              <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Détection auto des colonnes</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> Routage mobile / fixe</span>
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-success" /> RGPD</span>
              </div>
            </button>
          ) : (
            <div className="rounded-xl border border-border p-4 flex items-center gap-4 bg-background/50">
              <div className="h-12 w-12 rounded-lg bg-success/15 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-success" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-sm">{file}</div>
                <div className="text-xs text-muted-foreground">312 lignes · 4 colonnes détectées</div>
                <Progress value={progress} className="mt-2 h-1.5" />
              </div>
              <Badge className="bg-success/15 text-success border-success/30">Prêt</Badge>
            </div>
          )}

          {file && progress >= 100 && (
            <>
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-2">2. Aperçu du mapping ({previewRows.length} sur 312 lignes)</h4>
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom complet</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Téléphone</TableHead>
                        <TableHead>Ville</TableHead>
                        <TableHead>Canal détecté</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((r, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{r.nom}</TableCell>
                          <TableCell className="text-muted-foreground">{r.email}</TableCell>
                          <TableCell className="font-mono text-xs">{r.tel}</TableCell>
                          <TableCell>{r.ville}</TableCell>
                          <TableCell>
                            {r.type === "mobile" ? (
                              <Badge className="gap-1 bg-success/15 text-success border-success/30"><Smartphone className="h-3 w-3" /> WhatsApp</Badge>
                            ) : (
                              <Badge className="gap-1 bg-chart-1/15 text-chart-1 border-chart-1/30"><Mail className="h-3 w-3" /> Email</Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-xl p-4" style={{ background: "var(--gradient-primary)" }}>
                <div className="text-primary-foreground">
                  <div className="font-display text-lg font-semibold">Tout est prêt !</div>
                  <div className="text-xs text-primary-foreground/80">L'IA commencera l'envoi selon vos plages horaires configurées.</div>
                </div>
                <Button size="lg" onClick={launch} disabled={launching} className="bg-gold text-gold-foreground hover:bg-gold/90">
                  <Rocket className="h-4 w-4 mr-2" /> {launching ? "Lancement…" : "Lancer la campagne IA"}
                </Button>
              </div>
            </>
          )}
        </Card>

        <div className="space-y-4">
          <Card className="glass-card p-5">
            <h4 className="font-display font-semibold mb-3">Colonnes attendues</h4>
            <ul className="space-y-2 text-sm">
              {["Nom / Prénom", "Adresse e-mail", "Téléphone (mobile ou fixe)", "Adresse postale", "Ville", "Code postal (optionnel)"].map((c) => (
                <li key={c} className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0" /> {c}
                </li>
              ))}
            </ul>
          </Card>

          <Card className="glass-card p-5">
            <h4 className="font-display font-semibold mb-3">Routage intelligent</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 rounded-lg bg-success/5 border border-success/20 p-3">
                <Smartphone className="h-5 w-5 text-success mt-0.5" />
                <div>
                  <div className="font-medium">Numéro mobile</div>
                  <div className="text-xs text-muted-foreground">Contact via WhatsApp</div>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-lg bg-chart-1/5 border border-chart-1/20 p-3">
                <Phone className="h-5 w-5 text-chart-1 mt-0.5" />
                <div>
                  <div className="font-medium">Numéro fixe uniquement</div>
                  <div className="text-xs text-muted-foreground">Contact par e-mail</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
