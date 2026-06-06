import { AdminPanel } from "@/components/admin/AdminPanel";
import { RevenueChart } from "@/components/admin/RevenueChart";
export const metadata = { title: "Reports · Admin" };
export default function Page() {
  return (
    <AdminPanel title="Reports" description="Sales, products, inventory, customers and payments — export to PDF/Excel.">
      <RevenueChart />
    </AdminPanel>
  );
}
