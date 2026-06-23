import { t as supabase } from "./client-BEuMdBdI.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { B as Activity, g as Receipt, i as Users, r as WalletMinimal } from "../_libs/lucide-react.mjs";
import { a as PageHeader } from "./shell-DlVLLniV.mjs";
import { t as AdminShell } from "./admin-shell-BGDV1Lpf.mjs";
import { i as formatIDR, r as formatDateTime } from "./format-DLhBC1y6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-DqAyOzZn.js
var import_jsx_runtime = require_jsx_runtime();
function AdminDashboard() {
	const { data } = useQuery({
		queryKey: ["admin-stats"],
		queryFn: async () => {
			const [users, fams, txns, audit] = await Promise.all([
				supabase.from("profiles").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("families").select("id", {
					count: "exact",
					head: true
				}),
				supabase.from("transactions").select("amount, type"),
				supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(8)
			]);
			const totalAmount = (txns.data ?? []).reduce((s, t) => s + Number(t.amount), 0);
			return {
				users: users.count ?? 0,
				fams: fams.count ?? 0,
				txnCount: (txns.data ?? []).length,
				totalAmount,
				audit: audit.data ?? []
			};
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Panel Admin",
			title: "Dashboard Sistem",
			description: "Pantau penggunaan aplikasi secara keseluruhan."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: Users,
					label: "Total User",
					value: String(data?.users ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: WalletMinimal,
					label: "Total Keluarga",
					value: String(data?.fams ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: Receipt,
					label: "Total Transaksi",
					value: String(data?.txnCount ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					icon: Activity,
					label: "Volume Tercatat",
					value: formatIDR(data?.totalAmount ?? 0)
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 rounded-lg border border-border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-semibold",
				children: "Aktivitas Sistem Terbaru"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-border text-sm",
				children: (data?.audit ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "py-6 text-center text-muted-foreground",
					children: "Belum ada aktivitas."
				}) : data.audit.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						a.action,
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: ["· ", a.entity]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: formatDateTime(a.created_at)
					})]
				}, a.id))
			})]
		})
	] });
}
function Stat({ icon: Icon, label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-widest text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary" })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 font-display text-2xl font-semibold",
			children: value
		})]
	});
}
//#endregion
export { AdminDashboard as component };
