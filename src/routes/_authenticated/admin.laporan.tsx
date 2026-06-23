import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR } from "@/lib/format";
import { adminGuard } from "@/lib/admin-guard";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

export const Route = createFileRoute("/_authenticated/admin/laporan")({
  head: () => ({ meta: [{ title: "Laporan Sistem · Admin" }] }),
  beforeLoad: adminGuard,
  component: () => {
    const { data } = useQuery({
      queryKey: ["admin-report"],
      queryFn: async () => {
        const { data: txns } = await supabase.from("transactions").select("type, amount, occurred_at");
        const list = txns ?? [];
        const totals: Record<string, { label: string; income: number; expense: number }> = {};
        list.forEach((t: any) => {
          const k = t.occurred_at.slice(0, 7);
          totals[k] = totals[k] ?? { label: k, income: 0, expense: 0 };
          if (t.type === "income") totals[k].income += Number(t.amount); else totals[k].expense += Number(t.amount);
        });
        return { series: Object.values(totals).sort((a, b) => a.label.localeCompare(b.label)), totalIn: list.filter((t: any) => t.type==="income").reduce((s:number,t:any)=>s+Number(t.amount),0), totalEx: list.filter((t: any) => t.type==="expense").reduce((s:number,t:any)=>s+Number(t.amount),0) };
      },
    });
    return (
      <AdminShell>
        <PageHeader eyebrow="Sistem" title="Laporan Sistem" />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          <div className="bg-card p-5"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pemasukan Sistem</p><p className="mt-2 font-display text-2xl font-semibold text-success">{formatIDR(data?.totalIn ?? 0)}</p></div>
          <div className="bg-card p-5"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pengeluaran Sistem</p><p className="mt-2 font-display text-2xl font-semibold text-destructive">{formatIDR(data?.totalEx ?? 0)}</p></div>
        </div>
        <div className="mt-6 rounded-lg border border-border bg-card p-5">
          <h3 className="mb-4 font-display text-base font-semibold">Tren Bulanan</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.series ?? []}>
                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Bar dataKey="income" fill="var(--color-success)" />
                <Bar dataKey="expense" fill="var(--color-destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </AdminShell>
    );
  },
});
