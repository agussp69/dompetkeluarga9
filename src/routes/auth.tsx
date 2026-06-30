import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      throw redirect({ to: "/app" });
    }
  },
  head: () => ({
    meta: [
      { title: "Masuk · Dompet Keluarga" },
      { name: "description", content: "Masuk atau daftar untuk mulai mengelola keuangan keluarga." },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

function AuthPage() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate({ to: "/app", replace: true });
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate({ to: "/app", replace: true });
      }
    });

    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand side */}
      <div className="hidden border-r border-border bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-md">
            <img src="/logo.png" alt="Dompet Keluarga Logo" className="h-6 w-auto object-contain" />
          </div>
          <span className="font-display text-lg font-semibold">Dompet Keluarga</span>
        </Link>
        <div>
          <p className="font-display text-[10px] uppercase tracking-[0.25em] opacity-70">Keuangan Keluarga</p>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight">
            Satu aplikasi, satu keluarga, satu visi keuangan.
          </h2>
          <p className="mt-6 max-w-md text-sm opacity-80">
            Catat pemasukan dan pengeluaran bersama, tetapkan anggaran, dan raih tabungan impian — semua transparan untuk seluruh anggota.
          </p>
        </div>
        <p className="text-xs opacity-60">© {new Date().getFullYear()} Dompet Keluarga</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <img src="/logo.png" alt="Dompet Keluarga Logo" className="h-8 w-auto object-contain" />
            <span className="font-display text-lg font-semibold">Dompet Keluarga</span>
          </Link>
          <AuthCard />
        </div>
      </div>
    </div>
  );
}

function AuthCard() {
  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Masuk</TabsTrigger>
        <TabsTrigger value="register">Daftar</TabsTrigger>
      </TabsList>

      <TabsContent value="login" className="mt-6"><LoginForm /></TabsContent>
      <TabsContent value="register" className="mt-6"><RegisterForm /></TabsContent>
    </Tabs>
  );
}

function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin + "/app",
      },
    });
    if (error) {
      toast.error("Gagal masuk dengan Google: " + error.message);
      setLoading(false);
    }
  };
  return (
    <Button type="button" variant="outline" className="w-full" onClick={handle} disabled={loading}>
      <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC04" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
      Lanjut dengan Google
    </Button>
  );
}

function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Email atau password salah" : error.message);
      return;
    }
    toast.success("Selamat datang!");
    navigate({ to: "/app" });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Masuk ke akun Anda</h1>
      <p className="text-sm text-muted-foreground">Lanjutkan mengelola keuangan keluarga.</p>

      <GoogleButton />
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">atau</span></div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password" required />
      </div>
      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Checkbox checked={remember} onCheckedChange={v => setRemember(!!v)} />
          Ingat saya
        </label>
        <Link to="/forgot-password" className="text-sm text-primary hover:underline">Lupa password?</Link>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Masuk"}</Button>
    </form>
  );
}

function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = registerSchema.safeParse({ fullName, email, password });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin + "/app",
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (data.session) {
      toast.success("Akun berhasil dibuat!");
      navigate({ to: "/app" });
    } else {
      toast.success("Akun dibuat. Silakan cek email untuk verifikasi.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h1 className="font-display text-2xl font-semibold">Buat akun keluarga</h1>
      <p className="text-sm text-muted-foreground">Mulai gratis. Tidak perlu kartu kredit.</p>

      <GoogleButton />
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">atau</span></div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nama lengkap</Label>
        <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Budi Santoso" autoComplete="name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-r">Email</Label>
        <Input id="email-r" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" autoComplete="email" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-r">Password</Label>
        <Input id="password-r" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimal 8 karakter" autoComplete="new-password" required />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Daftar"}</Button>
      <p className="text-center text-xs text-muted-foreground">
        Dengan mendaftar Anda menyetujui ketentuan dan kebijakan privasi kami.
      </p>
    </form>
  );
}
