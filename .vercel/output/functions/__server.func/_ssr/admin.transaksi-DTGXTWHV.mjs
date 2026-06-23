import { t as supabase } from "./client-BEuMdBdI.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader } from "./shell-DlVLLniV.mjs";
import { t as AdminShell } from "./admin-shell-BGDV1Lpf.mjs";
import { i as formatIDR, n as formatDate } from "./format-DLhBC1y6.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.transaksi-DTGXTWHV.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { data: txns = [] } = useQuery({
		queryKey: ["admin-txns"],
		queryFn: async () => {
			const { data } = await supabase.from("transactions").select("*, families:family_id(name), categories:category_id(name)").order("created_at", { ascending: false }).limit(500);
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Sistem",
		title: "Manajemen Transaksi",
		description: "500 transaksi terbaru di seluruh sistem."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
						children: "Keluarga"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Jenis"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Kategori"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 text-right font-medium",
						children: "Nominal"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border bg-card",
				children: txns.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: formatDate(t.occurred_at)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: t.families?.name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "secondary",
							children: t.type === "income" ? "Pemasukan" : "Pengeluaran"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: t.categories?.name ?? "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: `px-4 py-3 text-right font-medium ${t.type === "income" ? "text-success" : "text-destructive"}`,
						children: formatIDR(t.amount)
					})
				] }, t.id))
			})]
		})
	})] });
};
//#endregion
export { SplitComponent as component };
