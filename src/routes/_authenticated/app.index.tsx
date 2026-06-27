import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownCircle, ArrowUpCircle, Wallet, TrendingUp, Target, AlertTriangle,
  Plus, Lightbulb,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";
import { AppShell, PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, formatCompact, formatDate, monthNameId } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/_authenticated/app/")({
  head: () => ({ meta: [{ title: "Dashboard · Dompet Keluarga" }] }),
  component: Dashboard,
});

function useDashboardData(familyId: string | null | undefined) {
  return useQuery({
    enabled: !!familyId,
    queryKey: ["dashboard", familyId],
    queryFn: async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);

      const [allTxn, monthTxn, goals, recent, categories] = await Promise.all([
        supabase.from("transactions").select("type, amount").eq("family_id", familyId!),
        supabase.from("transactions").select("type, amount, occurred_at, category_id").eq("family_id", familyId!).gte("occurred_at", sixMonthsAgo),
        supabase.from("savings_goals").select("id, name, target_amount, savings_contributions(amount)").eq("family_id", familyId!),
        supabase.from("transactions").select("id, type, amount, description, occurred_at, category_id, user_id, categories:category_id(name)").eq("family_id", familyId!).order("created_at", { ascending: false }).limit(6),
        supabase.from("categories").select("id, name, type").or(`is_global.eq.true,family_id.eq.${familyId}`),
      ]);

      const txns = (allTxn.data ?? []) as { type: string; amount: number }[];
      const totalIncome = txns.filter(t => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
      const totalExpense = txns.filter(t => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
      const balance = totalIncome - totalExpense;

      const monthData = (monthTxn.data ?? []) as { type: string; amount: number; occurred_at: string; category_id: string | null }[];
      const monthIncome = monthData.filter(t => t.type === "income" && t.occurred_at >= monthStart).reduce((s, t) => s + Number(t.amount), 0);
      const monthExpense = monthData.filter(t => t.type === "expense" && t.occurred_at >= monthStart).reduce((s, t) => s + Number(t.amount), 0);
      const savingRate = monthIncome > 0 ? Math.max(0, ((monthIncome - monthExpense) / monthIncome) * 100) : 0;

      // 6 months series
      const months: { label: string; income: number; expense: number; key: string }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        months.push({ key, label: monthNameId(d.getMonth() + 1).slice(0, 3), income: 0, expense: 0 });
      }
      for (const t of monthData) {
        const k = t.occurred_at.slice(0, 7);
        const m = months.find(x => x.key === k);
        if (!m) continue;
        if (t.type === "income") m.income += Number(t.amount);
        else m.expense += Number(t.amount);
      }

      // Category distribution (expense, this month)
      const catMap = new Map<string, string>();
      (categories.data ?? []).forEach((c: any) => catMap.set(c.id, c.name));
      const catTotals = new Map<string, number>();
      monthData.filter(t => t.type === "expense" && t.occurred_at >= monthStart).forEach(t => {
        const name = (t.category_id && catMap.get(t.category_id)) || "Lainnya";
        catTotals.set(name, (catTotals.get(name) ?? 0) + Number(t.amount));
      });
      const pie = Array.from(catTotals.entries()).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6);

      // Goals
      const goalProgress = (goals.data ?? []).map((g: any) => {
        const saved = (g.savings_contributions ?? []).reduce((s: number, c: any) => s + Number(c.amount), 0);
        return { id: g.id, name: g.name, target: Number(g.target_amount), saved, pct: g.target_amount ? Math.min(100, (saved / Number(g.target_amount)) * 100) : 0 };
      }).slice(0, 3);

      return {
        balance, totalIncome, totalExpense,
        monthIncome, monthExpense, savingRate,
        months, pie, goalProgress,
        recent: recent.data ?? [],
      };
    },
  });
}

function Dashboard() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const { data, isLoading } = useDashboardData(familyId);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
  }, []);

  const insights = useMemo(() => {
    if (!data) return [] as string[];
    const out: string[] = [];
    if (data.savingRate > 20) out.push(`Hebat! Rasio Dompet Keluarga bulan ini ${data.savingRate.toFixed(0)}%.`);
    if (data.monthExpense > data.monthIncome) out.push("Pengeluaran bulan ini melebihi pemasukan — saatnya tinjau anggaran.");
    if (data.pie[0]) out.push(`Pengeluaran terbesar bulan ini: ${data.pie[0].name} (${formatIDR(data.pie[0].value)}).`);
    if (data.balance > 0 && out.length < 3) out.push(`Saldo keluarga positif: ${formatIDR(data.balance)}.`);
    return out.slice(0, 3);
  }, [data]);

  const CHART_COLORS = ["var(--color-primary)","var(--color-success)","var(--color-warning)","var(--color-destructive)","var(--color-chart-5)","oklch(0.65 0.1 200)"];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Dashboard"
        title={`${greeting}, ${profile?.full_name?.split(" ")[0] ?? "Keluarga"}.`}
        description="Ringkasan keuangan keluarga Anda hari ini."
        action={
          <div className="flex gap-2">
            <Button asChild variant="outline"><Link to="/app/pemasukan"><Plus className="mr-1 h-4 w-4" />Pemasukan</Link></Button>
            <Button asChild><Link to="/app/pengeluaran"><Plus className="mr-1 h-4 w-4" />Pengeluaran</Link></Button>
          </div>
        }
      />

      {/* KPIs */}
      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        <KPI icon={Wallet} label="Saldo Keluarga" value={formatIDR(data?.balance ?? 0)} tone="primary" loading={isLoading} />
        <KPI icon={ArrowDownCircle} label="Pemasukan Bulan Ini" value={formatIDR(data?.monthIncome ?? 0)} tone="success" loading={isLoading} />
        <KPI icon={ArrowUpCircle} label="Pengeluaran Bulan Ini" value={formatIDR(data?.monthExpense ?? 0)} tone="destructive" loading={isLoading} />
        <KPI icon={TrendingUp} label="Rasio Dompet Keluarga" value={`${(data?.savingRate ?? 0).toFixed(0)}%`} tone="default" loading={isLoading} />
      </div>

      {/* Charts row */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Cashflow</p>
              <h3 className="font-display text-base font-semibold">Pemasukan vs Pengeluaran (6 bulan)</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.months ?? []}>
                <defs>
                  <linearGradient id="inc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-success)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-success)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="exp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-destructive)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--color-destructive)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={70} />
                <Tooltip formatter={(v: any) => formatIDR(v as number)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Area type="monotone" dataKey="income" stroke="var(--color-success)" fill="url(#inc)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="var(--color-destructive)" fill="url(#exp)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Distribusi</p>
          <h3 className="font-display text-base font-semibold">Kategori Pengeluaran</h3>
          <div className="mt-2 h-64">
            {data?.pie.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.pie} dataKey="value" nameKey="name" outerRadius={70} innerRadius={45}>
                    {data.pie.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v: any) => formatIDR(v as number)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyHint text="Belum ada pengeluaran bulan ini." />
            )}
          </div>
        </div>
      </div>

      {/* Bar + goals */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Perbandingan</p>
          <h3 className="font-display text-base font-semibold">Per Bulan</h3>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.months ?? []}>
                <XAxis dataKey="label" fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} />
                <YAxis fontSize={11} stroke="var(--color-muted-foreground)" tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} width={70} />
                <Tooltip formatter={(v: any) => formatIDR(v as number)} contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="income" name="Pemasukan" fill="var(--color-success)" radius={[2,2,0,0]} />
                <Bar dataKey="expense" name="Pengeluaran" fill="var(--color-destructive)" radius={[2,2,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Progress</p>
              <h3 className="font-display text-base font-semibold">Tabungan Impian</h3>
            </div>
            <Target className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-4 space-y-4">
            {data?.goalProgress.length ? data.goalProgress.map(g => (
              <div key={g.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="truncate">{g.name}</span>
                  <span className="text-muted-foreground">{g.pct.toFixed(0)}%</span>
                </div>
                <Progress value={g.pct} className="h-1.5" />
                <p className="mt-1 text-xs text-muted-foreground">{formatIDR(g.saved)} dari {formatIDR(g.target)}</p>
              </div>
            )) : <EmptyHint text="Belum ada target tabungan." />}
            <Link to="/app/tabungan" className="block text-sm text-primary hover:underline">Kelola tabungan →</Link>
          </div>
        </div>
      </div>

      {/* Insights + Recent */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-warning" />
            <h3 className="font-display text-base font-semibold">Insight Otomatis</h3>
          </div>
          <ul className="mt-3 space-y-3 text-sm">
            {insights.length ? insights.map((s, i) => (
              <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />{s}</li>
            )) : <li className="text-muted-foreground">Belum ada cukup data untuk insight.</li>}
          </ul>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold">Aktivitas Terbaru</h3>
            <Link to="/app/riwayat" className="text-sm text-primary hover:underline">Lihat semua →</Link>
          </div>
          <ul className="divide-y divide-border">
            {data?.recent.length ? data.recent.map((t: any) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {t.type === "income" ? <ArrowDownCircle className="h-4 w-4" /> : <ArrowUpCircle className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{t.description || t.categories?.name || "Transaksi"}</p>
                    <p className="truncate text-xs text-muted-foreground">{t.categories?.name ?? "—"} · {formatDate(t.occurred_at)} · {t.profiles?.full_name ?? ""}</p>
                  </div>
                </div>
                <span className={`shrink-0 font-display text-sm font-semibold ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}{formatIDR(t.amount)}
                </span>
              </li>
            )) : <li className="py-8 text-center text-sm text-muted-foreground">Belum ada transaksi. Mulai catat sekarang.</li>}
          </ul>
        </div>
      </div>
    </AppShell>
  );
}

function KPI({ icon: Icon, label, value, tone, loading }: { icon: any; label: string; value: string; tone: "primary"|"success"|"destructive"|"default"; loading?: boolean }) {
  const toneClass = {
    primary: "text-primary",
    success: "text-success",
    destructive: "text-destructive",
    default: "text-foreground",
  }[tone];
  return (
    <div className="bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className={`h-4 w-4 ${toneClass}`} />
      </div>
      <p className={`mt-3 font-display text-xl font-semibold sm:text-2xl ${toneClass}`}>{loading ? "—" : value}</p>
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="mx-auto h-5 w-5 text-muted-foreground" />
        <p className="mt-2 text-xs text-muted-foreground">{text}</p>
      </div>
    </div>
  );
}
