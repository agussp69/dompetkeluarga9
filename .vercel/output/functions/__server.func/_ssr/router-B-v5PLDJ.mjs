import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B-v5PLDJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BJMB3J3t.css";
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xs uppercase tracking-[0.2em] text-muted-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-3 font-display text-4xl font-semibold",
					children: "Halaman tidak ditemukan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Halaman yang Anda cari tidak tersedia atau telah dipindahkan."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90",
					children: "Kembali ke beranda"
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold",
					children: "Terjadi kesalahan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Halaman gagal dimuat. Silakan coba lagi atau kembali ke beranda."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
						children: "Coba lagi"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
						children: "Beranda"
					})]
				})
			]
		})
	});
}
var Route$25 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Dompet Keluarga — Kelola Keuangan Keluarga Bersama" },
			{
				name: "description",
				content: "Aplikasi pencatatan dan pengelolaan keuangan keluarga: pemasukan, pengeluaran, anggaran bulanan, dan tabungan impian."
			},
			{
				name: "author",
				content: "Dompet Keluarga"
			},
			{
				property: "og:title",
				content: "Dompet Keluarga — Kelola Keuangan Keluarga Bersama"
			},
			{
				property: "og:description",
				content: "Aplikasi pencatatan dan pengelolaan keuangan keluarga: pemasukan, pengeluaran, anggaran bulanan, dan tabungan impian."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			},
			{
				name: "twitter:title",
				content: "Dompet Keluarga — Kelola Keuangan Keluarga Bersama"
			},
			{
				name: "twitter:description",
				content: "Aplikasi pencatatan dan pengelolaan keuangan keluarga: pemasukan, pengeluaran, anggaran bulanan, dan tabungan impian."
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "id",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$25.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data: sub } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => sub.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var $$splitComponentImporter$24 = () => import("./reset-password-msNd2uAQ.mjs");
var Route$24 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Reset Password · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./forgot-password-BZ0huQEp.mjs");
var Route$23 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Lupa Password · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./auth-D1W9KfDd.mjs");
var Route$22 = createFileRoute("/auth")({
	head: () => ({ meta: [{ title: "Masuk · Dompet Keluarga" }, {
		name: "description",
		content: "Masuk atau daftar untuk mulai mengelola keuangan keluarga."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./route-Di7iQBCH.mjs");
var Route$21 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data, error } = await supabase.auth.getUser();
		if (error || !data.user) throw redirect({ to: "/auth" });
		return { user: data.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./routes-9P1KlPPb.mjs");
var Route$20 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dompet Keluarga — Kelola Keuangan Keluarga Bersama" },
		{
			name: "description",
			content: "Catat pemasukan, atur anggaran bulanan, dan capai tabungan impian bersama keluarga dalam satu aplikasi."
		},
		{
			property: "og:title",
			content: "Dompet Keluarga"
		},
		{
			property: "og:description",
			content: "Aplikasi keuangan keluarga: transparan, mudah, real-time."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./app.index-DusveLNg.mjs");
var Route$19 = createFileRoute("/_authenticated/app/")({
	head: () => ({ meta: [{ title: "Dashboard · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./admin.index-DqAyOzZn.mjs");
var Route$18 = createFileRoute("/_authenticated/admin/")({
	head: () => ({ meta: [{ title: "Admin Dashboard · Dompet Keluarga" }] }),
	beforeLoad: async () => {
		const { data: u } = await supabase.auth.getUser();
		if (!u.user) throw redirect({ to: "/auth" });
		const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
		if (!r) throw redirect({ to: "/app" });
	},
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./app.tabungan-A13cVfPj.mjs");
var Route$17 = createFileRoute("/_authenticated/app/tabungan")({
	head: () => ({ meta: [{ title: "Tabungan Impian · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./app.riwayat-CMrOoItp.mjs");
var Route$16 = createFileRoute("/_authenticated/app/riwayat")({
	head: () => ({ meta: [{ title: "Riwayat · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./app.profil-BinK2HDN.mjs");
var Route$15 = createFileRoute("/_authenticated/app/profil")({
	head: () => ({ meta: [{ title: "Profil · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./app.pengeluaran-CS2H52os.mjs");
var Route$14 = createFileRoute("/_authenticated/app/pengeluaran")({
	head: () => ({ meta: [{ title: "Pengeluaran · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./app.pengaturan-EfRmgNcS.mjs");
var Route$13 = createFileRoute("/_authenticated/app/pengaturan")({
	head: () => ({ meta: [{ title: "Pengaturan · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./app.pemasukan-CAeshlcB.mjs");
var Route$12 = createFileRoute("/_authenticated/app/pemasukan")({
	head: () => ({ meta: [{ title: "Pemasukan · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./app.notifikasi-BU1OjZFx.mjs");
var Route$11 = createFileRoute("/_authenticated/app/notifikasi")({
	head: () => ({ meta: [{ title: "Notifikasi · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./app.laporan-UReF-RfK.mjs");
var Route$10 = createFileRoute("/_authenticated/app/laporan")({
	head: () => ({ meta: [{ title: "Laporan · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./app.keluarga-BOtWuzWG.mjs");
var Route$9 = createFileRoute("/_authenticated/app/keluarga")({
	head: () => ({ meta: [{ title: "Anggota Keluarga · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./app.budget-Bpox94o5.mjs");
var Route$8 = createFileRoute("/_authenticated/app/budget")({
	head: () => ({ meta: [{ title: "Budget Bulanan · Dompet Keluarga" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var adminGuard = async () => {
	const { data: u } = await supabase.auth.getUser();
	if (!u.user) throw redirect({ to: "/auth" });
	const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
	if (!r) throw redirect({ to: "/app" });
};
var $$splitComponentImporter$7 = () => import("./admin.users-Pfn--qlI.mjs");
var Route$7 = createFileRoute("/_authenticated/admin/users")({
	head: () => ({ meta: [{ title: "Manajemen User · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./admin.transaksi-DTGXTWHV.mjs");
var Route$6 = createFileRoute("/_authenticated/admin/transaksi")({
	head: () => ({ meta: [{ title: "Manajemen Transaksi · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./admin.pengaturan-D_Odx40Q.mjs");
var Route$5 = createFileRoute("/_authenticated/admin/pengaturan")({
	head: () => ({ meta: [{ title: "Pengaturan Sistem · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./admin.laporan-CrrcTrZc.mjs");
var Route$4 = createFileRoute("/_authenticated/admin/laporan")({
	head: () => ({ meta: [{ title: "Laporan Sistem · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./admin.keluarga-C2_P40uQ.mjs");
var Route$3 = createFileRoute("/_authenticated/admin/keluarga")({
	head: () => ({ meta: [{ title: "Manajemen Keluarga · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./admin.kategori-C8jJ7S7X.mjs");
var Route$2 = createFileRoute("/_authenticated/admin/kategori")({
	head: () => ({ meta: [{ title: "Kategori Global · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./admin.budget-template-DU18F6Ej.mjs");
var Route$1 = createFileRoute("/_authenticated/admin/budget-template")({
	head: () => ({ meta: [{ title: "Budget Template · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./admin.audit-DwyvY6lB.mjs");
var Route = createFileRoute("/_authenticated/admin/audit")({
	head: () => ({ meta: [{ title: "Audit Log · Admin" }] }),
	beforeLoad: adminGuard,
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var ResetPasswordRoute = Route$24.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$25
});
var ForgotPasswordRoute = Route$23.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$25
});
var AuthRoute = Route$22.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$25
});
var AuthenticatedRouteRoute = Route$21.update({
	id: "/_authenticated",
	getParentRoute: () => Route$25
});
var IndexRoute = Route$20.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$25
});
var AuthenticatedAppIndexRoute = Route$19.update({
	id: "/app/",
	path: "/app/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminIndexRoute = Route$18.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppTabunganRoute = Route$17.update({
	id: "/app/tabungan",
	path: "/app/tabungan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppRiwayatRoute = Route$16.update({
	id: "/app/riwayat",
	path: "/app/riwayat",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppProfilRoute = Route$15.update({
	id: "/app/profil",
	path: "/app/profil",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppPengeluaranRoute = Route$14.update({
	id: "/app/pengeluaran",
	path: "/app/pengeluaran",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppPengaturanRoute = Route$13.update({
	id: "/app/pengaturan",
	path: "/app/pengaturan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppPemasukanRoute = Route$12.update({
	id: "/app/pemasukan",
	path: "/app/pemasukan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppNotifikasiRoute = Route$11.update({
	id: "/app/notifikasi",
	path: "/app/notifikasi",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppLaporanRoute = Route$10.update({
	id: "/app/laporan",
	path: "/app/laporan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppKeluargaRoute = Route$9.update({
	id: "/app/keluarga",
	path: "/app/keluarga",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAppBudgetRoute = Route$8.update({
	id: "/app/budget",
	path: "/app/budget",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminUsersRoute = Route$7.update({
	id: "/admin/users",
	path: "/admin/users",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminTransaksiRoute = Route$6.update({
	id: "/admin/transaksi",
	path: "/admin/transaksi",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminPengaturanRoute = Route$5.update({
	id: "/admin/pengaturan",
	path: "/admin/pengaturan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminLaporanRoute = Route$4.update({
	id: "/admin/laporan",
	path: "/admin/laporan",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminKeluargaRoute = Route$3.update({
	id: "/admin/keluarga",
	path: "/admin/keluarga",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminKategoriRoute = Route$2.update({
	id: "/admin/kategori",
	path: "/admin/kategori",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedAdminBudgetTemplateRoute = Route$1.update({
	id: "/admin/budget-template",
	path: "/admin/budget-template",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAdminAuditRoute: Route.update({
		id: "/admin/audit",
		path: "/admin/audit",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedAdminBudgetTemplateRoute,
	AuthenticatedAdminKategoriRoute,
	AuthenticatedAdminKeluargaRoute,
	AuthenticatedAdminLaporanRoute,
	AuthenticatedAdminPengaturanRoute,
	AuthenticatedAdminTransaksiRoute,
	AuthenticatedAdminUsersRoute,
	AuthenticatedAppBudgetRoute,
	AuthenticatedAppKeluargaRoute,
	AuthenticatedAppLaporanRoute,
	AuthenticatedAppNotifikasiRoute,
	AuthenticatedAppPemasukanRoute,
	AuthenticatedAppPengaturanRoute,
	AuthenticatedAppPengeluaranRoute,
	AuthenticatedAppProfilRoute,
	AuthenticatedAppRiwayatRoute,
	AuthenticatedAppTabunganRoute,
	AuthenticatedAdminIndexRoute,
	AuthenticatedAppIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	ForgotPasswordRoute,
	ResetPasswordRoute
};
var routeTree = Route$25._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
