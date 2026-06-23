import { t as supabase } from "./client-BEuMdBdI.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader } from "./shell-DlVLLniV.mjs";
import { t as AdminShell } from "./admin-shell-BGDV1Lpf.mjs";
import { i as formatIDR } from "./format-DLhBC1y6.mjs";
import { a as YAxis, f as ResponsiveContainer, l as Bar, o as XAxis, p as Tooltip, r as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.laporan-CrrcTrZc.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { data } = useQuery({
		queryKey: ["admin-report"],
		queryFn: async () => {
			const { data: txns } = await supabase.from("transactions").select("type, amount, occurred_at");
			const list = txns ?? [];
			const totals = {};
			list.forEach((t) => {
				const k = t.occurred_at.slice(0, 7);
				totals[k] = totals[k] ?? {
					label: k,
					income: 0,
					expense: 0
				};
				if (t.type === "income") totals[k].income += Number(t.amount);
				else totals[k].expense += Number(t.amount);
			});
			return {
				series: Object.values(totals).sort((a, b) => a.label.localeCompare(b.label)),
				totalIn: list.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0),
				totalEx: list.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0)
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Sistem",
			title: "Laporan Sistem"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Total Pemasukan Sistem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-semibold text-success",
					children: formatIDR(data?.totalIn ?? 0)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground",
					children: "Total Pengeluaran Sistem"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-2xl font-semibold text-destructive",
					children: formatIDR(data?.totalEx ?? 0)
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-lg border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-4 font-display text-base font-semibold",
				children: "Tren Bulanan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-72",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data?.series ?? [],
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								fontSize: 10,
								tickLine: false,
								axisLine: false,
								stroke: "var(--color-muted-foreground)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								fontSize: 10,
								tickLine: false,
								axisLine: false,
								stroke: "var(--color-muted-foreground)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 6,
								fontSize: 12
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "income",
								fill: "var(--color-success)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "expense",
								fill: "var(--color-destructive)"
							})
						]
					})
				})
			})]
		})
	] });
};
//#endregion
export { SplitComponent as component };
