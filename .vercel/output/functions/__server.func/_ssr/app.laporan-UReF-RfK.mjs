import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { D as Download } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as useProfile, t as AppShell } from "./shell-DlVLLniV.mjs";
import { a as monthNameId, i as formatIDR, t as formatCompact } from "./format-DLhBC1y6.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { a as YAxis, c as Line, d as Cell, f as ResponsiveContainer, i as LineChart, l as Bar, m as Legend, n as PieChart, o as XAxis, p as Tooltip, r as BarChart, s as Area, t as AreaChart, u as Pie } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.laporan-UReF-RfK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const [period, setPeriod] = (0, import_react.useState)("month");
	const now = /* @__PURE__ */ new Date();
	const { data } = useQuery({
		enabled: !!familyId,
		queryKey: [
			"report",
			familyId,
			period
		],
		queryFn: async () => {
			let from = new Date(now.getFullYear(), now.getMonth(), 1);
			if (period === "week") from = /* @__PURE__ */ new Date(now.getTime() - 7 * 864e5);
			else if (period === "year") from = new Date(now.getFullYear(), 0, 1);
			else if (period === "day") from = now;
			const { data: txns } = await supabase.from("transactions").select("type, amount, occurred_at, category_id, categories:category_id(name)").eq("family_id", familyId).gte("occurred_at", from.toISOString().slice(0, 10)).order("occurred_at");
			const list = txns ?? [];
			const income = list.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
			const expense = list.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
			const balance = income - expense;
			const savingRate = income > 0 ? Math.max(0, (income - expense) / income * 100) : 0;
			const buckets = /* @__PURE__ */ new Map();
			list.forEach((t) => {
				const key = period === "year" ? t.occurred_at.slice(0, 7) : t.occurred_at;
				const label = period === "year" ? monthNameId(Number(t.occurred_at.slice(5, 7))).slice(0, 3) : t.occurred_at.slice(5);
				const b = buckets.get(key) ?? {
					label,
					income: 0,
					expense: 0
				};
				if (t.type === "income") b.income += Number(t.amount);
				else b.expense += Number(t.amount);
				buckets.set(key, b);
			});
			const series = Array.from(buckets.entries()).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
			const cats = /* @__PURE__ */ new Map();
			list.filter((t) => t.type === "expense").forEach((t) => {
				const n = t.categories?.name ?? "Lainnya";
				cats.set(n, (cats.get(n) ?? 0) + Number(t.amount));
			});
			return {
				income,
				expense,
				balance,
				savingRate,
				series,
				pie: Array.from(cats.entries()).map(([name, value]) => ({
					name,
					value
				})).sort((a, b) => b.value - a.value),
				raw: list
			};
		}
	});
	const exportCSV = () => {
		if (!data) return;
		const csv = [[
			"Tanggal",
			"Jenis",
			"Kategori",
			"Nominal"
		], ...data.raw.map((t) => [
			t.occurred_at,
			t.type,
			t.categories?.name ?? "",
			t.amount
		])].map((r) => r.map((c) => `"${String(c).replace(/"/g, "\"\"")}"`).join(",")).join("\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `laporan-${period}.csv`;
		a.click();
		URL.revokeObjectURL(url);
	};
	const COLORS = [
		"var(--color-primary)",
		"var(--color-success)",
		"var(--color-warning)",
		"var(--color-destructive)",
		"var(--color-chart-5)",
		"oklch(0.65 0.1 200)"
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Analisis",
			title: "Laporan Keuangan",
			description: "Visualisasi pemasukan, pengeluaran, dan komposisi keuangan keluarga.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: period,
					onValueChange: setPeriod,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: "w-[140px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "day",
							children: "Harian"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "week",
							children: "Mingguan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "month",
							children: "Bulanan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "year",
							children: "Tahunan"
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: exportCSV,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-4 w-4" }), "Export CSV"]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total Pemasukan",
					value: formatIDR(data?.income ?? 0),
					tone: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total Pengeluaran",
					value: formatIDR(data?.expense ?? 0),
					tone: "destructive"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Saldo",
					value: formatIDR(data?.balance ?? 0)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Rasio Tabungan",
					value: `${(data?.savingRate ?? 0).toFixed(0)}%`
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Area Cashflow",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
								data: data?.series ?? [],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
										id: "ar-inc",
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
										id: "ar-exp",
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
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										stroke: "var(--color-muted-foreground)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										fontSize: 10,
										tickLine: false,
										axisLine: false,
										tickFormatter: (v) => formatCompact(v),
										width: 60,
										stroke: "var(--color-muted-foreground)"
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
										fill: "url(#ar-inc)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
										type: "monotone",
										dataKey: "expense",
										stroke: "var(--color-destructive)",
										fill: "url(#ar-exp)"
									})
								]
							})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Bar Perbandingan",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
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
										tickFormatter: (v) => formatCompact(v),
										width: 60,
										stroke: "var(--color-muted-foreground)"
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
										fill: "var(--color-success)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "expense",
										name: "Pengeluaran",
										fill: "var(--color-destructive)"
									})
								]
							})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Line Tren",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
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
										tickFormatter: (v) => formatCompact(v),
										width: 60,
										stroke: "var(--color-muted-foreground)"
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "income",
										stroke: "var(--color-success)",
										strokeWidth: 2,
										dot: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
										type: "monotone",
										dataKey: "expense",
										stroke: "var(--color-destructive)",
										strokeWidth: 2,
										dot: false
									})
								]
							})
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Pie Kategori Pengeluaran",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: data?.pie ?? [],
									dataKey: "value",
									nameKey: "name",
									outerRadius: 80,
									children: (data?.pie ?? []).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
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
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 10 } })
							] })
						})
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Top Kategori Pengeluaran",
			className: "mt-6",
			children: data?.pie.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border",
				children: data.pie.slice(0, 10).map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-7 w-7 place-items-center rounded-md bg-muted text-xs font-medium",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: c.name
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display font-semibold",
						children: formatIDR(c.value)
					})]
				}, c.name))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Belum ada data."
			})
		})
	] });
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-2 font-display text-xl font-semibold sm:text-2xl ${tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : ""}`,
			children: value
		})]
	});
}
function Panel({ title, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-lg border border-border bg-card p-5 ${className ?? ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-4 font-display text-base font-semibold",
			children: title
		}), children]
	});
}
//#endregion
export { ReportsPage as component };
