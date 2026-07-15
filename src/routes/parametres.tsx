import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DEMO_EMAIL, signOut } from "@/lib/auth";
import { LogOut, ShieldCheck, CreditCard } from "lucide-react";

export const Route = createFileRoute("/parametres")({
  head: () => ({ meta: [{ title: "Paramètres — Naïma AI" }] }),
  component: ParametresPage,
});

function ParametresPage() {
  const navigate = useNavigate();
  const logout = () => { signOut(); navigate({ to: "/login" }); };

  return (
    <AppShell title="Paramètres" subtitle="Compte, sécurité et abonnement">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="glass-card p-6 md:col-span-2">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="bg-primary text-primary-foreground font-display text-xl">N</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-display text-lg font-semibold">Mme Naïma</div>
              <div className="text-sm text-muted-foreground">{DEMO_EMAIL}</div>
              <Badge className="mt-1 bg-gold/20 text-gold-foreground border-gold/30">Compte Pro · BE / FR</Badge>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div><Label>Nom complet</Label><Input defaultValue="Naïma Benhaddou" /></div>
            <div><Label>Société</Label><Input defaultValue="Naïma AI Prospection" /></div>
            <div><Label>Email</Label><Input defaultValue={DEMO_EMAIL} /></div>
            <div><Label>Téléphone</Label><Input defaultValue="+32 475 00 00 00" /></div>
          </div>

          <div className="mt-6 flex gap-2">
            <Button>Enregistrer</Button>
            <Button variant="outline" onClick={logout}><LogOut className="h-4 w-4 mr-2" /> Se déconnecter</Button>
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2"><ShieldCheck className="h-4 w-4 text-success" /><h4 className="font-display font-semibold">Sécurité</h4></div>
            <p className="text-xs text-muted-foreground mb-3">Authentification à deux facteurs recommandée.</p>
            <Button variant="outline" size="sm" className="w-full">Activer la 2FA</Button>
          </Card>
          <Card className="glass-card p-5">
            <div className="flex items-center gap-2 mb-2"><CreditCard className="h-4 w-4 text-gold" /><h4 className="font-display font-semibold">Abonnement</h4></div>
            <p className="text-xs text-muted-foreground">Plan <strong className="text-foreground">Pro Illimité</strong> — 5 000 crédits IA / mois.</p>
            <Button variant="outline" size="sm" className="w-full mt-3">Gérer</Button>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
