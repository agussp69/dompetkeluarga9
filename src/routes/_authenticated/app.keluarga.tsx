import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserPlus, Trash2, Copy, Mail, Crown, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/app/keluarga")({
  head: () => ({ meta: [{ title: "Anggota Keluarga · Dompet Keluarga" }] }),
  component: FamilyPage,
});

function FamilyPage() {
  const { data: profile } = useProfile();
  const familyId = profile?.active_family_id;
  const qc = useQueryClient();
  const [openInv, setOpenInv] = useState(false);

  const { data: family } = useQuery({
    enabled: !!familyId,
    queryKey: ["family", familyId],
    queryFn: async () => {
      const { data } = await supabase.from("families").select("*").eq("id", familyId!).single();
      return data;
    },
  });

  const { data: members = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["members", familyId],
    queryFn: async () => {
      const { data: fm } = await supabase
        .from("family_members")
        .select("id, role, joined_at, user_id")
        .eq("family_id", familyId!);
      const ids = (fm ?? []).map(m => m.user_id);
      let profilesMap: Record<string, any> = {};
      if (ids.length) {
        const { data: ps } = await supabase
          .from("profiles")
          .select("id, full_name, email, avatar_url")
          .in("id", ids);
        (ps ?? []).forEach((p: any) => (profilesMap[p.id] = p));
      }
      return (fm ?? []).map((m: any) => ({ ...m, profiles: profilesMap[m.user_id] }));
    },
  });

  const { data: invs = [] } = useQuery({
    enabled: !!familyId,
    queryKey: ["invs", familyId],
    queryFn: async () => {
      const { data } = await supabase.from("invitations").select("*").eq("family_id", familyId!).eq("status", "pending");
      return data ?? [];
    },
  });

  const isOwner = members.some((m: any) => m.user_id === profile?.id && m.role === "owner");

  const removeMember = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("family_members").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["members"] }); toast.success("Anggota dikeluarkan"); },
  });

  const revokeInv = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invitations").update({ status: "revoked" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invs"] }); toast.success("Undangan dicabut"); },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow={family?.name}
        title="Anggota Keluarga"
        description="Kelola siapa saja yang dapat mengakses dan mencatat keuangan keluarga."
        action={isOwner ? (
          <Dialog open={openInv} onOpenChange={setOpenInv}>
            <DialogTrigger asChild><Button><UserPlus className="mr-1 h-4 w-4" />Undang Anggota</Button></DialogTrigger>
            <InviteDialog familyId={familyId!} onDone={() => setOpenInv(false)} />
          </Dialog>
        ) : null}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Anggota Aktif</h2>
          <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {members.map((m: any) => (
              <li key={m.id} className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={m.profiles?.avatar_url ?? undefined} />
                  <AvatarFallback>{(m.profiles?.full_name ?? "U").slice(0,2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="font-medium">{m.profiles?.full_name ?? "Pengguna"}</p>
                  <p className="text-xs text-muted-foreground">{m.profiles?.email}</p>
                </div>
                <Badge variant={m.role === "owner" ? "default" : "secondary"}>
                  {m.role === "owner" ? <><Crown className="mr-1 h-3 w-3" />Owner</> : <><UserIcon className="mr-1 h-3 w-3" />Anggota</>}
                </Badge>
                <span className="hidden text-xs text-muted-foreground sm:inline">{formatDate(m.joined_at)}</span>
                {isOwner && m.role !== "owner" ? (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Keluarkan anggota?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <strong>{m.profiles?.full_name ?? "Anggota ini"}</strong> akan dikeluarkan dari keluarga dan tidak bisa mengakses data keuangan bersama. Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeMember.mutate(m.id)}>Ya, Keluarkan</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">Undangan Tertunda</h2>
          {invs.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Belum ada undangan tertunda.
            </div>
          ) : (
            <ul className="space-y-2">
              {invs.map((iv: any) => (
                <li key={iv.id} className="rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="flex-1 truncate text-sm">{iv.email}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/auth?inv=${iv.token}`);
                      toast.success("Tautan disalin");
                    }}><Copy className="mr-1 h-3 w-3" />Salin tautan</Button>
                    {isOwner ? <Button variant="ghost" size="icon" onClick={() => revokeInv.mutate(iv.id)}><Trash2 className="h-4 w-4" /></Button> : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function InviteDialog({ familyId, onDone }: { familyId: string; onDone: () => void }) {
  const qc = useQueryClient();
  const [email, setEmail] = useState("");

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("invitations").insert({
        family_id: familyId, email: email.trim().toLowerCase(), invited_by: u.user!.id, role: "anggota",
      });
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["invs"] }); toast.success("Undangan dibuat. Salin tautan untuk dikirimkan."); onDone(); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <DialogContent>
      <DialogHeader><DialogTitle>Undang anggota keluarga</DialogTitle></DialogHeader>
      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-4">
        <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="anggota@email.com" required /></div>
        <p className="text-xs text-muted-foreground">Tautan undangan akan dibuat. Salin dan kirim ke anggota Anda.</p>
        <DialogFooter><Button type="button" variant="ghost" onClick={onDone}>Batal</Button><Button type="submit" disabled={save.isPending}>Buat Undangan</Button></DialogFooter>
      </form>
    </DialogContent>
  );
}
