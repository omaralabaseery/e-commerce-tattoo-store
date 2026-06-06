import { AdminPanel } from "@/components/admin/AdminPanel";
export const metadata = { title: "Coupons · Admin" };
export default function Page() {
  return <AdminPanel title="Coupons & Offers" description="Percentage/fixed discounts, minimums, expiry, usage limits and targeting." />;
}
