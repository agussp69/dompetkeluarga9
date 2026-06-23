import { createFileRoute, redirect } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { adminGuard } from "@/lib/admin-guard";

export const Route = createFileRoute("/_authenticated/admin/users")({
  head: () => ({ meta: [{ title: "Manajemen User · Admin" }] }),
  beforeLoad: adminGuard,
  component: UsersPage,
});

function UsersPage() {
  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <AdminShell>
      <PageHeader eyebrow="Sistem" title="Manajemen User" description="Daftar seluruh pengguna sistem." />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nama</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {users.map((u: any) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  {(u.user_roles ?? []).map((r: any) => <Badge key={r.role} variant="secondary" className="mr-1">{r.role}</Badge>)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={u.status === "active" ? "default" : "destructive"}>{u.status}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(u.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
