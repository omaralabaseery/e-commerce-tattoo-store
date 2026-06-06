import { AdminPanel } from "@/components/admin/AdminPanel";
export const metadata = { title: "Customers · Admin" };
export default function Page() {
  return <AdminPanel title="Customers" description="View customers, order history, spending, and block/unblock." />;
}
