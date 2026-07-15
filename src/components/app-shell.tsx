import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  Upload,
  Rocket,
  Flame,
  Settings2,
  UserCircle2,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BackgroundFx } from "@/components/background-fx";
import { isAuthed, signOut, DEMO_EMAIL } from "@/lib/auth";

const items = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Import Excel", url: "/import", icon: Upload },
  { title: "Campagnes IA", url: "/campagnes", icon: Rocket },
  { title: "Prospects", url: "/prospects", icon: Users },
  { title: "Leads qualifiés", url: "/leads", icon: Flame },
  { title: "Configuration", url: "/configuration", icon: Settings2 },
  { title: "Paramètres", url: "/parametres", icon: UserCircle2 },
];

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthed()) {
      navigate({ to: "/login" });
    } else {
      setReady(true);
    }
  }, [navigate]);

  if (!ready) return null;

  const handleLogout = () => {
    signOut();
    navigate({ to: "/login" });
  };

  return (
    <SidebarProvider>
      <BackgroundFx />
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon" className="border-r border-sidebar-border">
          <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Espace de travail</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => {
                    const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
                    return (
                      <SidebarMenuItem key={item.url}>
                        <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                          <Link to={item.url} className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-sidebar-border p-3">
            <div className="flex items-center gap-2 rounded-lg px-2 py-1.5">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">N</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                <div className="text-xs font-medium truncate">Mme Naïma</div>
                <div className="text-[10px] text-muted-foreground truncate">{DEMO_EMAIL}</div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                aria-label="Se déconnecter"
                className="h-8 w-8 group-data-[collapsible=icon]:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-16 flex items-center gap-3 border-b border-border/60 bg-background/70 px-4 backdrop-blur-xl">
            <SidebarTrigger />
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Rechercher un prospect, une campagne…" className="pl-9 w-80 bg-background/60" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex gap-1 border-success/40 bg-success/10 text-success">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> IA active
              </Badge>
              <Button variant="outline" size="icon" aria-label="Notifications" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-destructive" />
              </Button>
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 p-6 md:p-8">
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
              {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
