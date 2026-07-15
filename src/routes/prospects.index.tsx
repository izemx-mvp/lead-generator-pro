import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { prospects, statutLabels, statutColors, type Statut, type Canal } from "@/lib/mock-data";
import { Search, ChevronRight, Smartphone, Mail, Download, Flame } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/prospects/")({
  head: () => ({ meta: [{ title: "Prospects — Vendra AI" }] }),
  component: ProspectsList,
});

function ProspectsList() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [canal, setCanal] = useState<"tous" | Canal>("tous");
  const [statut, setStatut] = useState<"tous" | Statut>("tous");

  // Read ?q= from URL on mount (from header search)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const v = params.get("q");
    if (v) setQ(v);
  }, []);

  const filtered = useMemo(() => {
    return prospects.filter((p) => {
      if (canal !== "tous" && p.canal !== canal) return false;
      if (statut !== "tous" && p.statut !== statut) return false;
      if (q) {
        const s = q.toLowerCase();
        return (
          p.nom.toLowerCase().includes(s) ||
          p.prenom.toLowerCase().includes(s) ||
          p.ville.toLowerCase().includes(s) ||
          p.email.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [q, canal, statut]);

  const qualifies = useMemo(() => prospects.filter((p) => p.statut === "qualifie"), []);

  const downloadQualifies = () => {
    const rows = [
      ["Prénom", "Nom", "Email", "Téléphone", "Adresse", "Ville", "Pays", "Canal"],
      ...qualifies.map((p) => [p.prenom, p.nom, p.email, p.telephone, p.adresse, p.ville, p.pays, p.canal]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-qualifies-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Téléchargement lancé", { description: `${qualifies.length} lead${qualifies.length > 1 ? "s" : ""} qualifié${qualifies.length > 1 ? "s" : ""} exporté${qualifies.length > 1 ? "s" : ""}.` });
  };

  const resetFilters = () => {
    setQ("");
    setCanal("tous");
    setStatut("tous");
  };

  return (
    <AppShell title="Prospects" subtitle={`${prospects.length} prospects au total · ${filtered.length} affichés`}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Badge variant="outline" className="gap-1 border-gold/40 bg-gold/10 text-gold-foreground">
          <Flame className="h-3 w-3 text-gold" /> {qualifies.length} lead{qualifies.length > 1 ? "s" : ""} qualifié{qualifies.length > 1 ? "s" : ""}
        </Badge>
        <Button onClick={downloadQualifies} disabled={qualifies.length === 0} className="bg-gold text-gold-foreground hover:bg-gold/90">
          <Download className="h-4 w-4 mr-2" /> Télécharger les leads qualifiés (.csv)
        </Button>
      </div>

      <Card className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Rechercher par nom, ville, e-mail…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-9" />
          </div>
          <Select value={canal} onValueChange={(v) => setCanal(v as typeof canal)}>
            <SelectTrigger className="md:w-48"><SelectValue placeholder="Canal" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les canaux</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statut} onValueChange={(v) => setStatut(v as typeof statut)}>
            <SelectTrigger className="md:w-56"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="tous">Tous les statuts</SelectItem>
              {Object.entries(statutLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={resetFilters}>Réinitialiser</Button>
        </div>
      </Card>

      <Card className="glass-card mt-4 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prospect</TableHead>
              <TableHead>Ville</TableHead>
              <TableHead>Canal</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id} onClick={() => navigate({ to: "/prospects/$id", params: { id: p.id } })} className="cursor-pointer">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 text-primary text-xs font-semibold flex items-center justify-center">
                      {p.prenom[0]}{p.nom[0]}
                    </div>
                    <div>
                      <div className="font-medium">{p.prenom} {p.nom}</div>
                      <div className="text-xs text-muted-foreground">{p.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell><span className="text-sm">{p.ville}</span> <Badge variant="outline" className="ml-1 text-[10px]">{p.pays}</Badge></TableCell>
                <TableCell>
                  {p.canal === "whatsapp" ? (
                    <Badge className="gap-1 bg-success/15 text-success border-success/30"><Smartphone className="h-3 w-3" /> WhatsApp</Badge>
                  ) : (
                    <Badge className="gap-1 bg-chart-1/15 text-chart-1 border-chart-1/30"><Mail className="h-3 w-3" /> Email</Badge>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs">{p.telephone}</TableCell>
                <TableCell><Badge className={statutColors[p.statut]}>{statutLabels[p.statut]}</Badge></TableCell>
                <TableCell><ChevronRight className="h-4 w-4 text-muted-foreground" /></TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Aucun prospect trouvé.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </AppShell>
  );
}
