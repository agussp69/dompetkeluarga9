import { createFileRoute } from "@tanstack/react-router";
import { AdminShell } from "@/components/app/admin-shell";
import { PageHeader } from "@/components/app/shell";
import { adminGuard } from "@/lib/admin-guard";

export const Route = createFileRoute("/_authenticated/admin/pengaturan")({
  head: () => ({ meta: [{ title: "Pengaturan Sistem · Admin" }] }),
  beforeLoad: adminGuard,
  component: () => (
    <AdminShell>
      <PageHeader eyebrow="Sistem" title="Pengaturan Sistem" description="Konfigurasi global aplikasi." />
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Konfigurasi aplikasi dapat ditambahkan di sini sesuai kebutuhan organisasi (logo, branding, kebijakan default).
      </div>
    </AdminShell>
  ),
});
