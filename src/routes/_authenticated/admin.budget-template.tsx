import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { adminGuard } from "@/lib/admin-guard";

export const Route = createFileRoute("/_authenticated/admin/budget-template")({
  head: () => ({ meta: [{ title: "Budget Template · Admin" }] }),
  beforeLoad: adminGuard,
  component: TplPage,
});

function TplPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  const { data: tpls = [] } = useQuery({
    queryKey: ["admin-templates"],
    queryFn: async () => (await supabase.from("budget_templates").select("*").order("created_at", { ascending: false })).data ?? [],
  });

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("budget_templates").insert({ name, description: desc, items: [] });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-templates"] }); toast.success("Template dibuat"); setOpen(false); setName(""); setDesc(""); },
    onError: (e: any) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("budget_templates").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-templates"] }); toast.success("Template dihapus"); },
  });

  return (
    <AdminShell>
      <PageHeader eyebrow="Sistem" title="Budget Template" description="Template anggaran yang dapat dipakai keluarga." action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-1 h-4 w-4" />Tambah</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Buat Template</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); add.mutate(); }} className="space-y-4">
              <div className="space-y-2"><Label>Nama</Label><Input value={name} onChange={e => setName(e.target.value)} required /></div>
              <div className="space-y-2"><Label>Deskripsi</Label><Textarea rows={3} value={desc} onChange={e => setDesc(e.target.value)} /></div>
              <DialogFooter><Button type="submit">Simpan</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      } />

      {tpls.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center text-sm text-muted-foreground">Belum ada template.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tpls.map((t: any) => (
            <div key={t.id} className="rounded-lg border border-border bg-card p-5">
              <div className="flex justify-between">
                <h3 className="font-display text-base font-semibold">{t.name}</h3>
                <Button variant="ghost" size="icon" onClick={() => del.mutate(t.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{t.description || "—"}</p>
            </div>
          ))}
        </div>
      )}
    </AdminShell>
  );
}
