import { createFileRoute } from "@tanstack/react-router";
import { TransactionPage } from "@/components/app/transaction-page";

export const Route = createFileRoute("/_authenticated/app/pengeluaran")({
  head: () => ({ meta: [{ title: "Pengeluaran · Dompet Keluarga" }] }),
  component: () => <TransactionPage type="expense" />,
});
