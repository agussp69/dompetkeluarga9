import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTime } from "@/lib/format";
import { adminGuard } from "@/lib/admin-guard";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/admin/audit")({
  head: () => ({ meta: [{ title: "Audit Log · Admin" }] }),
  beforeLoad: adminGuard,
  component: () => {
    const { data: logs = [] } = useQuery({
      queryKey: ["admin-audit"],
      queryFn: async () => (await supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(300)).data ?? [],
    });
    return (
      <AdminShell>
        <PageHeader eyebrow="Sistem" title="Audit Log" description="Jejak aktivitas seluruh sistem." />
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Waktu</th>
                <th className="px-4 py-3 font-medium">Aksi</th>
                <th className="px-4 py-3 font-medium">Entitas</th>
                <th className="px-4 py-3 font-medium">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {logs.map((l: any) => (
                <tr key={l.id}>
                  <td className="px-4 py-3 text-muted-foreground">{formatDateTime(l.created_at)}</td>
                  <td className="px-4 py-3"><Badge variant="secondary">{l.action}</Badge></td>
                  <td className="px-4 py-3">{l.entity ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.user_id?.slice(0, 8) ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </AdminShell>
    );
  },
});
