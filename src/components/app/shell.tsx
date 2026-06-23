import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, ArrowDownCircle, ArrowUpCircle, PiggyBank, Target,
  History, BarChart3, Bell, Users, User, Settings, LogOut, Shield,
  Wallet, Menu, X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, useIsAdmin } from "@/hooks/use-profile";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/pemasukan", label: "Pemasukan", icon: ArrowDownCircle },
  { to: "/app/pengeluaran", label: "Pengeluaran", icon: ArrowUpCircle },
  { to: "/app/budget", label: "Budget Bulanan", icon: PiggyBank },
  { to: "/app/tabungan", label: "Tabungan Impian", icon: Target },
  { to: "/app/laporan", label: "Laporan", icon: BarChart3 },
  { to: "/app/riwayat", label: "Riwayat", icon: History },
  { to: "/app/notifikasi", label: "Notifikasi", icon: Bell },
  { to: "/app/keluarga", label: "Anggota Keluarga", icon: Users },
  { to: "/app/profil", label: "Profil", icon: User },
  { to: "/app/pengaturan", label: "Pengaturan", icon: Settings },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const { data: profile } = useProfile();
  const { data: isAdmin } = useIsAdmin();
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

  const initials = (profile?.full_name || profile?.email || "U")
    .split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile topbar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="font-display text-base font-semibold">Dompet Keluarga</span>
        </div>
        <button onClick={() => setMobileOpen(v => !v)} className="rounded-md border border-border p-2">
          {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex h-full flex-col">
            <div className="hidden h-16 items-center gap-2 border-b border-sidebar-border px-5 lg:flex">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary">
                <Wallet className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-display text-sm font-semibold leading-none">Dompet Keluarga</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">Keuangan Bersama</div>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <ul className="space-y-0.5">
                {NAV.map(item => {
                  const isActive = item.to === "/app"
                    ? location.pathname === "/app"
                    : location.pathname.startsWith(item.to);
                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-sidebar-foreground hover:bg-sidebar-accent"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
                {isAdmin ? (
                  <li className="mt-4 border-t border-sidebar-border pt-3">
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                        location.pathname.startsWith("/admin")
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent"
                      )}
                    >
                      <Shield className="h-4 w-4" />
                      <span>Panel Admin</span>
                    </Link>
                  </li>
                ) : null}
              </ul>
            </nav>

            <div className="border-t border-sidebar-border p-3">
              <div className="flex items-center gap-3 rounded-md p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{profile?.full_name ?? "Pengguna"}</div>
                  <div className="truncate text-xs text-muted-foreground">{profile?.email}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut} title="Keluar">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </aside>

        {/* Backdrop */}
        {mobileOpen ? (
          <div onClick={() => setMobileOpen(false)} className="fixed inset-0 z-30 bg-foreground/20 lg:hidden" />
        ) : null}

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

export function PageHeader({
  eyebrow, title, description, action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-6">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="mb-2 font-display text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
