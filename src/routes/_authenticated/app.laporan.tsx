import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, formatCompact, monthNameId } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/laporan")({
  head: () => ({ meta: [{ title: "Laporan · Dompet Keluarga" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const [period, setPeriod] = useState("month");
  const now = new Date();

  const { data } = useQuery({
    enabled: !!familyId,
    queryKey: ["report", familyId, period],
    queryFn: async () => {
      let from = new Date(now.getFullYear(), now.getMonth(), 1);
      if (period === "week") from = new Date(now.getTime() - 7 * 86400000);
      else if (period === "year") from = new Date(now.getFullYear(), 0, 1);
      else if (period === "day") from = now;

      const { data: txns } = await supabase
        .from("transactions")
        .select("type, amount, occurred_at, category_id, categories:category_id(name)")
        .eq("family_id", familyId!)
        .gte("occurred_at", from.toISOString().slice(0, 10))
        .order("occurred_at");

      const list = (txns ?? []) as any[];
      const income = list.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const expense = list.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
      const balance = income - expense;
      const savingRate = income > 0 ? Math.max(0, ((income - expense) / income) * 100) : 0;

      // Series per day or month
      const buckets = new Map<string, { label: string; income: number; expense: number }>();
      list.forEach(t => {
        const key = period === "year" ? t.occurred_at.slice(0, 7) : t.occurred_at;
        const label = period === "year" ? monthNameId(Number(t.occurred_at.slice(5, 7))).slice(0, 3) : t.occurred_at.slice(5);
        const b = buckets.get(key) ?? { label, income: 0, expense: 0 };
        if (t.type === "income") b.income += Number(t.amount); else b.expense += Number(t.amount);
        buckets.set(key, b);
      });
      const series = Array.from(buckets.entries()).sort(([a],[b]) => a.localeCompare(b)).map(([,v]) => v);

      // Top categories
      const cats = new Map<string, number>();
      list.filter(t => t.type === "expense").forEach(t => {
        const n = t.categories?.name ?? "Lainnya";
        cats.set(n, (cats.get(n) ?? 0) + Number(t.amount));
      });
      const pie = Array.from(cats.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

      return { income, expense, balance, savingRate, series, pie, raw: list };
    },
  });

  const exportCSV = () => {
    if (!data) return;
    const header = ["Tanggal","Jenis","Kategori","Nominal"];
    const rows = data.raw.map((t: any) => [t.occurred_at, t.type, t.categories?.name ?? "", t.amount]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `laporan-${period}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const COLORS = ["var(--color-primary)","var(--color-success)","var(--color-warning)","var(--color-destructive)","var(--color-chart-5)","oklch(0.65 0.1 200)"];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Analisis"
        title="Laporan Keuangan"
        description="Visualisasi pemasukan, pengeluaran, dan komposisi keuangan keluarga."
        action={
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Harian</SelectItem>
                <SelectItem value="week">Mingguan</SelectItem>
                <SelectItem value="month">Bulanan</SelectItem>
                <SelectItem value="year">Tahunan</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV}><Download className="mr-1 h-4 w-4" />Export CSV</Button>
          </div>
        }
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
        <Stat label="Total Pemasukan" value={formatIDR(data?.income ?? 0)} tone="success" />
        <Stat label="Total Pengeluaran" value={formatIDR(data?.expense ?? 0)} tone="destructive" />
        <Stat label="Saldo" value={formatIDR(data?.balance ?? 0)} />
        <Stat label="Rasio Tabungan" value={`${(data?.savingRate ?? 0).toFixed(0)}%`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel title="Area Cashflow">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.series ?? []}>
                <defs>
                  <linearGradient id="ar-inc" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="ar-exp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.3} /><stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} /></linearGradient>
                </defs>
                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={60} stroke="var(--color-muted-foreground)" />
                <Tooltip formatter={(v: any) => formatIDR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="income" stroke="var(--color-success)" fill="url(#ar-inc)" />
                <Area type="monotone" dataKey="expense" stroke="var(--color-destructive)" fill="url(#ar-exp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Bar Perbandingan">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.series ?? []}>
                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={60} stroke="var(--color-muted-foreground)" />
                <Tooltip formatter={(v: any) => formatIDR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Pemasukan" fill="var(--color-success)" />
                <Bar dataKey="expense" name="Pengeluaran" fill="var(--color-destructive)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Line Tren">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.series ?? []}>
                <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={60} stroke="var(--color-muted-foreground)" />
                <Tooltip formatter={(v: any) => formatIDR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Line type="monotone" dataKey="income" stroke="var(--color-success)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="expense" stroke="var(--color-destructive)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Pie Kategori Pengeluaran">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data?.pie ?? []} dataKey="value" nameKey="name" outerRadius={80}>
                  {(data?.pie ?? []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v: any) => formatIDR(v)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Top Kategori Pengeluaran" className="mt-6">
        {data?.pie.length ? (
          <ul className="divide-y divide-border">
            {data.pie.slice(0, 10).map((c, i) => (
              <li key={c.name} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-muted text-xs font-medium">{i + 1}</span>
                  <span className="font-medium">{c.name}</span>
                </div>
                <span className="font-display font-semibold">{formatIDR(c.value)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm text-muted-foreground">Belum ada data.</p>}
      </Panel>
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success"|"destructive" }) {
  return (
    <div className="bg-card p-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-xl font-semibold sm:text-2xl ${tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-border bg-card p-5 ${className ?? ""}`}>
      <h3 className="mb-4 font-display text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
