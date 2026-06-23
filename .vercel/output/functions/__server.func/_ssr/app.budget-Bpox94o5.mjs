import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as CircleCheck, _ as Plus, l as Trash2, s as TriangleAlert, y as Pencil } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as useProfile, t as AppShell } from "./shell-DlVLLniV.mjs";
import { a as monthNameId, i as formatIDR } from "./format-DLhBC1y6.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-D-U67h81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as Progress } from "./progress-Rwu-UcSt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.budget-Bpox94o5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BudgetPage() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const qc = useQueryClient();
	const now = /* @__PURE__ */ new Date();
	const [year, setYear] = (0, import_react.useState)(now.getFullYear());
	const [month, setMonth] = (0, import_react.useState)(now.getMonth() + 1);
	const [openItem, setOpenItem] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const { data: budget } = useQuery({
		enabled: !!familyId,
		queryKey: [
			"budget",
			familyId,
			year,
			month
		],
		queryFn: async () => {
			const { data } = await supabase.from("budgets").select("*, budget_items(*, categories:category_id(name))").eq("family_id", familyId).eq("year", year).eq("month", month).maybeSingle();
			return data;
		}
	});
	const { data: realized = {} } = useQuery({
		enabled: !!familyId,
		queryKey: [
			"budget-realized",
			familyId,
			year,
			month
		],
		queryFn: async () => {
			const start = `${year}-${String(month).padStart(2, "0")}-01`;
			const end = new Date(year, month, 1).toISOString().slice(0, 10);
			const { data } = await supabase.from("transactions").select("category_id, amount").eq("family_id", familyId).eq("type", "expense").gte("occurred_at", start).lt("occurred_at", end);
			const map = {};
			(data ?? []).forEach((t) => {
				const k = t.category_id || "_none";
				map[k] = (map[k] ?? 0) + Number(t.amount);
			});
			return map;
		}
	});
	const { data: categories = [] } = useQuery({
		enabled: !!familyId,
		queryKey: [
			"categories",
			familyId,
			"expense"
		],
		queryFn: async () => {
			const { data } = await supabase.from("categories").select("id, name").or(`is_global.eq.true,family_id.eq.${familyId}`).eq("type", "expense").order("name");
			return data ?? [];
		}
	});
	const createBudget = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const { error } = await supabase.from("budgets").insert({
				family_id: familyId,
				year,
				month,
				created_by: u.user.id
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["budget"] });
			toast.success("Budget dibuat");
		},
		onError: (e) => toast.error(e.message)
	});
	const deleteItem = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("budget_items").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["budget"] });
			toast.success("Pos dihapus");
		}
	});
	const items = budget?.budget_items ?? [];
	const totalTarget = items.reduce((s, i) => s + Number(i.amount), 0);
	const totalRealized = items.reduce((s, i) => s + (realized[i.category_id ?? "_none"] ?? 0), 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			eyebrow: "Anggaran",
			title: "Budget Bulanan",
			description: "Tetapkan pos anggaran dan pantau realisasinya.",
			action: budget ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
				open: openItem,
				onOpenChange: (v) => {
					setOpenItem(v);
					if (!v) setEditing(null);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setEditing(null),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Tambah Pos"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemDialog, {
					budgetId: budget.id,
					categories,
					editing,
					onDone: () => setOpenItem(false)
				})]
			}) : null
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-[200px_200px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: String(year),
				onValueChange: (v) => setYear(Number(v)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
					now.getFullYear() - 1,
					now.getFullYear(),
					now.getFullYear() + 1
				].map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(y),
					children: y
				}, y)) })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: String(month),
				onValueChange: (v) => setMonth(Number(v)),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Array.from({ length: 12 }, (_, i) => i + 1).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: String(m),
					children: monthNameId(m)
				}, m)) })]
			})]
		}),
		!budget ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-dashed border-border p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-medium",
					children: [
						"Belum ada budget untuk ",
						monthNameId(month),
						" ",
						year
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Buat budget bulanan untuk mulai melacak pengeluaran per pos."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4",
					onClick: () => createBudget.mutate(),
					children: "Buat Budget"
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total Target",
					value: formatIDR(totalTarget)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Total Realisasi",
					value: formatIDR(totalRealized)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Sisa Budget",
					value: formatIDR(Math.max(0, totalTarget - totalRealized)),
					tone: totalRealized > totalTarget ? "destructive" : "success"
				})
			]
		}), items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-dashed border-border p-12 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "Belum ada pos anggaran"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Tambah pos untuk mulai melacak."
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.map((it) => {
				const real = realized[it.category_id ?? "_none"] ?? 0;
				const pct = it.amount > 0 ? real / Number(it.amount) * 100 : 0;
				const over = pct > 100;
				const warn = pct > 80 && pct <= 100;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-start justify-between gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium",
										children: it.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs text-muted-foreground",
										children: it.categories?.name ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "font-display text-sm",
										children: [
											formatIDR(real),
											" / ",
											formatIDR(it.amount)
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: `text-xs ${over ? "text-destructive" : warn ? "text-warning" : "text-muted-foreground"}`,
										children: [pct.toFixed(0), "%"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => {
											setEditing(it);
											setOpenItem(true);
										},
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon",
										onClick: () => deleteItem.mutate(it.id),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
							value: Math.min(100, pct),
							className: `mt-3 h-1.5 ${over ? "[&>div]:bg-destructive" : warn ? "[&>div]:bg-warning" : ""}`
						}),
						over ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-center gap-1.5 text-xs text-destructive",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }),
								"Melebihi budget sebesar ",
								formatIDR(real - Number(it.amount)),
								"."
							]
						}) : warn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-center gap-1.5 text-xs text-warning",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3 w-3" }), "Mendekati batas budget."]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), "Masih aman."]
						})
					]
				}, it.id);
			})
		})] })
	] });
}
function Stat({ label, value, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] uppercase tracking-widest text-muted-foreground",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: `mt-2 font-display text-2xl font-semibold ${tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : ""}`,
			children: value
		})]
	});
}
function ItemDialog({ budgetId, categories, editing, onDone }) {
	const qc = useQueryClient();
	const [label, setLabel] = (0, import_react.useState)(editing?.label ?? "");
	const [amount, setAmount] = (0, import_react.useState)(editing?.amount?.toString() ?? "");
	const [categoryId, setCategoryId] = (0, import_react.useState)(editing?.category_id ?? "");
	const save = useMutation({
		mutationFn: async () => {
			const num = Number(amount.replace(/[^\d.-]/g, ""));
			if (!num || num <= 0) throw new Error("Target harus > 0");
			const payload = {
				budget_id: budgetId,
				label,
				amount: num,
				category_id: categoryId || null
			};
			if (editing) {
				const { error } = await supabase.from("budget_items").update(payload).eq("id", editing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("budget_items").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["budget"] });
			toast.success("Pos disimpan");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Pos" : "Tambah Pos Anggaran" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Pos" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: label,
					onChange: (e) => setLabel(e.target.value),
					placeholder: "cth. Belanja Bulanan",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target (Rp)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Kategori" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: categoryId,
					onValueChange: setCategoryId,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Pilih kategori" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: categories.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: c.id,
						children: c.name
					}, c.id)) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: onDone,
				children: "Batal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: save.isPending,
				children: "Simpan"
			})] })
		]
	})] });
}
//#endregion
export { BudgetPage as component };
