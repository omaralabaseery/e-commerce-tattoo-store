import { Sidebar } from "@/components/admin/Sidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminUserBadge } from "@/components/admin/AdminUserBadge";

export const metadata = { title: "Admin Dashboard" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-mist/40">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-end border-b border-line bg-white/90 px-5 backdrop-blur">
            <AdminUserBadge />
          </header>
          <div className="flex-1 p-5 sm:p-7">{children}</div>
        </div>
      </div>
    </AdminGuard>
  );
}
