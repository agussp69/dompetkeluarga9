import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Target, Plane, Home, Car, GraduationCap, Heart, Shield } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, formatDate, todayISO } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/tabungan")({
  head: () => ({ meta: [{ title: "Tabungan Impian · Dompet Keluarga" }] }),
  component: SavingsPage,
});

const ICONS: Record<string, any> = { Plane, Home, Car, GraduationCap, Heart, Shield, Target };

function SavingsPage() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [contribFor, setContribFor] = useState<any>(null);

  const { data: goals = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["goals", familyId],
    queryFn: async () => {
      const { data } = await supabase
        .from("savings_goals")
        .select("*, savings_contributions(amount, contributed_at)")
        .eq("family_id", familyId!)
        .order("priority", { ascending: true });
      return data ?? [];
    },
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("savings_goals").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); toast.success("Target dihapus"); },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Goal"
        title="Tabungan Impian"
        description="Catat impian keluarga dan pantau progresnya bersama."
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button onClick={() => setEditing(null)}><Plus className="mr-1 h-4 w-4" />Tambah Target</Button></DialogTrigger>
            <GoalDialog familyId={familyId!} editing={editing} onDone={() => setOpen(false)} />
          </Dialog>
        }
      />

      {goals.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <Target className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 font-medium">Belum ada target tabungan</p>
          <p className="mt-1 text-sm text-muted-foreground">Buat target seperti dana darurat, liburan, atau rumah.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((g: any) => {
            const saved = (g.savings_contributions ?? []).reduce((s: number, c: any) => s + Number(c.amount), 0);
            const pct = g.target_amount ? Math.min(100, (saved / Number(g.target_amount)) * 100) : 0;
            return (
              <div key={g.id} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                        <Target className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="truncate font-display text-base font-semibold">{g.name}</h3>
                        <p className="text-xs text-muted-foreground">{g.deadline ? `Target ${formatDate(g.deadline)}` : "Tanpa deadline"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(g); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => delMut.mutate(g.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Terkumpul</span>
                    <span className="font-semibold">{pct.toFixed(0)}%</span>
                  </div>
                  <Progress value={pct} className="mt-2 h-2" />
                  <p className="mt-2 text-sm">
                    <span className="font-display font-semibold">{formatIDR(saved)}</span>
                    <span className="text-muted-foreground"> / {formatIDR(g.target_amount)}</span>
                  </p>
                  {g.note ? <p className="mt-2 text-xs text-muted-foreground">{g.note}</p> : null}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-4 w-full" onClick={() => setContribFor(g)}><Plus className="mr-1 h-4 w-4" />Tambah Kontribusi</Button>
                  </DialogTrigger>
                  {contribFor?.id === g.id ? <ContribDialog goal={g} onDone={() => setContribFor(null)} /> : null}
                </Dialog>
              </div>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}

function GoalDialog({ familyId, editing, onDone }: { familyId: string; editing: any; onDone: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = useState(editing?.name ?? "");
  const [target, setTarget] = useState<string>(editing?.target_amount?.toString() ?? "");
  const [deadline, setDeadline] = useState<string>(editing?.deadline ?? "");
  const [priority, setPriority] = useState<string>(editing?.priority?.toString() ?? "2");
  const [note, setNote] = useState(editing?.note ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const num = Number(target.replace(/[^\d.-]/g, ""));
      if (!num || num <= 0) throw new Error("Target harus > 0");
      const { data: u } = await supabase.auth.getUser();
      const payload: any = {
        family_id: familyId, name, target_amount: num,
        deadline: deadline || null, priority: Number(priority) || 2,
        note: note || null, created_by: u.user!.id,
      };
      if (editing) {
        const { error } = await supabase.from("savings_goals").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("savings_goals").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); toast.success("Target disimpan"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit Target" : "Tambah Target"}</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <div className="space-y-2"><Label>Nama Target</Label><Input value={name} onChange={e => setName(e.target.value)} placeholder="cth. Dana Liburan" required /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Nominal Target (Rp)</Label><Input inputMode="numeric" value={target} onChange={e => setTarget(e.target.value)} required /></div>
          <div className="space-y-2"><Label>Deadline</Label><Input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
        </div>
        <div className="space-y-2">
          <Label>Prioritas</Label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Tinggi</SelectItem>
              <SelectItem value="2">Sedang</SelectItem>
              <SelectItem value="3">Rendah</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2"><Label>Catatan</Label><Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></div>
        <DialogFooter><Button type="button" variant="ghost" onClick={onDone}>Batal</Button><Button type="submit" disabled={save.isPending}>Simpan</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}

function ContribDialog({ goal, onDone }: { goal: any; onDone: () => void }) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const num = Number(amount.replace(/[^\d.-]/g, ""));
      if (!num || num <= 0) throw new Error("Nominal harus > 0");
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("savings_contributions").insert({
        goal_id: goal.id, user_id: u.user!.id, amount: num, contributed_at: date, note: note || null,
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["goals"] }); toast.success("Kontribusi ditambahkan"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Tambah Kontribusi: {goal.name}</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <div className="space-y-2"><Label>Nominal (Rp)</Label><Input inputMode="numeric" value={amount} onChange={e => setAmount(e.target.value)} required /></div>
        <div className="space-y-2"><Label>Tanggal</Label><Input type="date" value={date} onChange={e => setDate(e.target.value)} required /></div>
        <div className="space-y-2"><Label>Catatan</Label><Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} /></div>
        <DialogFooter><Button type="button" variant="ghost" onClick={onDone}>Batal</Button><Button type="submit" disabled={save.isPending}>Simpan</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
