import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Lupa Password · Dompet Keluarga" }] }),
  component: ForgotPassword,
});

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/reset-password",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    toast.success("Tautan reset password telah dikirim.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">
        <h1 className="font-display text-2xl font-semibold">Lupa password</h1>
        <p className="mt-2 text-sm text-muted-foreground">Masukkan email Anda. Kami akan mengirim tautan untuk mengatur ulang password.</p>

        {sent ? (
          <div className="mt-6 rounded-md border border-border bg-muted/40 p-4 text-sm">
            Tautan reset telah dikirim ke <span className="font-medium">{email}</span>. Periksa kotak masuk Anda.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "Mengirim..." : "Kirim tautan reset"}</Button>
          </form>
        )}

        <Link to="/auth" className="mt-6 inline-block text-sm text-primary hover:underline">← Kembali ke masuk</Link>
      </div>
    </div>
  );
}
