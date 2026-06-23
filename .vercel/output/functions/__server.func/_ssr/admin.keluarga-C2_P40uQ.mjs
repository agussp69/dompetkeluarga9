import { t as supabase } from "./client-BEuMdBdI.mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader } from "./shell-DlVLLniV.mjs";
import { t as AdminShell } from "./admin-shell-BGDV1Lpf.mjs";
import { n as formatDate } from "./format-DLhBC1y6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.keluarga-C2_P40uQ.js
var import_jsx_runtime = require_jsx_runtime();
var SplitComponent = () => {
	const { data: fams = [] } = useQuery({
		queryKey: ["admin-families"],
		queryFn: async () => {
			const { data } = await supabase.from("families").select("*, family_members(id), transactions(amount)").order("created_at", { ascending: false });
			return data ?? [];
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Sistem",
		title: "Manajemen Keluarga"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-lg border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Nama Keluarga"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Anggota"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Transaksi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-4 py-3 font-medium",
						children: "Dibuat"
					})
				] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-border bg-card",
				children: fams.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 font-medium",
						children: f.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: (f.family_members ?? []).length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: (f.transactions ?? []).length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-4 py-3 text-muted-foreground",
						children: formatDate(f.created_at)
					})
				] }, f.id))
			})]
		})
	})] });
};
//#endregion
export { SplitComponent as component };
