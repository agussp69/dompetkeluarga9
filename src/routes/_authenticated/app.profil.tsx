import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";
import { compressProfileImage } from "@/lib/image";


export const Route = createFileRoute("/_authenticated/app/profil")({
  head: () => ({ meta: [{ title: "Profil · Dompet Keluarga" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [pwd, setPwd] = useState("");

  useEffect(() => { if (profile?.full_name) setName(profile.full_name); }, [profile?.full_name]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", u.user!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Profil diperbarui"); },
    onError: (e: any) => toast.error(e.message),
  });

  const uploadAvatar = useMutation({
    mutationFn: async (file: File) => {
      const { file: processedFile, originalSize, compressedSize, compressed } = await compressProfileImage(file);
      const { data: u } = await supabase.auth.getUser();
      const path = `${u.user!.id}/avatar-${Date.now()}.${processedFile.name.split(".").pop()}`;
      const { error: upErr } = await supabase.storage.from("avatars").upload(path, processedFile, { upsert: true });
      if (upErr) throw upErr;
      const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 30); // 30 hari
      await supabase.from("profiles").update({ avatar_url: signed?.signedUrl ?? null }).eq("id", u.user!.id);
      return { originalSize, compressedSize, compressed };
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["profile"] });
      if (data.compressed) {
        const formatSize = (bytes: number) => {
          if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
          return `${(bytes / 1024).toFixed(0)} KB`;
        };
        const beforeStr = formatSize(data.originalSize);
        const afterStr = formatSize(data.compressedSize);
        toast.success(`Foto profil diperbarui (Dikompresi: ${beforeStr} → ${afterStr})`);
      } else {
        toast.success("Foto profil diperbarui");
      }
    },
    onError: (e: any) => toast.error(e.message),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      if (pwd.length < 8) throw new Error("Password minimal 8 karakter");
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Password diubah"); setPwd(""); },
    onError: (e: any) => toast.error(e.message),
  });

  const initials = (name || profile?.email || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <AppShell>
      <PageHeader eyebrow="Akun" title="Profil" description="Kelola informasi akun dan keamanan Anda." />

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Informasi Pribadi</h2>
          <div className="mt-6 flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <input type="file" accept="image/*" id="avatar" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar.mutate(f); }} />
              <Button variant="outline" onClick={() => document.getElementById("avatar")?.click()} disabled={uploadAvatar.isPending}>
                {uploadAvatar.isPending ? "Mengunggah..." : "Ganti foto"}
              </Button>
              <p className="mt-2 text-xs text-muted-foreground">PNG atau JPG.</p>
            </div>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveProfile.mutate(); }} className="mt-6 space-y-4">
            <div className="space-y-2"><Label>Nama Lengkap</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="space-y-2"><Label>Email</Label><Input value={profile?.email ?? ""} disabled /></div>
            <Button type="submit" disabled={saveProfile.isPending}>Simpan Perubahan</Button>
          </form>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold">Keamanan</h2>
          <form onSubmit={(e) => { e.preventDefault(); changePassword.mutate(); }} className="mt-4 space-y-4">
            <div className="space-y-2"><Label>Password Baru</Label><Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} placeholder="Minimal 8 karakter" /></div>
            <Button type="submit" variant="outline" className="w-full" disabled={changePassword.isPending || pwd.length < 8}>Ubah Password</Button>
          </form>
        </section>
      </div>
    </AppShell>
  );
}
