import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as Download, m as Search } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as useProfile, t as AppShell } from "./shell-DlVLLniV.mjs";
import { i as formatIDR, n as formatDate } from "./format-DLhBC1y6.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.riwayat-CMrOoItp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HistoryPage() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const [search, setSearch] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [range, setRange] = (0, import_react.useState)("month");
	const { data: txns = [] } = useQuery({
		enabled: !!familyId,
		queryKey: [
			"history",
			familyId,
			type,
			range
		],
		queryFn: async () => {
			let from = /* @__PURE__ */ new Date();
			const today = /* @__PURE__ */ new Date();
			if (range === "today") from = today;
			else if (range === "week") from = /* @__PURE__ */ new Date(today.getTime() - 7 * 864e5);
			else if (range === "month") from = new Date(today.getFullYear(), today.getMonth(), 1);
			else if (range === "year") from = new Date(today.getFullYear(), 0, 1);
			else from = new Date(2e3, 0, 1);
			let q = supabase.from("transactions").select("*, categories:category_id(name)").eq("family_id", familyId).gte("occurred_at", from.toISOString().slice(0, 10)).order("occurred_at", { ascending: false }).limit(500);
			if (type !== "all") q = q.eq("type", type);
			const { data } = await q;
			return data ?? [];
		}
	});
	const filtered = (0, import_react.useMemo)(() => txns.filter((t) => !search || (t.description ?? "").toLowerCase().includes(search.toLowerCase())), [txns, search]);
	const exportCSV = () => {
		const csv = [[
			"Tanggal",
			"Jenis",
			"Kategori",
			"Anggota",
			"Deskripsi",
			"Nominal"
		], ...filtered.map((t) => [
			t.occurred_at,
			t.type === "income" ? "Pemasukan" : "Pengeluaran",
			t.categories?.name ?? "",
			t.profiles?.full_name ?? "",
			t.description ?? "",
			t.amount
		])].map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `riwayat-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Riwayat",
			title: "Riwayat Transaksi",
			description: "Lihat dan filter semua transaksi keluarga.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: exportCSV,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Export CSV"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 sm:grid-cols-[1fr_180px_180px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "pl-9",
						placeholder: "Cari...",
						value: search,
						onChange: (e) => setSearch(e.target.value)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: type,
					onValueChange: setType,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Semua jenis"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "income",
							children: "Pemasukan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "expense",
							children: "Pengeluaran"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: range,
					onValueChange: setRange,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "today",
							children: "Hari ini"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "week",
							children: "Minggu ini"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "month",
							children: "Bulan ini"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "year",
							children: "Tahun ini"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "Semua waktu"
						})
					] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-lg border border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Tanggal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Jenis"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 font-medium",
							children: "Deskripsi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium md:table-cell",
							children: "Kategori"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "hidden px-4 py-3 font-medium lg:table-cell",
							children: "Anggota"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-3 text-right font-medium",
							children: "Nominal"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border bg-card",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "p-12 text-center text-muted-foreground",
						children: "Tidak ada transaksi."
					}) }) : filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "whitespace-nowrap px-4 py-3 text-muted-foreground",
							children: formatDate(t.occurred_at)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: t.type === "income" ? "default" : "secondary",
								className: t.type === "income" ? "bg-success text-success-foreground" : "bg-destructive/10 text-destructive",
								children: t.type === "income" ? "Pemasukan" : "Pengeluaran"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: t.description || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "hidden px-4 py-3 md:table-cell text-muted-foreground",
							children: t.categories?.name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "hidden px-4 py-3 lg:table-cell text-muted-foreground",
							children: t.profiles?.full_name ?? "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: `whitespace-nowrap px-4 py-3 text-right font-medium ${t.type === "income" ? "text-success" : "text-destructive"}`,
							children: [t.type === "income" ? "+" : "-", formatIDR(t.amount)]
						})
					] }, t.id))
				})]
			})
		})
	] });
}
//#endregion
export { HistoryPage as component };
