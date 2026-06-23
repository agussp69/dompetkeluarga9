import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { I as ChartColumn, R as ArrowRight, f as Shield, i as Users, n as Wallet, u as Target, v as PiggyBank } from "../_libs/lucide-react.mjs";
import { i as formatIDR } from "./format-DLhBC1y6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-9P1KlPPb.js
var import_jsx_runtime = require_jsx_runtime();
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-16 max-w-7xl items-center justify-between px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-8 w-8 place-items-center rounded-md bg-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary-foreground" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold",
							children: "Dompet Keluarga"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "hidden rounded-md px-4 py-2 text-sm font-medium hover:bg-accent sm:inline-flex",
							children: "Masuk"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/auth",
							className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90",
							children: "Mulai Gratis"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-12 lg:py-28",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lg:col-span-7",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground",
								children: "Keuangan keluarga · sederhana"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
								className: "mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
								children: [
									"Kelola keuangan",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									"keluarga bersama,",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-primary",
										children: "transparan dan real-time."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-6 max-w-xl text-base text-muted-foreground sm:text-lg",
								children: "Catat pemasukan, atur anggaran bulanan, pantau pengeluaran, dan capai tabungan impian — semua dalam satu aplikasi yang dibagi seluruh anggota keluarga."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-wrap gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/auth",
									className: "inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90",
									children: ["Mulai sekarang ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#fitur",
									className: "inline-flex items-center rounded-md border border-border px-6 py-3 text-sm font-medium hover:bg-accent",
									children: "Lihat fitur"
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "lg:col-span-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MockDashboard, {})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-muted/40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-6 py-12 sm:grid-cols-4",
					children: [
						{
							k: "Pencatatan",
							v: "< 3 klik"
						},
						{
							k: "Anggota",
							v: "Tak terbatas"
						},
						{
							k: "Laporan",
							v: "Real-time"
						},
						{
							k: "Mata uang",
							v: "Rupiah"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-2xl font-semibold sm:text-3xl",
						children: s.v
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-xs uppercase tracking-widest text-muted-foreground",
						children: s.k
					})] }, s.k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "fitur",
				className: "border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-7xl px-6 py-20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-12 lg:grid-cols-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "lg:col-span-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-[10px] uppercase tracking-[0.25em] text-muted-foreground",
								children: "Fitur Utama"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-3 font-display text-3xl font-semibold tracking-tight",
								children: "Semua yang dibutuhkan keluarga modern."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-px bg-border lg:col-span-8 lg:grid-cols-2",
							children: [
								{
									i: Wallet,
									t: "Pemasukan & Pengeluaran",
									d: "Pencatatan cepat dengan kategori siap pakai dan lampiran bukti."
								},
								{
									i: PiggyBank,
									t: "Budget Bulanan",
									d: "Tetapkan pos anggaran dan dapatkan peringatan saat hampir habis."
								},
								{
									i: Target,
									t: "Tabungan Impian",
									d: "Pantau progres dana darurat, liburan, rumah, hingga umrah."
								},
								{
									i: ChartColumn,
									t: "Laporan & Analisis",
									d: "Grafik cashflow, insight otomatis, dan ekspor PDF/Excel/CSV."
								},
								{
									i: Users,
									t: "Multi-Anggota Keluarga",
									d: "Owner mengelola, anggota mencatat. Saldo dan laporan dibagi bersama."
								},
								{
									i: Shield,
									t: "Aman & Privat",
									d: "Setiap keluarga terisolasi. Hak akses berbasis peran."
								}
							].map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-background p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.i, { className: "h-5 w-5 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-4 font-display text-base font-semibold",
										children: f.t
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-muted-foreground",
										children: f.d
									})
								]
							}, i))
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-b border-border bg-primary text-primary-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-6 py-20 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl font-semibold tracking-tight sm:text-4xl",
							children: "Mulai catat hari ini. Gratis."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-4 max-w-xl text-base opacity-80",
							children: "Buat akun, undang anggota keluarga, dan rasakan bagaimana keuangan keluarga jadi jauh lebih jelas."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/auth",
							className: "mt-8 inline-flex items-center gap-2 rounded-md bg-background px-6 py-3 text-sm font-medium text-foreground hover:opacity-90",
							children: ["Buat akun keluarga ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "bg-background",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-sm font-medium",
							children: "Dompet Keluarga"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted-foreground",
						children: [
							"© ",
							(/* @__PURE__ */ new Date()).getFullYear(),
							" Dompet Keluarga · Untuk keluarga Indonesia."
						]
					})]
				})
			})
		]
	});
}
function MockDashboard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg border border-border bg-card shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] uppercase tracking-[0.2em] text-muted-foreground",
					children: "Saldo Keluarga"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-display text-3xl font-semibold",
					children: formatIDR(1245e4)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-px bg-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Pemasukan"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-display text-lg font-semibold text-success",
						children: ["+", formatIDR(85e5)]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Pengeluaran"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 font-display text-lg font-semibold text-destructive",
						children: ["-", formatIDR(322e4)]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3 p-5",
				children: [
					{
						l: "Belanja",
						v: 68,
						c: "bg-primary"
					},
					{
						l: "Cicilan",
						v: 92,
						c: "bg-warning"
					},
					{
						l: "Tabungan",
						v: 45,
						c: "bg-success"
					}
				].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex justify-between text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: r.l
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-medium",
						children: [r.v, "%"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `${r.c} h-full rounded-full`,
						style: { width: `${r.v}%` }
					})
				})] }, r.l))
			})
		]
	});
}
//#endregion
export { Landing as component };
