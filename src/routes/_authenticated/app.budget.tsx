import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumericInput } from "@/components/ui/numeric-input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, monthNameId, parseThousand } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/budget")({
  head: () => ({ meta: [{ title: "Budget Bulanan · Dompet Keluarga" }] }),
  component: BudgetPage,
});

function BudgetPage() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const qc = useQueryClient();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [openItem, setOpenItem] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const { data: budget } = useQuery({
    enabled: !!familyId,
    queryKey: ["budget", familyId, year, month],
    queryFn: async () => {
      const { data } = await supabase
        .from("budgets")
        .select("*, budget_items(*, categories:category_id(name))")
        .eq("family_id", familyId!)
        .eq("year", year)
        .eq("month", month)
        .maybeSingle();
      return data;
    },
  });

  const { data: realized = {} } = useQuery({
    enabled: !!familyId,
    queryKey: ["budget-realized", familyId, year, month],
    queryFn: async () => {
      const start = `${year}-${String(month).padStart(2,"0")}-01`;
      const end = new Date(year, month, 1).toISOString().slice(0, 10);
      const { data } = await supabase
        .from("transactions")
        .select("category_id, amount")
        .eq("family_id", familyId!)
        .eq("type", "expense")
        .gte("occurred_at", start)
        .lt("occurred_at", end);
      const map: Record<string, number> = {};
      (data ?? []).forEach((t: any) => {
        const k = t.category_id || "_none";
        map[k] = (map[k] ?? 0) + Number(t.amount);
      });
      return map as Record<string, number>;
    },
  });

  const { data: categories = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["categories", familyId, "expense"],
    queryFn: async () => {
      const { data } = await supabase.from("categories").select("id, name").or(`is_global.eq.true,family_id.eq.${familyId}`).eq("type", "expense").order("name");
      return data ?? [];
    },
  });

  const createBudget = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("budgets").insert({ family_id: familyId!, year, month, created_by: u.user!.id });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["budget"] }); toast.success("Budget dibuat"); },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("budget_items").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["budget"] }); toast.success("Pos dihapus"); },
  });

  const items = budget?.budget_items ?? [];
  const totalTarget = items.reduce((s: number, i: any) => s + Number(i.amount), 0);
  const totalRealized = items.reduce((s: number, i: any) => s + (realized[i.category_id ?? "_none"] ?? 0), 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Anggaran"
        title="Budget Bulanan"
        description="Tetapkan pos anggaran dan pantau realisasinya."
        action={budget ? (
          <Dialog open={openItem} onOpenChange={(v) => { setOpenItem(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild><Button onClick={() => setEditing(null)}><Plus className="mr-1 h-4 w-4" />Tambah Pos</Button></DialogTrigger>
            <ItemDialog budgetId={budget.id} categories={categories} editing={editing} onDone={() => setOpenItem(false)} />
          </Dialog>
        ) : null}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-[200px_200px_1fr]">
        <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {Array.from({length: 12}, (_, i) => i + 1).map(m => <SelectItem key={m} value={String(m)}>{monthNameId(m)}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!budget ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="font-medium">Belum ada budget untuk {monthNameId(month)} {year}</p>
          <p className="mt-1 text-sm text-muted-foreground">Buat budget bulanan untuk mulai melacak pengeluaran per pos.</p>
          <Button className="mt-4" onClick={() => createBudget.mutate()}>Buat Budget</Button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
            <Stat label="Total Target" value={formatIDR(totalTarget)} />
            <Stat label="Total Realisasi" value={formatIDR(totalRealized)} />
            <Stat label="Sisa Budget" value={formatIDR(Math.max(0, totalTarget - totalRealized))} tone={totalRealized > totalTarget ? "destructive" : "success"} />
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-12 text-center">
              <p className="font-medium">Belum ada pos anggaran</p>
              <p className="mt-1 text-sm text-muted-foreground">Tambah pos untuk mulai melacak.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((it: any) => {
                const real = realized[it.category_id ?? "_none"] ?? 0;
                const pct = it.amount > 0 ? (real / Number(it.amount)) * 100 : 0;
                const over = pct > 100;
                const warn = pct > 80 && pct <= 100;
                return (
                  <div key={it.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-medium">{it.label}</div>
                        <div className="text-xs text-muted-foreground">{it.categories?.name ?? "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-sm">{formatIDR(real)} / {formatIDR(it.amount)}</div>
                        <div className={`text-xs ${over ? "text-destructive" : warn ? "text-warning" : "text-muted-foreground"}`}>{pct.toFixed(0)}%</div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => { setEditing(it); setOpenItem(true); }}><Pencil className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem.mutate(it.id)}><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </div>
                    <Progress value={Math.min(100, pct)} className={`mt-3 h-1.5 ${over ? "[&>div]:bg-destructive" : warn ? "[&>div]:bg-warning" : ""}`} />
                    {over ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive"><AlertTriangle className="h-3 w-3" />Melebihi budget sebesar {formatIDR(real - Number(it.amount))}.</p>
                    ) : warn ? (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-warning"><AlertTriangle className="h-3 w-3" />Mendekati batas budget.</p>
                    ) : (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><CheckCircle2 className="h-3 w-3" />Masih aman.</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </AppShell>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "success"|"destructive" }) {
  return (
    <div className="bg-card p-5">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={`mt-2 font-display text-2xl font-semibold ${tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : ""}`}>{value}</p>
    </div>
  );
}

function ItemDialog({ budgetId, categories, editing, onDone }: { budgetId: string; categories: any[]; editing: any; onDone: () => void }) {
  const qc = useQueryClient();
  const [label, setLabel] = useState(editing?.label ?? "");
  const [amount, setAmount] = useState<string>(editing?.amount?.toString() ?? "");
  const [categoryId, setCategoryId] = useState<string>(editing?.category_id ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const num = parseThousand(amount);
      if (!num || num <= 0) throw new Error("Target harus > 0");
      const payload = { budget_id: budgetId, label, amount: num, category_id: categoryId || null };
      if (editing) {
        const { error } = await supabase.from("budget_items").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("budget_items").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["budget"] }); toast.success("Pos disimpan"); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>{editing ? "Edit Pos" : "Tambah Pos Anggaran"}</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <div className="space-y-2"><Label>Nama Pos</Label><Input value={label} onChange={e => setLabel(e.target.value)} placeholder="cth. Belanja Bulanan" required /></div>
        <div className="space-y-2"><Label>Target (Rp)</Label><NumericInput value={amount} onChange={setAmount} required /></div>
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select value={categoryId} onValueChange={setCategoryId}>
            <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
            <SelectContent>{categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onDone}>Batal</Button>
          <Button type="submit" disabled={save.isPending}>Simpan</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
