import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { formatDateTime } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/notifikasi")({
  head: () => ({ meta: [{ title: "Notifikasi · Dompet Keluarga" }] }),
  component: NotifPage,
});

function NotifPage() {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
      return data ?? [];
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["notifications"] }); toast.success("Notifikasi dihapus"); },
  });

  return (
    <AppShell>
      <PageHeader eyebrow="Pemberitahuan" title="Notifikasi" description="Aktivitas terbaru dan pengingat untuk keluarga Anda." />

      {items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Bell className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">Belum ada notifikasi</p>
          <p className="mt-1 text-sm text-muted-foreground">Pemberitahuan akan muncul di sini.</p>
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {items.map((n: any) => (
            <li key={n.id} className={`flex items-start gap-4 p-4 ${n.read_at ? "opacity-60" : ""}`}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Bell className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{n.title}</p>
                {n.body ? <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p> : null}
                <p className="mt-1 text-xs text-muted-foreground">{formatDateTime(n.created_at)}</p>
              </div>
              <div className="flex gap-1">
                {!n.read_at ? <Button variant="ghost" size="icon" onClick={() => markRead.mutate(n.id)}><Check className="h-4 w-4" /></Button> : null}
                <Button variant="ghost" size="icon" onClick={() => del.mutate(n.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
