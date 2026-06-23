
# Rencana Pembangunan Dompet Keluarga

Aplikasi besar — saya bangun semua sekaligus dalam satu iterasi terstruktur, dengan fondasi backend yang kuat sehingga setiap halaman tinggal merangkai data.

## 1. Fondasi

**Backend (Lovable Cloud)**
- Aktifkan Cloud (Supabase) untuk auth, Postgres + RLS, dan storage bukti transaksi.
- Auth: email/password + Google, verifikasi email, lupa/reset password, remember me, session management.
- Aturan admin: **user pertama yang register otomatis menjadi `admin`** (cek `count(*) = 0` di trigger `handle_new_user`).

**Design system — Swiss Style**
- Token semantik di `src/styles.css` (oklch): `--navy` (primary), putih, hijau positif, merah peringatan, abu netral.
- Font: Inter (body) + Space Grotesk (display) via `@fontsource`.
- Grid 12 kolom, whitespace generous, flat, ikon `lucide-react` tipis, motion halus (`framer-motion`).
- Komponen shadcn di-restyle: radius kecil, border tipis, tipografi presisi.
- Responsif desktop/tablet/mobile, kontras AA, fokus keyboard.
- Seluruh microcopy Bahasa Indonesia.

## 2. Skema Database

Tabel (semua di `public`, RLS + GRANT, scoped by `family_id`):

`profiles`, `user_roles` (enum `app_role`: `admin`,`owner`,`anggota`), `families`, `family_members` (role per keluarga), `invitations`, `categories` (global + per-family), `income_transactions`, `expense_transactions`, `budgets` (bulan/tahun), `budget_items`, `savings_goals`, `savings_contributions`, `notifications`, `audit_logs`, `budget_templates`.

Helper SECURITY DEFINER:
- `has_role(_user, _role)`
- `is_family_member(_user, _family)`
- `is_family_owner(_user, _family)`
- `current_family_id()` (preferensi aktif user)

Trigger: auto-create profile + assign role admin/owner saat signup; auto-create keluarga default; audit log untuk insert/update/delete transaksi.

Storage bucket privat `receipts/` dengan policy per family.

## 3. Routing (TanStack Start)

**Publik**
- `/` landing sederhana + CTA
- `/auth` (login/register tab), `/forgot-password`, `/reset-password`

**User** (di bawah `_authenticated/` — gate dikelola integrasi)
- `/app` dashboard
- `/app/pemasukan`, `/app/pemasukan/baru`, `/app/pemasukan/$id`
- `/app/pengeluaran`, `/app/pengeluaran/baru`, `/app/pengeluaran/$id`
- `/app/budget`, `/app/budget/$id`
- `/app/tabungan`, `/app/tabungan/$id`
- `/app/riwayat`, `/app/laporan`
- `/app/keluarga` (anggota + undangan)
- `/app/notifikasi`, `/app/profil`, `/app/pengaturan`

**Admin** (`_authenticated/admin/` + gate `has_role('admin')`)
- `/admin` dashboard
- `/admin/users`, `/admin/keluarga`, `/admin/transaksi`
- `/admin/budget-template`, `/admin/kategori`
- `/admin/audit-log`, `/admin/laporan`, `/admin/pengaturan`

Layout: sidebar collapsible (shadcn sidebar), topbar dengan switcher keluarga + notifikasi + avatar.

## 4. Fitur per modul

- **Dashboard user**: sapaan, saldo, pemasukan/pengeluaran bulan, saving rate, ringkasan budget, progress tabungan, grafik cashflow (Recharts area), pemasukan vs pengeluaran (bar), distribusi kategori (pie), aktivitas terbaru, insight otomatis, quick action `+ Transaksi`.
- **Pemasukan/Pengeluaran**: CRUD, kategori default seed, lampiran (upload ke storage), tag, catatan, filter (rentang tanggal, kategori, anggota), search, pagination, undo delete via toast, modal cepat dengan keyboard shortcut.
- **Budget bulanan**: pilih bulan, list pos + target vs realisasi (progress bar, warna sesuai threshold), warning saat >80% dan >100%, insight otomatis.
- **Tabungan impian**: goal dengan prioritas, deadline, kontribusi; progress circle + estimasi selesai berdasarkan rerata kontribusi.
- **Riwayat**: tabel gabungan income+expense, sort/filter/search/export CSV.
- **Laporan**: periode harian/mingguan/bulanan/tahunan, chart lengkap, statistik, export PDF (jsPDF), Excel (xlsx), CSV.
- **Notifikasi**: dihasilkan oleh trigger (budget hampir habis/terlampaui, target tercapai, undangan, aktivitas anggota, laporan bulanan siap, pengingat).
- **Keluarga**: owner undang via email (insert ke `invitations` + token), terima undangan, ubah role, keluarkan anggota.
- **Profil & Pengaturan**: edit profil, avatar (storage), ganti password, preferensi notifikasi, zona waktu, bahasa (id default).

**Admin panel**: statistik global, CRUD user (suspend/aktif/reset password via Auth Admin API di server fn), CRUD keluarga, lihat semua transaksi, CRUD kategori & budget template, audit log dengan filter, laporan sistem, pengaturan global.

## 5. Server functions

Semua mutasi sensitif via `createServerFn` + `requireSupabaseAuth`:
- transaksi (income/expense): create/update/delete
- budget & tabungan: CRUD + kontribusi
- undangan: kirim/terima/cabut
- notifikasi: mark read
- admin: list users, suspend, reset password, ubah role (cek `has_role('admin')` di handler)
- laporan: agregasi server-side
- export PDF/Excel: dibuat di client setelah fetch (hindari Node-only deps di Worker)

Read default: TanStack Query (`ensureQueryData` di loader + `useSuspenseQuery` di komponen).

## 6. UX & non-functional

- 2–3 klik untuk tambah transaksi (FAB + modal cepat).
- Empty state, skeleton loading, toast (sonner), modal konfirmasi hapus, undo.
- Validasi real-time pakai zod + react-hook-form.
- RBAC ketat via RLS + `has_role`.
- Audit trail via trigger.
- Input sanitization, rate limit pada server fn sensitif, no PII di log.
- Format mata uang IDR, tanggal `id-ID`.

## 7. Urutan eksekusi (1 turn besar)

1. Enable Cloud + secrets, install deps (`@fontsource/inter`, `@fontsource/space-grotesk`, `recharts`, `framer-motion`, `date-fns`, `xlsx`, `jspdf`, `jspdf-autotable`).
2. Migrations: enum, tabel, RLS, GRANT, helper functions, trigger handle_new_user (admin-jika-pertama + buat keluarga default + owner), trigger audit & notifikasi, seed kategori & budget template.
3. Konfigurasi sosial auth Google.
4. Design system (`src/styles.css`, `__root.tsx` head, layout shell).
5. Auth pages + protected layout + admin gate.
6. Sidebar + topbar + family switcher.
7. Modul user: dashboard → transaksi → budget → tabungan → laporan/riwayat → notifikasi → keluarga → profil/pengaturan.
8. Admin panel.
9. Landing `/` ringkas + CTA.
10. Polish, empty states, mobile pass.

## Catatan teknis singkat

- Admin pertama: trigger memeriksa `(select count(*) from auth.users) = 1` sebelum insert role `admin`; selanjutnya role default `owner` untuk keluarga sendiri.
- Tidak menggunakan Edge Functions; semua logika di `createServerFn`.
- Storage bucket `receipts` privat; akses via signed URL.
- Google OAuth lewat `lovable.auth.signInWithOAuth("google", ...)`.

Setujui untuk saya mulai bangun?
