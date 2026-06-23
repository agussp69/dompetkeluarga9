import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { _ as Plus, l as Trash2, u as Target, y as Pencil } from "../_libs/lucide-react.mjs";
import { a as PageHeader, o as useProfile, t as AppShell } from "./shell-DlVLLniV.mjs";
import { i as formatIDR, n as formatDate, o as todayISO } from "./format-DLhBC1y6.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { t as Textarea } from "./textarea-Dfe41XSO.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-D-U67h81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DYjyjhZD.mjs";
import { t as Progress } from "./progress-Rwu-UcSt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.tabungan-A13cVfPj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SavingsPage() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [contribFor, setContribFor] = (0, import_react.useState)(null);
	const { data: goals = [] } = useQuery({
		enabled: !!familyId,
		queryKey: ["goals", familyId],
		queryFn: async () => {
			const { data } = await supabase.from("savings_goals").select("*, savings_contributions(amount, contributed_at)").eq("family_id", familyId).order("priority", { ascending: true });
			return data ?? [];
		}
	});
	const delMut = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("savings_goals").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Target dihapus");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Goal",
		title: "Tabungan Impian",
		description: "Catat impian keluarga dan pantau progresnya bersama.",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open,
			onOpenChange: (v) => {
				setOpen(v);
				if (!v) setEditing(null);
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setEditing(null),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Tambah Target"]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoalDialog, {
				familyId,
				editing,
				onDone: () => setOpen(false)
			})]
		})
	}), goals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-dashed border-border p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-medium",
				children: "Belum ada target tabungan"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Buat target seperti dana darurat, liburan, atau rumah."
			})
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
		children: goals.map((g) => {
			const saved = (g.savings_contributions ?? []).reduce((s, c) => s + Number(c.amount), 0);
			const pct = g.target_amount ? Math.min(100, saved / Number(g.target_amount) * 100) : 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "min-w-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-display text-base font-semibold",
										children: g.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: g.deadline ? `Target ${formatDate(g.deadline)}` : "Tanpa deadline"
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => {
									setEditing(g);
									setOpen(true);
								},
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => delMut.mutate(g.id),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Terkumpul"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold",
									children: [pct.toFixed(0), "%"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								value: pct,
								className: "mt-2 h-2"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-semibold",
									children: formatIDR(saved)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" / ", formatIDR(g.target_amount)]
								})]
							}),
							g.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: g.note
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "mt-4 w-full",
							onClick: () => setContribFor(g),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-1 h-4 w-4" }), "Tambah Kontribusi"]
						})
					}), contribFor?.id === g.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContribDialog, {
						goal: g,
						onDone: () => setContribFor(null)
					}) : null] })
				]
			}, g.id);
		})
	})] });
}
function GoalDialog({ familyId, editing, onDone }) {
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(editing?.name ?? "");
	const [target, setTarget] = (0, import_react.useState)(editing?.target_amount?.toString() ?? "");
	const [deadline, setDeadline] = (0, import_react.useState)(editing?.deadline ?? "");
	const [priority, setPriority] = (0, import_react.useState)(editing?.priority?.toString() ?? "2");
	const [note, setNote] = (0, import_react.useState)(editing?.note ?? "");
	const save = useMutation({
		mutationFn: async () => {
			const num = Number(target.replace(/[^\d.-]/g, ""));
			if (!num || num <= 0) throw new Error("Target harus > 0");
			const { data: u } = await supabase.auth.getUser();
			const payload = {
				family_id: familyId,
				name,
				target_amount: num,
				deadline: deadline || null,
				priority: Number(priority) || 2,
				note: note || null,
				created_by: u.user.id
			};
			if (editing) {
				const { error } = await supabase.from("savings_goals").update(payload).eq("id", editing.id);
				if (error) throw error;
			} else {
				const { error } = await supabase.from("savings_goals").insert(payload);
				if (error) throw error;
			}
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Target disimpan");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit Target" : "Tambah Target" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Target" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "cth. Dana Liburan",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal Target (Rp)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "numeric",
						value: target,
						onChange: (e) => setTarget(e.target.value),
						required: true
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deadline" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: deadline,
						onChange: (e) => setDeadline(e.target.value)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Prioritas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: priority,
					onValueChange: setPriority,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "1",
							children: "Tinggi"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "2",
							children: "Sedang"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "3",
							children: "Rendah"
						})
					] })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catatan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: note,
					onChange: (e) => setNote(e.target.value)
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
function ContribDialog({ goal, onDone }) {
	const qc = useQueryClient();
	const [amount, setAmount] = (0, import_react.useState)("");
	const [date, setDate] = (0, import_react.useState)(todayISO());
	const [note, setNote] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: async () => {
			const num = Number(amount.replace(/[^\d.-]/g, ""));
			if (!num || num <= 0) throw new Error("Nominal harus > 0");
			const { data: u } = await supabase.auth.getUser();
			const { error } = await supabase.from("savings_contributions").insert({
				goal_id: goal.id,
				user_id: u.user.id,
				amount: num,
				contributed_at: date,
				note: note || null
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["goals"] });
			toast.success("Kontribusi ditambahkan");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Tambah Kontribusi: ", goal.name] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nominal (Rp)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					inputMode: "numeric",
					value: amount,
					onChange: (e) => setAmount(e.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tanggal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "date",
					value: date,
					onChange: (e) => setDate(e.target.value),
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Catatan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 2,
					value: note,
					onChange: (e) => setNote(e.target.value)
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
export { SavingsPage as component };
