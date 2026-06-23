import { createFileRoute } from "@tanstack/react-router";
import { TransactionPage } from "@/components/app/transaction-page";

export const Route = createFileRoute("/_authenticated/app/pemasukan")({
  head: () => ({ meta: [{ title: "Pemasukan · Dompet Keluarga" }] }),
  component: () => <TransactionPage type="income" />,
});
