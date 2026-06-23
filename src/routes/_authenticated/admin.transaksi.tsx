import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { formatDate, formatIDR } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { adminGuard } from "@/lib/admin-guard";

export const Route = createFileRoute("/_authenticated/admin/transaksi")({
  head: () => ({ meta: [{ title: "Manajemen Transaksi · Admin" }] }),
  beforeLoad: adminGuard,
  component: () => {
    const { data: txns = [] } = useQuery({
      queryKey: ["admin-txns"],
      queryFn: async () => {
        const { data } = await supabase.from("transactions").select("*, families:family_id(name), categories:category_id(name)").order("created_at", { ascending: false }).limit(500);
        return data ?? [];
      },
    });
    return (
      <AdminShell>
        <PageHeader eyebrow="Sistem" title="Manajemen Transaksi" description="500 transaksi terbaru di seluruh sistem." />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Keluarga</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 text-right font-medium">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {txns.map((t: any) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(t.occurred_at)}</td>
                  <td className="px-4 py-3">{t.families?.name ?? "—"}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{t.type === "income" ? "Pemasukan" : "Pengeluaran"}</Badge></td>
                  <td className="px-4 py-3 text-muted-foreground">{t.categories?.name ?? "—"}</td>
                  <td className={`px-4 py-3 text-right font-medium ${t.type === "income" ? "text-success" : "text-destructive"}`}>{formatIDR(t.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    );
  },
});
