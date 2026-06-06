import { AdminPanel } from "@/components/admin/AdminPanel";
export const metadata = { title: "Settings · Admin" };
export default function Page() {
  return <AdminPanel title="Settings" description="Store info, logo, currency, delivery fees, tax, payments, and integrations." />;
}
