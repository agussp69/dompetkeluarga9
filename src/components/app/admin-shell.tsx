import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Users, Wallet2, Receipt, ListChecks, Tag,
  ScrollText, BarChart3, Settings, LogOut, Shield, ArrowLeft, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ADMIN_NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/users", label: "Manajemen User", icon: Users },
  { to: "/admin/keluarga", label: "Manajemen Keluarga", icon: Wallet2 },
  { to: "/admin/transaksi", label: "Transaksi", icon: Receipt },
  { to: "/admin/budget-template", label: "Budget Template", icon: ListChecks },
  { to: "/admin/kategori", label: "Kategori", icon: Tag },
  { to: "/admin/audit", label: "Audit Log", icon: ScrollText },
  { to: "/admin/laporan", label: "Laporan Sistem", icon: BarChart3 },
  { to: "/admin/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const initials = (profile?.full_name || profile?.email || "A")
    .split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-display text-base font-semibold">Admin</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} className="rounded-md border border-border p-2">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <div className="flex">
        <aside className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <div className="flex h-full flex-col">
            <div className="hidden h-16 items-center gap-2 border-b border-sidebar-border px-5 lg:flex">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary">
                <Shield className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold leading-none">Panel Admin</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Dompet Keluarga</div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {ADMIN_NAV.map(item => {
                  const isActive = item.to === "/admin"
                    ? location.pathname === "/admin"
                    : location.pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                          isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
                <li className="mt-4 border-t border-sidebar-border pt-3">
                  <Link to="/app" className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Kembali ke App</span>
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="border-t border-sidebar-border p-3">
              <div className="flex items-center gap-3 rounded-md p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{profile?.full_name ?? "Admin"}</div>
                  <div className="truncate text-xs text-muted-foreground">{profile?.email}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Keluar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {mobileOpen ? <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" /> : null}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
