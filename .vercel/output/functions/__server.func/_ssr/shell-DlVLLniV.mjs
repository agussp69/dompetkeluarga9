import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { _ as useNavigate, g as Link, l as useLocation } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { E as History, I as ChartColumn, L as Bell, M as CircleArrowDown, S as LogOut, T as LayoutDashboard, a as User, b as Menu, f as Shield, i as Users, j as CircleArrowUp, n as Wallet, p as Settings, t as X, u as Target, v as PiggyBank } from "../_libs/lucide-react.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DlVLLniV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useProfile() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return null;
			const { data, error } = await supabase.from("profiles").select("*").eq("id", u.user.id).single();
			if (error) throw error;
			return data;
		}
	});
}
function useIsAdmin() {
	return useQuery({
		queryKey: ["is-admin"],
		queryFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			if (!u.user) return false;
			const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
			return !!data;
		}
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
var NAV = [
	{
		to: "/app",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/app/pemasukan",
		label: "Pemasukan",
		icon: CircleArrowDown
	},
	{
		to: "/app/pengeluaran",
		label: "Pengeluaran",
		icon: CircleArrowUp
	},
	{
		to: "/app/budget",
		label: "Budget Bulanan",
		icon: PiggyBank
	},
	{
		to: "/app/tabungan",
		label: "Tabungan Impian",
		icon: Target
	},
	{
		to: "/app/laporan",
		label: "Laporan",
		icon: ChartColumn
	},
	{
		to: "/app/riwayat",
		label: "Riwayat",
		icon: History
	},
	{
		to: "/app/notifikasi",
		label: "Notifikasi",
		icon: Bell
	},
	{
		to: "/app/keluarga",
		label: "Anggota Keluarga",
		icon: Users
	},
	{
		to: "/app/profil",
		label: "Profil",
		icon: User
	},
	{
		to: "/app/pengaturan",
		label: "Pengaturan",
		icon: Settings
	}
];
function AppShell({ children }) {
	const { data: profile } = useProfile();
	const { data: isAdmin } = useIsAdmin();
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
	const initials = (profile?.full_name || profile?.email || "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-base font-semibold",
					children: "Dompet Keluarga"
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
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary-foreground" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-display text-sm font-semibold leading-none",
									children: "Dompet Keluarga"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] uppercase tracking-widest text-muted-foreground",
									children: "Keuangan Bersama"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "flex-1 overflow-y-auto px-3 py-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-0.5",
									children: [NAV.map((item) => {
										const isActive = item.to === "/app" ? location.pathname === "/app" : location.pathname.startsWith(item.to);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: item.to,
											onClick: () => setMobileOpen(false),
											className: cn("group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition", isActive ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate",
												children: item.label
											})]
										}) }, item.to);
									}), isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
										className: "mt-4 border-t border-sidebar-border pt-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/admin",
											onClick: () => setMobileOpen(false),
											className: cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition", location.pathname.startsWith("/admin") ? "bg-primary text-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Panel Admin" })]
										})
									}) : null]
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
												children: profile?.full_name ?? "Pengguna"
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
function PageHeader({ eyebrow, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-8 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 border-b border-border pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				eyebrow ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 font-display text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground",
					children: eyebrow
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "truncate font-display text-2xl font-semibold tracking-tight sm:text-3xl",
					children: title
				}),
				description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: description
				}) : null
			]
		}), action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "shrink-0",
			children: action
		}) : null]
	});
}
//#endregion
export { PageHeader as a, AvatarImage as i, Avatar as n, useProfile as o, AvatarFallback as r, AppShell as t };
