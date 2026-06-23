import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Wallet, PiggyBank, Target, BarChart3, Users, Shield,
} from "lucide-react";
import { formatIDR } from "@/lib/format";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dompet Keluarga — Kelola Keuangan Keluarga Bersama" },
      { name: "description", content: "Catat pemasukan, atur anggaran bulanan, dan capai tabungan impian bersama keluarga dalam satu aplikasi." },
      { property: "og:title", content: "Dompet Keluarga" },
      { property: "og:description", content: "Aplikasi keuangan keluarga: transparan, mudah, real-time." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-semibold">Dompet Keluarga</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden rounded-md px-4 py-2 text-sm font-medium hover:bg-accent sm:inline-flex">Masuk</Link>
            <Link to="/auth" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
              Mulai Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28">
          <div className="lg:col-span-7">
            <p className="font-display text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
              Keuangan keluarga · sederhana
            </p>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Kelola keuangan
              <br />
              keluarga bersama,
              <br />
              <span className="text-primary">transparan dan real-time.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
              Catat pemasukan, atur anggaran bulanan, pantau pengeluaran, dan capai tabungan impian — semua dalam satu aplikasi
              yang dibagi seluruh anggota keluarga.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
                Mulai sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#fitur" className="inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent">
                Lihat fitur
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <MockDashboard />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-muted/40">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-6 py-12 sm:grid-cols-4">
          {[
            { k: "Pencatatan", v: "< 3 klik" },
            { k: "Anggota", v: "Tak terbatas" },
            { k: "Laporan", v: "Real-time" },
            { k: "Mata uang", v: "Rupiah" },
          ].map(s => (
            <div key={s.k}>
              <div className="font-display text-2xl font-semibold sm:text-3xl">{s.v}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{s.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Fitur Utama</p>
              <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">
                Semua yang dibutuhkan keluarga modern.
              </h2>
            </div>
            <div className="grid gap-px bg-border lg:col-span-8 lg:grid-cols-2">
              {[
                { i: Wallet, t: "Pemasukan & Pengeluaran", d: "Pencatatan cepat dengan kategori siap pakai dan lampiran bukti." },
                { i: PiggyBank, t: "Budget Bulanan", d: "Tetapkan pos anggaran dan dapatkan peringatan saat hampir habis." },
                { i: Target, t: "Tabungan Impian", d: "Pantau progres dana darurat, liburan, rumah, hingga umrah." },
                { i: BarChart3, t: "Laporan & Analisis", d: "Grafik cashflow, insight otomatis, dan ekspor PDF/Excel/CSV." },
                { i: Users, t: "Multi-Anggota Keluarga", d: "Owner mengelola, anggota mencatat. Saldo dan laporan dibagi bersama." },
                { i: Shield, t: "Aman & Privat", d: "Setiap keluarga terisolasi. Hak akses berbasis peran." },
              ].map((f, i) => (
                <div key={i} className="bg-background p-8">
                  <f.i className="h-5 w-5 text-primary" />
                  <h3 className="mt-4 font-display text-base font-semibold">{f.t}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Mulai catat hari ini. Gratis.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base opacity-80">
            Buat akun, undang anggota keluarga, dan rasakan bagaimana keuangan keluarga jadi jauh lebih jelas.
          </p>
          <Link to="/auth" className="mt-8 inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90">
            Buat akun keluarga <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <footer className="bg-background">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="font-display text-sm font-medium">Dompet Keluarga</span>
          </div>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Dompet Keluarga · Untuk keluarga Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}

function MockDashboard() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="border-b border-border p-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Saldo Keluarga</p>
        <p className="mt-2 font-display text-3xl font-semibold">{formatIDR(12_450_000)}</p>
      </div>
      <div className="grid grid-cols-2 gap-px bg-border">
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pemasukan</p>
          <p className="mt-2 font-display text-lg font-semibold text-success">+{formatIDR(8_500_000)}</p>
        </div>
        <div className="bg-card p-5">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pengeluaran</p>
          <p className="mt-2 font-display text-lg font-semibold text-destructive">-{formatIDR(3_220_000)}</p>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {[
          { l: "Belanja", v: 68, c: "bg-primary" },
          { l: "Cicilan", v: 92, c: "bg-warning" },
          { l: "Tabungan", v: 45, c: "bg-success" },
        ].map(r => (
          <div key={r.l}>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-muted-foreground">{r.l}</span>
              <span className="font-medium">{r.v}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div className={`${r.c} h-full rounded-full`} style={{ width: `${r.v}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
