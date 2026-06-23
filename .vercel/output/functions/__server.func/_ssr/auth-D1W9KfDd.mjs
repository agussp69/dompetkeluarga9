import { i as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BEuMdBdI.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { P as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-CCQEfgNs.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Check, n as Wallet } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-DoD5W07l.mjs";
import { t as Label } from "./label-B1jF9p8Y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { n as stringType, t as objectType } from "../_libs/zod.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-D1W9KfDd.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var loginSchema = objectType({
	email: stringType().trim().email("Format email tidak valid"),
	password: stringType().min(6, "Password minimal 6 karakter")
});
var registerSchema = objectType({
	fullName: stringType().trim().min(2, "Nama minimal 2 karakter").max(80),
	email: stringType().trim().email("Format email tidak valid"),
	password: stringType().min(8, "Password minimal 8 karakter")
});
function AuthPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid min-h-screen lg:grid-cols-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hidden border-r border-border bg-primary p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: "Dompet Keluarga"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-[10px] uppercase tracking-[0.25em] opacity-70",
						children: "Keuangan Keluarga"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-4xl font-semibold leading-tight",
						children: "Satu aplikasi, satu keluarga, satu visi keuangan."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-md text-sm opacity-80",
						children: "Catat pemasukan dan pengeluaran bersama, tetapkan anggaran, dan raih tabungan impian — semua transparan untuk seluruh anggota."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs opacity-60",
					children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Dompet Keluarga"
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-center p-6 sm:p-12",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "mb-8 flex items-center gap-2 lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "h-5 w-5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-display text-lg font-semibold",
						children: "Dompet Keluarga"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCard, {})]
			})
		})]
	});
}
function AuthCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
		defaultValue: "login",
		className: "w-full",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "grid w-full grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "login",
					children: "Masuk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "register",
					children: "Daftar"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "login",
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoginForm, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
				value: "register",
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegisterForm, {})
			})
		]
	});
}
function GoogleButton() {
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handle = async () => {
		setLoading(true);
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: { redirectTo: window.location.origin + "/app" }
		});
		if (error) {
			toast.error("Gagal masuk dengan Google: " + error.message);
			setLoading(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		className: "w-full",
		onClick: handle,
		disabled: loading,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			className: "mr-2 h-4 w-4",
			viewBox: "0 0 24 24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#4285F4",
					d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#34A853",
					d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#FBBC04",
					d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					fill: "#EA4335",
					d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
				})
			]
		}), "Lanjut dengan Google"]
	});
}
function LoginForm() {
	const navigate = useNavigate();
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		const parsed = loginSchema.safeParse({
			email,
			password
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		});
		setLoading(false);
		if (error) {
			toast.error(error.message === "Invalid login credentials" ? "Email atau password salah" : error.message);
			return;
		}
		toast.success("Selamat datang!");
		navigate({ to: "/app" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Masuk ke akun Anda"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Lanjutkan mengelola keuangan keluarga."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative my-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex justify-center text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-background px-2 text-muted-foreground",
						children: "atau"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "email",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "email",
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "nama@email.com",
					autoComplete: "email",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "password",
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "password",
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: "••••••••",
					autoComplete: "current-password",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
						checked: remember,
						onCheckedChange: (v) => setRemember(!!v)
					}), "Ingat saya"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: "text-sm text-primary hover:underline",
					children: "Lupa password?"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: loading,
				children: loading ? "Memproses..." : "Masuk"
			})
		]
	});
}
function RegisterForm() {
	const navigate = useNavigate();
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const onSubmit = async (e) => {
		e.preventDefault();
		const parsed = registerSchema.safeParse({
			fullName,
			email,
			password
		});
		if (!parsed.success) {
			toast.error(parsed.error.issues[0].message);
			return;
		}
		setLoading(true);
		const { error, data } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: window.location.origin + "/app",
				data: { full_name: fullName }
			}
		});
		setLoading(false);
		if (error) {
			toast.error(error.message);
			return;
		}
		if (data.session) {
			toast.success("Akun berhasil dibuat!");
			navigate({ to: "/app" });
		} else toast.success("Akun dibuat. Silakan cek email untuk verifikasi.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: "Buat akun keluarga"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Mulai gratis. Tidak perlu kartu kredit."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleButton, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative my-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 flex items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-full border-t border-border" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative flex justify-center text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "bg-background px-2 text-muted-foreground",
						children: "atau"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "name",
					children: "Nama lengkap"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "name",
					value: fullName,
					onChange: (e) => setFullName(e.target.value),
					placeholder: "Budi Santoso",
					autoComplete: "name",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "email-r",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "email-r",
					type: "email",
					value: email,
					onChange: (e) => setEmail(e.target.value),
					placeholder: "nama@email.com",
					autoComplete: "email",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "password-r",
					children: "Password"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "password-r",
					type: "password",
					value: password,
					onChange: (e) => setPassword(e.target.value),
					placeholder: "Minimal 8 karakter",
					autoComplete: "new-password",
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				className: "w-full",
				disabled: loading,
				children: loading ? "Memproses..." : "Daftar"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-center text-xs text-muted-foreground",
				children: "Dengan mendaftar Anda menyetujui ketentuan dan kebijakan privasi kami."
			})
		]
	});
}
//#endregion
export { AuthPage as component };
