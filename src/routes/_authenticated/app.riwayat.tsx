import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/riwayat")({
  head: () => ({ meta: [{ title: "Riwayat · Dompet Keluarga" }] }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const [search, setSearch] = useState("");
  const [type, setType] = useState<string>("all");
  const [range, setRange] = useState<string>("month");

  const { data: txns = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["history", familyId, type, range],
    queryFn: async () => {
      let from = new Date();
      const today = new Date();
      if (range === "today") from = today;
      else if (range === "week") from = new Date(today.getTime() - 7 * 86400000);
      else if (range === "month") from = new Date(today.getFullYear(), today.getMonth(), 1);
      else if (range === "year") from = new Date(today.getFullYear(), 0, 1);
      else from = new Date(2000, 0, 1);

      let q = supabase
        .from("transactions")
        .select("*, categories:category_id(name), profiles:user_id(full_name)")
        .eq("family_id", familyId!)
        .gte("occurred_at", from.toISOString().slice(0, 10))
        .order("occurred_at", { ascending: false })
        .limit(500);
      if (type !== "all") q = q.eq("type", type as "income" | "expense");
      const { data } = await q;
      return data ?? [];
    },
  });

  const filtered = useMemo(
    () => txns.filter((t: any) => !search || (t.description ?? "").toLowerCase().includes(search.toLowerCase())),
    [txns, search]
  );

  const exportCSV = () => {
    const header = ["Tanggal", "Jenis", "Kategori", "Anggota", "Deskripsi", "Nominal"];
    const rows = filtered.map((t: any) => [
      t.occurred_at, t.type === "income" ? "Pemasukan" : "Pengeluaran",
      t.categories?.name ?? "", t.profiles?.full_name ?? "", t.description ?? "", t.amount,
    ]);
    const csv = [header, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `riwayat-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Riwayat"
        title="Riwayat Transaksi"
        description="Lihat dan filter semua transaksi keluarga."
        action={<Button variant="outline" onClick={exportCSV}><Download className="mr-1 h-4 w-4" />Export CSV</Button>}
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_180px_180px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua jenis</SelectItem>
            <SelectItem value="income">Pemasukan</SelectItem>
            <SelectItem value="expense">Pengeluaran</SelectItem>
          </SelectContent>
        </Select>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hari ini</SelectItem>
            <SelectItem value="week">Minggu ini</SelectItem>
            <SelectItem value="month">Bulan ini</SelectItem>
            <SelectItem value="year">Tahun ini</SelectItem>
            <SelectItem value="all">Semua waktu</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Jenis</th>
              <th className="px-4 py-3 font-medium">Deskripsi</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Kategori</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Anggota</th>
              <th className="px-4 py-3 text-right font-medium">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Tidak ada transaksi.</td></tr>
            ) : filtered.map((t: any) => (
              <tr key={t.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(t.occurred_at)}</td>
                <td className="px-4 py-3">
                  <Badge variant={t.type === "income" ? "default" : "secondary"} className={t.type === "income" ? "bg-success text-success-foreground" : "bg-destructive/10 text-destructive"}>
                    {t.type === "income" ? "Pemasukan" : "Pengeluaran"}
                  </Badge>
                </td>
                <td className="px-4 py-3">{t.description || "—"}</td>
                <td className="hidden px-4 py-3 md:table-cell text-muted-foreground">{t.categories?.name ?? "—"}</td>
                <td className="hidden px-4 py-3 lg:table-cell text-muted-foreground">{t.profiles?.full_name ?? "—"}</td>
                <td className={`whitespace-nowrap px-4 py-3 text-right font-medium ${t.type === "income" ? "text-success" : "text-destructive"}`}>
                  {t.type === "income" ? "+" : "-"}{formatIDR(t.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
