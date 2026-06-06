import { AdminPanel } from "@/components/admin/AdminPanel";
export const metadata = { title: "Payments · Admin" };
export default function Page() {
  return <AdminPanel title="Payments" description="Transactions, payment status, failed payments, refunds and reports." />;
}
