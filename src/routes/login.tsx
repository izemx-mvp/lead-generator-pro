import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { BackgroundFx } from "@/components/background-fx";
import { ThemeToggle } from "@/components/theme-toggle";
import { signIn, isAuthed, DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/auth";
import { toast } from "sonner";
import { ArrowRight, Building2, Sparkles, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Connexion — Naïma AI" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState(DEMO_PASSWORD);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthed()) navigate({ to: "/" });
  }, [navigate]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (signIn(email, password)) {
        toast.success("Bienvenue Mme Naïma", { description: "Connexion réussie." });
        navigate({ to: "/" });
      } else {
        toast.error("Identifiants invalides");
        setLoading(false);
      }
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full grain overflow-hidden">
      <BackgroundFx />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Colonne gauche — présentation */}
        <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
          <div
            className="absolute inset-0 -z-10 opacity-90"
            style={{ background: "var(--gradient-primary)" }}
          />
          <div className="absolute inset-0 -z-10 grain opacity-40" />
          <div className="relative">
            <Logo size={44} />
          </div>

          <div className="relative text-primary-foreground max-w-lg">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Plateforme propriétaire · v2026
            </div>
            <h2 className="font-display text-4xl xl:text-5xl font-semibold leading-tight">
              L'IA qui transforme<br />
              vos fichiers froids en <span className="text-gradient-gold">leads chauds</span>.
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-base leading-relaxed">
              Détection automatique de propriétaires vendeurs, qualification via WhatsApp et Email,
              livrables prêts pour vos agences partenaires en Belgique et en France.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <Building2 className="h-5 w-5 text-gold mb-2" />
                <div className="text-2xl font-display font-semibold">+2 400</div>
                <div className="text-xs text-primary-foreground/70">Prospects qualifiés</div>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <Shield className="h-5 w-5 text-gold mb-2" />
                <div className="text-2xl font-display font-semibold">100% RGPD</div>
                <div className="text-xs text-primary-foreground/70">Conformité BE / FR</div>
              </div>
            </div>
          </div>

          <div className="relative text-xs text-primary-foreground/60">
            © 2026 Naïma AI — Tous droits réservés.
          </div>
        </div>

        {/* Colonne droite — formulaire */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <Card className="glass-card w-full max-w-md p-8 shadow-[var(--shadow-elegant)]">
            <div className="lg:hidden mb-6"><Logo size={40} /></div>
            <h1 className="font-display text-2xl font-semibold">Connexion à votre espace</h1>
            <p className="mt-1 text-sm text-muted-foreground">Accédez au backoffice de prospection IA.</p>

            <form onSubmit={submit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse e-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground">Oublié ?</button>
                </div>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 text-sm font-medium">
                {loading ? "Connexion…" : (<>Se connecter <ArrowRight className="ml-2 h-4 w-4" /></>)}
              </Button>

              <div className="rounded-lg border border-dashed border-gold/40 bg-gold/5 p-3 text-xs text-muted-foreground">
                <div className="font-medium text-foreground mb-0.5">🔐 Compte démo pré-rempli</div>
                <div><span className="font-mono">{DEMO_EMAIL}</span> · <span className="font-mono">{DEMO_PASSWORD}</span></div>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
