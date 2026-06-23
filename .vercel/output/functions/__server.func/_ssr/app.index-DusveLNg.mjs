import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { M as CircleArrowDown, _ as Plus, c as TrendingUp, j as CircleArrowUp, n as Wallet, s as TriangleAlert, u as Target, w as Lightbulb } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as useProfile, t as AppShell } from "./shell-DlVLLniV.mjs";
import { a as monthNameId, i as formatIDR, n as formatDate, t as formatCompact } from "./format-DLhBC1y6.mjs";
import { a as YAxis, d as Cell, f as ResponsiveContainer, l as Bar, m as Legend, n as PieChart, o as XAxis, p as Tooltip, r as BarChart, s as Area, t as AreaChart, u as Pie } from "../_libs/recharts+[...].mjs";
import { t as Progress } from "./progress-Rwu-UcSt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.index-DusveLNg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useDashboardData(familyId) {
	return useQuery({
		enabled: !!familyId,
		queryKey: ["dashboard", familyId],
		queryFn: async () => {
			const now = /* @__PURE__ */ new Date();
			const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
			const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().slice(0, 10);
			const [allTxn, monthTxn, goals, recent, categories] = await Promise.all([
				supabase.from("transactions").select("type, amount").eq("family_id", familyId),
				supabase.from("transactions").select("type, amount, occurred_at, category_id").eq("family_id", familyId).gte("occurred_at", sixMonthsAgo),
				supabase.from("savings_goals").select("id, name, target_amount, savings_contributions(amount)").eq("family_id", familyId),
				supabase.from("transactions").select("id, type, amount, description, occurred_at, category_id, user_id, categories:category_id(name)").eq("family_id", familyId).order("created_at", { ascending: false }).limit(6),
				supabase.from("categories").select("id, name, type").or(`is_global.eq.true,family_id.eq.${familyId}`)
			]);
			const txns = allTxn.data ?? [];
			const totalIncome = txns.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
			const totalExpense = txns.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
			const balance = totalIncome - totalExpense;
			const monthData = monthTxn.data ?? [];
			const monthIncome = monthData.filter((t) => t.type === "income" && t.occurred_at >= monthStart).reduce((s, t) => s + Number(t.amount), 0);
			const monthExpense = monthData.filter((t) => t.type === "expense" && t.occurred_at >= monthStart).reduce((s, t) => s + Number(t.amount), 0);
			const savingRate = monthIncome > 0 ? Math.max(0, (monthIncome - monthExpense) / monthIncome * 100) : 0;
			const months = [];
			for (let i = 5; i >= 0; i--) {
				const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
				months.push({
					key,
					label: monthNameId(d.getMonth() + 1).slice(0, 3),
					income: 0,
					expense: 0
				});
			}
			for (const t of monthData) {
				const k = t.occurred_at.slice(0, 7);
				const m = months.find((x) => x.key === k);
				if (!m) continue;
				if (t.type === "income") m.income += Number(t.amount);
				else m.expense += Number(t.amount);
			}
			const catMap = /* @__PURE__ */ new Map();
			(categories.data ?? []).forEach((c) => catMap.set(c.id, c.name));
			const catTotals = /* @__PURE__ */ new Map();
			monthData.filter((t) => t.type === "expense" && t.occurred_at >= monthStart).forEach((t) => {
				const name = t.category_id && catMap.get(t.category_id) || "Lainnya";
				catTotals.set(name, (catTotals.get(name) ?? 0) + Number(t.amount));
			});
			return {
				balance,
				totalIncome,
				totalExpense,
				monthIncome,
				monthExpense,
				savingRate,
				months,
				pie: Array.from(catTotals.entries()).map(([name, value]) => ({
					name,
					value
				})).sort((a, b) => b.value - a.value).slice(0, 6),
				goalProgress: (goals.data ?? []).map((g) => {
					const saved = (g.savings_contributions ?? []).reduce((s, c) => s + Number(c.amount), 0);
					return {
						id: g.id,
						name: g.name,
						target: Number(g.target_amount),
						saved,
						pct: g.target_amount ? Math.min(100, saved / Number(g.target_amount) * 100) : 0
					};
				}).slice(0, 3),
				recent: recent.data ?? []
			};
		}
	});
}
function Dashboard() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const { data, isLoading } = useDashboardData(familyId);
	const greeting = (0, import_react.useMemo)(() => {
		const h = (/* @__PURE__ */ new Date()).getHours();
		if (h < 11) return "Selamat pagi";
		if (h < 15) return "Selamat siang";
		if (h < 18) return "Selamat sore";
		return "Selamat malam";
	}, []);
	const insights = (0, import_react.useMemo)(() => {
		if (!data) return [];
		const out = [];
		if (data.savingRate > 20) out.push(`Hebat! Rasio tabungan bulan ini ${data.savingRate.toFixed(0)}%.`);
		if (data.monthExpense > data.monthIncome) out.push("Pengeluaran bulan ini melebihi pemasukan — saatnya tinjau anggaran.");
		if (data.pie[0]) out.push(`Pengeluaran terbesar bulan ini: ${data.pie[0].name} (${formatIDR(data.pie[0].value)}).`);
		if (data.balance > 0 && out.length < 3) out.push(`Saldo keluarga positif: ${formatIDR(data.balance)}.`);
		return out.slice(0, 3);
	}, [data]);
	const CHART_COLORS = [
		"var(--color-primary)",
		"var(--color-success)",
		"var(--color-warning)",
		"var(--color-destructive)",
		"var(--color-chart-5)",
		"oklch(0.65 0.1 200)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Dashboard",
			title: `${greeting}, ${profile?.full_name?.split(" ")[0] ?? "Keluarga"}.`,
			description: "Ringkasan keuangan keluarga Anda hari ini.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/pemasukan",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Pemasukan"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/pengeluaran",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Pengeluaran"]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
					icon: Wallet,
					label: "Saldo Keluarga",
					value: formatIDR(data?.balance ?? 0),
					tone: "primary",
					loading: isLoading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
					icon: CircleArrowDown,
					label: "Pemasukan Bulan Ini",
					value: formatIDR(data?.monthIncome ?? 0),
					tone: "success",
					loading: isLoading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
					icon: CircleArrowUp,
					label: "Pengeluaran Bulan Ini",
					value: formatIDR(data?.monthExpense ?? 0),
					tone: "destructive",
					loading: isLoading
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KPI, {
					icon: TrendingUp,
					label: "Rasio Tabungan",
					value: `${(data?.savingRate ?? 0).toFixed(0)}%`,
					tone: "default",
					loading: isLoading
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex items-center justify-between",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Cashflow"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Pemasukan vs Pengeluaran (6 bulan)"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
							data: data?.months ?? [],
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "inc",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-success)",
										stopOpacity: .3
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-success)",
										stopOpacity: 0
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
									id: "exp",
									x1: "0",
									y1: "0",
									x2: "0",
									y2: "1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "0%",
										stopColor: "var(--color-destructive)",
										stopOpacity: .3
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
										offset: "100%",
										stopColor: "var(--color-destructive)",
										stopOpacity: 0
									})]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "label",
									fontSize: 11,
									stroke: "var(--color-muted-foreground)",
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									fontSize: 11,
									stroke: "var(--color-muted-foreground)",
									tickLine: false,
									axisLine: false,
									tickFormatter: (v) => formatCompact(v),
									width: 70
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => formatIDR(v),
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 6,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "income",
									stroke: "var(--color-success)",
									fill: "url(#inc)",
									strokeWidth: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
									type: "monotone",
									dataKey: "expense",
									stroke: "var(--color-destructive)",
									fill: "url(#exp)",
									strokeWidth: 2
								})
							]
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Distribusi"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Kategori Pengeluaran"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 h-64",
						children: data?.pie.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: data.pie,
									dataKey: "value",
									nameKey: "name",
									outerRadius: 70,
									innerRadius: 45,
									children: data.pie.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: CHART_COLORS[i % CHART_COLORS.length] }, i))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									formatter: (v) => formatIDR(v),
									contentStyle: {
										background: "var(--color-card)",
										border: "1px solid var(--color-border)",
										borderRadius: 6,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
							] })
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, { text: "Belum ada pengeluaran bulan ini." })
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5 lg:col-span-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Perbandingan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Per Bulan"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 h-56",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: data?.months ?? [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										fontSize: 11,
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 11,
										stroke: "var(--color-muted-foreground)",
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => formatCompact(v),
										width: 70
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										formatter: (v) => formatIDR(v),
										contentStyle: {
											background: "var(--color-card)",
											border: "1px solid var(--color-border)",
											borderRadius: 6,
											fontSize: 12
										}
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "income",
										name: "Pemasukan",
										fill: "var(--color-success)",
										radius: [
											2,
											2,
											0,
											0
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "expense",
										name: "Pengeluaran",
										fill: "var(--color-destructive)",
										radius: [
											2,
											2,
											0,
											0
										]
									})
								]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] uppercase tracking-widest text-muted-foreground",
						children: "Progress"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Tabungan Impian"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4 text-muted-foreground" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [data?.goalProgress.length ? data.goalProgress.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-1 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: g.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [g.pct.toFixed(0), "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: g.pct,
							className: "h-1.5"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								formatIDR(g.saved),
								" dari ",
								formatIDR(g.target)
							]
						})
					] }, g.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyHint, { text: "Belum ada target tabungan." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/tabungan",
						className: "block text-sm text-primary hover:underline",
						children: "Kelola tabungan →"
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Insight Otomatis"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-3 text-sm",
					children: insights.length ? insights.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" }), s]
					}, i)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-muted-foreground",
						children: "Belum ada cukup data untuk insight."
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5 lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: "Aktivitas Terbaru"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/riwayat",
						className: "text-sm text-primary hover:underline",
						children: "Lihat semua →"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: data?.recent.length ? data.recent.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-9 w-9 shrink-0 place-items-center rounded-md ${t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`,
								children: t.type === "income" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleArrowUp, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: t.description || t.categories?.name || "Transaksi"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted-foreground",
									children: [
										t.categories?.name ?? "—",
										" · ",
										formatDate(t.occurred_at),
										" · ",
										t.profiles?.full_name ?? ""
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `shrink-0 font-display text-sm font-semibold ${t.type === "income" ? "text-success" : "text-destructive"}`,
							children: [t.type === "income" ? "+" : "-", formatIDR(t.amount)]
						})]
					}, t.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-8 text-center text-sm text-muted-foreground",
						children: "Belum ada transaksi. Mulai catat sekarang."
					})
				})]
			})]
		})
	] });
}
function KPI({ icon: Icon, label, value, tone, loading }) {
	const toneClass = {
		primary: "text-primary",
		success: "text-success",
		destructive: "text-destructive",
		default: "text-foreground"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] uppercase tracking-widest text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${toneClass}` })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-3 font-display text-xl font-semibold sm:text-2xl ${toneClass}`,
			children: loading ? "—" : value
		})]
	});
}
function EmptyHint({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex h-full items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mx-auto h-5 w-5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: text
			})]
		})
	});
}
//#endregion
export { Dashboard as component };
