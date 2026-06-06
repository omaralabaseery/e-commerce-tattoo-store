import { AdminPanel } from "@/components/admin/AdminPanel";
export const metadata = { title: "Inventory · Admin" };
export default function Page() {
  return <AdminPanel title="Inventory" description="Stock in/out, low-stock warnings, damaged & returned items, and history." />;
}
