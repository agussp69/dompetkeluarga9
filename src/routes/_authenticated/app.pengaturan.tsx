import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useProfile } from "@/hooks/use-profile";

export const Route = createFileRoute("/_authenticated/app/pengaturan")({
  head: () => ({ meta: [{ title: "Pengaturan · Dompet Keluarga" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const qc = useQueryClient();
  const [tz, setTz] = useState(profile?.timezone ?? "Asia/Jakarta");
  const [lang, setLang] = useState(profile?.language ?? "id");
  const [email, setEmail] = useState(!!profile?.notif_prefs?.email);
  const [inapp, setInapp] = useState(profile?.notif_prefs?.in_app !== false);

  useEffect(() => {
    if (profile) {
      setTz(profile.timezone);
      setLang(profile.language);
      setEmail(!!profile.notif_prefs?.email);
      setInapp(profile.notif_prefs?.in_app !== false);
    }
  }, [profile]);

  const save = useMutation({
    mutationFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const { error } = await supabase.from("profiles").update({
        timezone: tz, language: lang,
        notif_prefs: { email, in_app: inapp },
      }).eq("id", u.user!.id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["profile"] }); toast.success("Pengaturan disimpan"); },
    onError: (e: any) => toast.error(e.message),
  });

  return (
    <AppShell>
      <PageHeader eyebrow="Preferensi" title="Pengaturan" description="Sesuaikan aplikasi dengan kebutuhan Anda." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold">Bahasa & Zona Waktu</h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <Label>Bahasa</Label>
              <Select value={lang} onValueChange={setLang}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="id">Bahasa Indonesia</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Zona Waktu</Label>
              <Select value={tz} onValueChange={setTz}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Asia/Jakarta">WIB (Asia/Jakarta)</SelectItem>
                  <SelectItem value="Asia/Makassar">WITA (Asia/Makassar)</SelectItem>
                  <SelectItem value="Asia/Jayapura">WIT (Asia/Jayapura)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-display text-base font-semibold">Notifikasi</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Notifikasi dalam aplikasi</p><p className="text-xs text-muted-foreground">Tampilkan pemberitahuan di halaman notifikasi.</p></div>
              <Switch checked={inapp} onCheckedChange={setInapp} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="font-medium">Email</p><p className="text-xs text-muted-foreground">Kirim ringkasan via email.</p></div>
              <Switch checked={email} onCheckedChange={setEmail} />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>Simpan Pengaturan</Button>
      </div>
    </AppShell>
  );
}
