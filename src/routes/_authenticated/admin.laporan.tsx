import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { formatIDR, formatCompact } from "@/lib/format";
import { adminGuard } from "@/lib/admin-guard";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/laporan")({
  head: () => ({ meta: [{ title: "Laporan Sistem · Admin" }] }),
  beforeLoad: adminGuard,
  component: AdminReportPage,
});

function AdminReportPage() {
  const [range, setRange] = useState("12"); // bulan ke belakang

  const { data, isLoading } = useQuery({
    queryKey: ["admin-report", range],
    queryFn: async () => {
      // Gunakan RPC aggregate server-side — tidak load semua baris
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - Number(range));
      const fromISO = fromDate.toISOString().slice(0, 10);

      const { data: series, error } = await supabase.rpc("get_admin_monthly_report", {
        p_from: fromISO,
      });

      if (error) throw error;

      const rows = (series ?? []) as { month_key: string; total_income: number; total_expense: number }[];
      const totalIn = rows.reduce((s, r) => s + Number(r.total_income), 0);
      const totalEx = rows.reduce((s, r) => s + Number(r.total_expense), 0);

      return {
        series: rows.map(r => ({
          label: r.month_key,
          income: Number(r.total_income),
          expense: Number(r.total_expense),
        })),
        totalIn,
        totalEx,
      };
    },
  });

  const exportCSV = () => {
    if (!data) return;
    const header = ["Bulan", "Total Pemasukan", "Total Pengeluaran"];
    const rows = data.series.map(r => [r.label, r.income, r.expense]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-sistem-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell>
      <PageHeader
        eyebrow="Sistem"
        title="Laporan Sistem"
        description="Ringkasan transaksi seluruh pengguna secara agregat."
        action={
          <div className="flex gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 bulan terakhir</SelectItem>
                <SelectItem value="6">6 bulan terakhir</SelectItem>
                <SelectItem value="12">12 bulan terakhir</SelectItem>
                <SelectItem value="24">24 bulan terakhir</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={exportCSV} disabled={!data}>
              <Download className="mr-1 h-4 w-4" />Export CSV
            </Button>
          </div>
        }
      />

      <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pemasukan Sistem</p>
          <p className="mt-2 font-display text-2xl font-semibold text-success">{isLoading ? "—" : formatIDR(data?.totalIn ?? 0)}</p>
        </div>
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Pengeluaran Sistem</p>
          <p className="mt-2 font-display text-2xl font-semibold text-destructive">{isLoading ? "—" : formatIDR(data?.totalEx ?? 0)}</p>
        </div>
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Saldo Bersih</p>
          <p className="mt-2 font-display text-2xl font-semibold">{isLoading ? "—" : formatIDR((data?.totalIn ?? 0) - (data?.totalEx ?? 0))}</p>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 font-display text-base font-semibold">Tren Bulanan (Agregat Sistem)</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.series ?? []}>
              <XAxis dataKey="label" fontSize={10} tickLine={false} axisLine={false} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(v)} stroke="var(--color-muted-foreground)" width={70} />
              <Tooltip
                formatter={(v: any) => formatIDR(v)}
                contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 6, fontSize: 12 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="income" name="Pemasukan" fill="var(--color-success)" radius={[2,2,0,0]} />
              <Bar dataKey="expense" name="Pengeluaran" fill="var(--color-destructive)" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminShell>
  );
}
