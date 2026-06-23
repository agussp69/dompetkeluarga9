import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { O as Crown, a as User, k as Copy, l as Trash2, o as UserPlus, x as Mail } from "../_libs/lucide-react.mjs";
import { a as PageHeader, i as AvatarImage, n as Avatar, o as useProfile, r as AvatarFallback, t as AppShell } from "./shell-DlVLLniV.mjs";
import { n as formatDate } from "./format-DLhBC1y6.mjs";
import { t as Badge } from "./badge-Bt-nVIZo.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, o as DialogTrigger, r as DialogFooter, t as Dialog } from "./dialog-D-U67h81.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.keluarga-BOtWuzWG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FamilyPage() {
	const { data: profile } = useProfile();
	const familyId = profile?.active_family_id;
	const qc = useQueryClient();
	const [openInv, setOpenInv] = (0, import_react.useState)(false);
	const { data: family } = useQuery({
		enabled: !!familyId,
		queryKey: ["family", familyId],
		queryFn: async () => {
			const { data } = await supabase.from("families").select("*").eq("id", familyId).single();
			return data;
		}
	});
	const { data: members = [] } = useQuery({
		enabled: !!familyId,
		queryKey: ["members", familyId],
		queryFn: async () => {
			const { data: fm } = await supabase.from("family_members").select("id, role, joined_at, user_id").eq("family_id", familyId);
			const ids = (fm ?? []).map((m) => m.user_id);
			let profilesMap = {};
			if (ids.length) {
				const { data: ps } = await supabase.from("profiles").select("id, full_name, email, avatar_url").in("id", ids);
				(ps ?? []).forEach((p) => profilesMap[p.id] = p);
			}
			return (fm ?? []).map((m) => ({
				...m,
				profiles: profilesMap[m.user_id]
			}));
		}
	});
	const { data: invs = [] } = useQuery({
		enabled: !!familyId,
		queryKey: ["invs", familyId],
		queryFn: async () => {
			const { data } = await supabase.from("invitations").select("*").eq("family_id", familyId).eq("status", "pending");
			return data ?? [];
		}
	});
	const isOwner = members.some((m) => m.user_id === profile?.id && m.role === "owner");
	const removeMember = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("family_members").delete().eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["members"] });
			toast.success("Anggota dikeluarkan");
		}
	});
	const revokeInv = useMutation({
		mutationFn: async (id) => {
			const { error } = await supabase.from("invitations").update({ status: "revoked" }).eq("id", id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["invs"] });
			toast.success("Undangan dicabut");
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: family?.name,
		title: "Anggota Keluarga",
		description: "Kelola siapa saja yang dapat mengakses dan mencatat keuangan keluarga.",
		action: isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
			open: openInv,
			onOpenChange: setOpenInv,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "mr-1 h-4 w-4" }), "Undang Anggota"] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InviteDialog, {
				familyId,
				onDone: () => setOpenInv(false)
			})]
		}) : null
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground",
				children: "Anggota Aktif"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
				children: members.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center gap-4 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
							className: "h-10 w-10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: m.profiles?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: (m.profiles?.full_name ?? "U").slice(0, 2).toUpperCase() })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: m.profiles?.full_name ?? "Pengguna"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: m.profiles?.email
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: m.role === "owner" ? "default" : "secondary",
							children: m.role === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "mr-1 h-3 w-3" }), "Owner"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "mr-1 h-3 w-3" }), "Anggota"] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-muted-foreground sm:inline",
							children: formatDate(m.joined_at)
						}),
						isOwner && m.role !== "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon",
							onClick: () => removeMember.mutate(m.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}) : null
					]
				}, m.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground",
			children: "Undangan Tertunda"
		}), invs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground",
			children: "Belum ada undangan tertunda."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-2",
			children: invs.map((iv) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-lg border border-border bg-card p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate text-sm",
						children: iv.email
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						className: "flex-1",
						onClick: () => {
							navigator.clipboard.writeText(`${window.location.origin}/auth?inv=${iv.token}`);
							toast.success("Tautan disalin");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3 w-3" }), "Salin tautan"]
					}), isOwner ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => revokeInv.mutate(iv.id),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
					}) : null]
				})]
			}, iv.id))
		})] })]
	})] });
}
function InviteDialog({ familyId, onDone }) {
	const qc = useQueryClient();
	const [email, setEmail] = (0, import_react.useState)("");
	const save = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const { error } = await supabase.from("invitations").insert({
				family_id: familyId,
				email: email.trim().toLowerCase(),
				invited_by: u.user.id,
				role: "anggota"
			});
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["invs"] });
			toast.success("Undangan dibuat. Salin tautan untuk dikirimkan.");
			onDone();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Undang anggota keluarga" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			save.mutate();
		},
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "anggota@email.com",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Tautan undangan akan dibuat. Salin dan kirim ke anggota Anda."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "ghost",
				onClick: onDone,
				children: "Batal"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				disabled: save.isPending,
				children: "Buat Undangan"
			})] })
		]
	})] });
}
//#endregion
export { FamilyPage as component };
