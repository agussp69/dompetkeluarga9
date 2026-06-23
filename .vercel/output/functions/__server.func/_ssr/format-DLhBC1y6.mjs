//#region node_modules/.nitro/vite/services/ssr/assets/format-DLhBC1y6.js
var formatIDR = (n) => {
	const num = typeof n === "string" ? Number(n) : n ?? 0;
	if (!Number.isFinite(num)) return "Rp 0";
	return "Rp " + new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(num);
};
var formatCompact = (n) => {
	const num = typeof n === "string" ? Number(n) : n ?? 0;
	return "Rp " + new Intl.NumberFormat("id-ID", {
		notation: "compact",
		maximumFractionDigits: 1
	}).format(num);
};
var formatDate = (d, opts) => {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("id-ID", opts ?? {
		day: "numeric",
		month: "short",
		year: "numeric"
	}).format(date);
};
var formatDateTime = (d) => {
	if (!d) return "—";
	const date = typeof d === "string" ? new Date(d) : d;
	return new Intl.DateTimeFormat("id-ID", {
		dateStyle: "medium",
		timeStyle: "short"
	}).format(date);
};
var monthNameId = (m) => [
	"Januari",
	"Februari",
	"Maret",
	"April",
	"Mei",
	"Juni",
	"Juli",
	"Agustus",
	"September",
	"Oktober",
	"November",
	"Desember"
][m - 1] ?? "";
var todayISO = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
//#endregion
export { monthNameId as a, formatIDR as i, formatDate as n, todayISO as o, formatDateTime as r, formatCompact as t };
