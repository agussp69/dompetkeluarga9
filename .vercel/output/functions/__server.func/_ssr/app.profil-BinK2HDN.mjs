import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-CCQEfgNs.mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as PageHeader, i as AvatarImage, n as Avatar, o as useProfile, r as AvatarFallback, t as AppShell } from "./shell-DlVLLniV.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app.profil-BinK2HDN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { data: profile } = useProfile();
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)("");
	const [pwd, setPwd] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (profile?.full_name) setName(profile.full_name);
	}, [profile?.full_name]);
	const saveProfile = useMutation({
		mutationFn: async () => {
			const { data: u } = await supabase.auth.getUser();
			const { error } = await supabase.from("profiles").update({ full_name: name }).eq("id", u.user.id);
			if (error) throw error;
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Profil diperbarui");
		},
		onError: (e) => toast.error(e.message)
	});
	const uploadAvatar = useMutation({
		mutationFn: async (file) => {
			const { data: u } = await supabase.auth.getUser();
			const path = `${u.user.id}/avatar-${Date.now()}.${file.name.split(".").pop()}`;
			const { error: upErr } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
			if (upErr) throw upErr;
			const { data: signed } = await supabase.storage.from("avatars").createSignedUrl(path, 3600 * 24 * 365);
			await supabase.from("profiles").update({ avatar_url: signed?.signedUrl ?? null }).eq("id", u.user.id);
		},
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["profile"] });
			toast.success("Foto profil diperbarui");
		},
		onError: (e) => toast.error(e.message)
	});
	const changePassword = useMutation({
		mutationFn: async () => {
			if (pwd.length < 8) throw new Error("Password minimal 8 karakter");
			const { error } = await supabase.auth.updateUser({ password: pwd });
			if (error) throw error;
		},
		onSuccess: () => {
			toast.success("Password diubah");
			setPwd("");
		},
		onError: (e) => toast.error(e.message)
	});
	const initials = (name || profile?.email || "U").split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		eyebrow: "Akun",
		title: "Profil",
		description: "Kelola informasi akun dan keamanan Anda."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-card p-6 lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold",
					children: "Informasi Pribadi"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
						className: "h-16 w-16",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, { src: profile?.avatar_url ?? void 0 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, { children: initials })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							id: "avatar",
							className: "hidden",
							onChange: (e) => {
								const f = e.target.files?.[0];
								if (f) uploadAvatar.mutate(f);
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => document.getElementById("avatar")?.click(),
							disabled: uploadAvatar.isPending,
							children: uploadAvatar.isPending ? "Mengunggah..." : "Ganti foto"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-muted-foreground",
							children: "PNG atau JPG."
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: (e) => {
						e.preventDefault();
						saveProfile.mutate();
					},
					className: "mt-6 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nama Lengkap" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: name,
								onChange: (e) => setName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: profile?.email ?? "",
								disabled: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: saveProfile.isPending,
							children: "Simpan Perubahan"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border border-border bg-card p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-base font-semibold",
				children: "Keamanan"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: (e) => {
					e.preventDefault();
					changePassword.mutate();
				},
				className: "mt-4 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Password Baru" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "password",
						value: pwd,
						onChange: (e) => setPwd(e.target.value),
						placeholder: "Minimal 8 karakter"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					className: "w-full",
					disabled: changePassword.isPending || pwd.length < 8,
					children: "Ubah Password"
				})]
			})]
		})]
	})] });
}
//#endregion
export { ProfilePage as component };
