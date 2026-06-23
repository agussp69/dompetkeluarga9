import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Search, ArrowDownCircle, ArrowUpCircle, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatIDR, formatDate, todayISO } from "@/lib/format";

type Txn = {
  id: string; family_id: string; user_id: string; type: "income" | "expense";
  amount: number; category_id: string | null; occurred_at: string;
  description: string | null; note: string | null; tags: string[] | null;
  categories?: { name: string } | null;
  profiles?: { full_name: string | null } | null;
};

export function TransactionPage({ type }: { type: "income" | "expense" }) {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editing, setEditing] = useState<Txn | null>(null);
  const [open, setOpen] = useState(false);

  const isIncome = type === "income";
  const title = isIncome ? "Pemasukan" : "Pengeluaran";

  const { data: categories = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["categories", familyId, type],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("id, name, type, is_global")
        .or(`is_global.eq.true,family_id.eq.${familyId}`)
        .eq("type", type)
        .order("name");
      return data ?? [];
    },
  });

  const { data: txns = [], isLoading } = useQuery({
    enabled: !!familyId,
    queryKey: ["txns", familyId, type, search, categoryFilter],
    queryFn: async () => {
      let q = supabase
        .from("transactions")
        .select("*, categories:category_id(name)")
        .eq("family_id", familyId!)
        .eq("type", type)
        .order("occurred_at", { ascending: false })
        .limit(200);
      if (categoryFilter !== "all") q = q.eq("category_id", categoryFilter);
      const { data, error } = await q;
      if (error) throw error;
      const filtered = (data ?? []).filter((t: any) =>
        !search || (t.description ?? "").toLowerCase().includes(search.toLowerCase())
      );
      return filtered as unknown as Txn[];
    },
  });

  const total = txns.reduce((s, t) => s + Number(t.amount), 0);

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("transactions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Transaksi dihapus");
      qc.invalidateQueries({ queryKey: ["txns"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow={isIncome ? "Pemasukan Keluarga" : "Pengeluaran Keluarga"}
        title={title}
        description={isIncome ? "Catat semua sumber pemasukan keluarga." : "Catat semua pengeluaran keluarga."}
        action={
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditing(null)}><Plus className="mr-1 h-4 w-4" />Tambah {title}</Button>
            </DialogTrigger>
            <TxnDialog
              type={type}
              categories={categories}
              familyId={familyId!}
              editing={editing}
              onDone={() => setOpen(false)}
            />
          </Dialog>
        }
      />

      <div className="mb-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3">
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
          <p className={`mt-2 font-display text-2xl font-semibold ${isIncome ? "text-success" : "text-destructive"}`}>{formatIDR(total)}</p>
        </div>
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Jumlah Transaksi</p>
          <p className="mt-2 font-display text-2xl font-semibold">{txns.length}</p>
        </div>
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Rata-rata</p>
          <p className="mt-2 font-display text-2xl font-semibold">{formatIDR(txns.length ? total / txns.length : 0)}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cari deskripsi..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger><SelectValue placeholder="Semua kategori" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua kategori</SelectItem>
            {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Deskripsi</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Kategori</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Anggota</th>
              <th className="px-4 py-3 text-right font-medium">Nominal</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {isLoading ? (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Memuat...</td></tr>
            ) : txns.length === 0 ? (
              <tr><td colSpan={6} className="p-12 text-center">
                <div className="mx-auto max-w-sm">
                  {isIncome ? <ArrowDownCircle className="mx-auto h-8 w-8 text-muted-foreground" /> : <ArrowUpCircle className="mx-auto h-8 w-8 text-muted-foreground" />}
                  <p className="mt-3 font-medium">Belum ada {title.toLowerCase()}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mulai dengan menambah transaksi pertama.</p>
                </div>
              </td></tr>
            ) : txns.map(t => (
              <tr key={t.id}>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">{formatDate(t.occurred_at)}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{t.description || "—"}</div>
                  {t.note ? <div className="text-xs text-muted-foreground">{t.note}</div> : null}
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  {t.categories?.name ? <Badge variant="secondary">{t.categories.name}</Badge> : <span className="text-muted-foreground">—</span>}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground lg:table-cell">{t.profiles?.full_name ?? "—"}</td>
                <td className={`whitespace-nowrap px-4 py-3 text-right font-medium ${isIncome ? "text-success" : "text-destructive"}`}>
                  {isIncome ? "+" : "-"}{formatIDR(t.amount)}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus transaksi?</AlertDialogTitle>
                          <AlertDialogDescription>Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteMut.mutate(t.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}

function TxnDialog({
  type, categories, familyId, editing, onDone,
}: {
  type: "income" | "expense";
  categories: any[]; familyId: string;
  editing: Txn | null;
  onDone: () => void;
}) {
  const qc = useQueryClient();
  const [amount, setAmount] = useState<string>(editing?.amount?.toString() ?? "");
  const [occurredAt, setOccurredAt] = useState<string>(editing?.occurred_at ?? todayISO());
  const [categoryId, setCategoryId] = useState<string>(editing?.category_id ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [note, setNote] = useState(editing?.note ?? "");

  const save = useMutation({
    mutationFn: async () => {
      const num = Number(amount.replace(/[^\d.-]/g, ""));
      if (!num || num <= 0) throw new Error("Nominal harus lebih dari 0");
      const { data: u } = await supabase.auth.getUser();
      const payload: any = {
        family_id: familyId,
        user_id: u.user!.id,
        type,
        amount: num,
        occurred_at: occurredAt,
        category_id: categoryId || null,
        description: description || null,
        note: note || null,
      };
      if (editing) {
        const { error } = await supabase.from("transactions").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("transactions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Transaksi diperbarui" : "Transaksi disimpan");
      qc.invalidateQueries({ queryKey: ["txns"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
      onDone();
    },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editing ? "Edit" : "Tambah"} {type === "income" ? "Pemasukan" : "Pengeluaran"}</DialogTitle>
      </DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <div className="space-y-2">
          <Label>Nominal (Rp)</Label>
          <Input inputMode="numeric" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label>Tanggal</Label>
            <Input type="date" value={occurredAt} onChange={e => setOccurredAt(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Kategori</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger>
              <SelectContent>
                {categories.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Deskripsi</Label>
          <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="cth. Gaji bulan ini" />
        </div>
        <div className="space-y-2">
          <Label>Catatan</Label>
          <Textarea rows={2} value={note} onChange={e => setNote(e.target.value)} placeholder="Opsional" />
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onDone}><X className="mr-1 h-4 w-4" />Batal</Button>
          <Button type="submit" disabled={save.isPending}>{save.isPending ? "Menyimpan..." : "Simpan"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
