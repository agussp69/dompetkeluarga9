import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";
import { adminGuard } from "@/lib/admin-guard";

export const Route = createFileRoute("/_authenticated/admin/keluarga")({
  head: () => ({ meta: [{ title: "Manajemen Keluarga · Admin" }] }),
  beforeLoad: adminGuard,
  component: () => {
    const { data: fams = [] } = useQuery({
      queryKey: ["admin-families"],
      queryFn: async () => {
        const { data } = await supabase
          .from("families")
          .select("*, family_members(id), transactions(amount)")
          .order("created_at", { ascending: false });
        return data ?? [];
      },
    });
    return (
      <AdminShell>
        <PageHeader eyebrow="Sistem" title="Manajemen Keluarga" />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama Keluarga</th>
                <th className="px-4 py-3 font-medium">Anggota</th>
                <th className="px-4 py-3 font-medium">Transaksi</th>
                <th className="px-4 py-3 font-medium">Dibuat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {fams.map((f: any) => (
                <tr key={f.id}>
                  <td className="px-4 py-3 font-medium">{f.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(f.family_members ?? []).length}</td>
                  <td className="px-4 py-3 text-muted-foreground">{(f.transactions ?? []).length}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(f.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    );
  },
});
