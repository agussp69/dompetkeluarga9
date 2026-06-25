export const formatIDR = (n: number | string | null | undefined) => {
  const num = typeof n === "string" ? Number(n) : (n ?? 0);
  if (!Number.isFinite(num)) return "Rp 0";
  return "Rp " + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(num);
};

export const formatCompact = (n: number | string | null | undefined) => {
  const num = typeof n === "string" ? Number(n) : (n ?? 0);
  return "Rp " + new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(num);
};

export const formatDate = (d: string | Date | null | undefined, opts?: Intl.DateTimeFormatOptions) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("id-ID", opts ?? { day: "numeric", month: "short", year: "numeric" }).format(date);
};

export const formatDateTime = (d: string | Date | null | undefined) => {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short" }).format(date);
};

export const monthNameId = (m: number) =>
  ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"][m - 1] ?? "";

export const todayISO = () => new Date().toISOString().slice(0, 10);

export const formatThousand = (val: string | number | null | undefined): string => {
  if (val === null || val === undefined) return "";
  const clean = String(val).replace(/\D/g, "");
  if (!clean) return "";
  return new Intl.NumberFormat("id-ID").format(Number(clean));
};

export const parseThousand = (val: string | number | null | undefined): number => {
  if (val === null || val === undefined) return 0;
  const clean = String(val).replace(/\D/g, "");
  return clean ? Number(clean) : 0;
};

