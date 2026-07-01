import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Users, Wallet2, Receipt, Activity } from "lucide-react";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR, formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [{ title: "Admin Dashboard · Dompet Keluarga" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!r) throw redirect({ to: "/app" });
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { data } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, fams, txnCount, totalAmounts, audit] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("families").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("id", { count: "exact", head: true }),
        // Gunakan RPC aggregate — tidak load semua baris transaksi
        supabase.rpc("get_admin_monthly_report"),
        supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(8),
      ]);
      const rows = (totalAmounts.data ?? []) as { total_income: number; total_expense: number }[];
      const totalAmount = rows.reduce((s, r) => s + Number(r.total_income) + Number(r.total_expense), 0);
      return {
        users: users.count ?? 0,
        fams: fams.count ?? 0,
        txnCount: txnCount.count ?? 0,
        totalAmount,
        audit: audit.data ?? [],
      };
    },
  });

  return (
    <AdminShell>
      <PageHeader eyebrow="Panel Admin" title="Dashboard Sistem" description="Pantau penggunaan aplikasi secara keseluruhan." />

      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Total User" value={String(data?.users ?? 0)} />
        <Stat icon={Wallet2} label="Total Keluarga" value={String(data?.fams ?? 0)} />
        <Stat icon={Receipt} label="Total Transaksi" value={String(data?.txnCount ?? 0)} />
        <Stat icon={Activity} label="Volume Tercatat" value={formatIDR(data?.totalAmount ?? 0)} />
      </div>

      <div className="mt-8 rounded-lg border border-border bg-card p-5">
        <h2 className="font-display text-base font-semibold">Aktivitas Sistem Terbaru</h2>
        <ul className="mt-4 divide-y divide-border text-sm">
          {(data?.audit ?? []).length === 0 ? <li className="py-6 text-center text-muted-foreground">Belum ada aktivitas.</li> : data!.audit.map((a: any) => (
            <li key={a.id} className="flex items-center justify-between py-3">
              <span>{a.action} <span className="text-muted-foreground">· {a.entity}</span></span>
              <span className="text-xs text-muted-foreground">{formatDateTime(a.created_at)}</span>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
