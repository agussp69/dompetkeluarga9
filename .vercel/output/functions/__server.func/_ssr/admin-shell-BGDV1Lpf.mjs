import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { _ as useNavigate, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { C as ListChecks, I as ChartColumn, S as LogOut, T as LayoutDashboard, b as Menu, d as Tag, f as Shield, g as Receipt, h as ScrollText, i as Users, p as Settings, r as WalletMinimal, t as X, z as ArrowLeft } from "../_libs/lucide-react.mjs";
import { i as AvatarImage, n as Avatar, o as useProfile, r as AvatarFallback } from "./shell-DlVLLniV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-shell-BGDV1Lpf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ADMIN_NAV = [
	{
		to: "/admin",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/admin/users",
		label: "Manajemen User",
		icon: Users
	},
	{
		to: "/admin/keluarga",
		label: "Manajemen Keluarga",
		icon: WalletMinimal
	},
	{
		to: "/admin/transaksi",
		label: "Transaksi",
		icon: Receipt
	},
	{
		to: "/admin/budget-template",
		label: "Budget Template",
		icon: ListChecks
	},
	{
		to: "/admin/kategori",
		label: "Kategori",
		icon: Tag
	},
	{
		to: "/admin/audit",
		label: "Audit Log",
		icon: ScrollText
	},
	{
		to: "/admin/laporan",
		label: "Laporan Sistem",
		icon: ChartColumn
	},
	{
		to: "/admin/pengaturan",
		label: "Pengaturan",
		icon: Settings
	}
];
function AdminShell({ children }) {
	const { data: profile } = useProfile();
	const location = useLocation();
	const navigate = useNavigate();
	const qc = useQueryClient();
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const handleSignOut = async () => {
		await qc.cancelQueries();
		qc.clear();
		await supabase.auth.signOut();
		navigate({
			to: "/auth",
			replace: true
		});
	};
	const initials = (profile?.full_name || profile?.email || "A").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-base font-semibold",
					children: "Admin"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setMobileOpen((v) => !v),
				className: "rounded-md border border-border p-2",
				children: mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: cn("fixed inset-y-0 left-0 z-40 w-64 transform border-r border-sidebar-border bg-sidebar transition-transform lg:static lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-full flex-col",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden h-16 items-center gap-2 border-b border-sidebar-border px-5 lg:flex",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 place-items-center rounded-md bg-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary-foreground" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-sm font-semibold leading-none",
									children: "Panel Admin"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Dompet Keluarga"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex-1 overflow-y-auto px-3 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-0.5",
									children: [ADMIN_NAV.map((item) => {
										const isActive = item.to === "/admin" ? location.pathname === "/admin" : location.pathname.startsWith(item.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											onClick: () => setMobileOpen(false),
											className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition", isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item.label
											})]
										}) }, item.to);
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "mt-4 border-t border-sidebar-border pt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/app",
											className: "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Kembali ke App" })]
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border-t border-sidebar-border p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 rounded-md p-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
											className: "h-9 w-9",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
												className: "bg-primary text-primary-foreground text-xs",
												children: initials
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0 flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-sm font-medium",
												children: profile?.full_name ?? "Admin"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "truncate text-xs text-muted-foreground",
												children: profile?.email
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											onClick: handleSignOut,
											title: "Keluar",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4" })
										})
									]
								})
							})
						]
					})
				}),
				mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: () => setMobileOpen(false),
					className: "fixed inset-0 z-30 bg-foreground/20 lg:hidden"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "min-w-0 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10",
						children
					})
				})
			]
		})]
	});
}
//#endregion
export { AdminShell as t };
