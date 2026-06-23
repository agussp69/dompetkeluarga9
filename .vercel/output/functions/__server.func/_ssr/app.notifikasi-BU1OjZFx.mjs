import { t as supabase } from "./client-BEuMdBdI.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { F as Check, L as Bell, l as Trash2 } from "../_libs/lucide-react.mjs";
import { a as PageHeader, t as AppShell } from "./shell-DlVLLniV.mjs";
import { r as formatDateTime } from "./format-DLhBC1y6.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.notifikasi-BU1OjZFx.js
var import_jsx_runtime = require_jsx_runtime();
function NotifPage() {
	const qc = useQueryClient();
	const { data: items = [] } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			const { data } = await supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(100);
			return data ?? [];
		}
	});
	const markRead = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("notifications").update({ read_at: (/* @__PURE__ */ new Date()).toISOString() }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] })
	});
	const del = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("notifications").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["notifications"] });
			toast.success("Notifikasi dihapus");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Pemberitahuan",
		title: "Notifikasi",
		description: "Aktivitas terbaru dan pengingat untuk keluarga Anda."
	}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-dashed border-border p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-medium",
				children: "Belum ada notifikasi"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Pemberitahuan akan muncul di sini."
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
		children: items.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: `flex items-start gap-4 p-4 ${n.read_at ? "opacity-60" : ""}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 w-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: n.title
						}),
						n.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-sm text-muted-foreground",
							children: n.body
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: formatDateTime(n.created_at)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [!n.read_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => markRead.mutate(n.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => del.mutate(n.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					})]
				})
			]
		}, n.id))
	})] });
}
//#endregion
export { NotifPage as component };
