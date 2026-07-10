import { Sidebar } from "@/components/admin/Sidebar";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { Bell, Search } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
    <div className="flex min-h-screen bg-mist/40">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-white/90 px-5 backdrop-blur">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Search className="h-4 w-4" />
            <input
              placeholder="Search…"
              className="w-40 bg-transparent outline-none placeholder:text-muted sm:w-64"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 hover:bg-mist" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-ink" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-xs font-medium text-paper">
              SA
            </div>
          </div>
        </header>
        <div className="flex-1 p-5 sm:p-7">{children}</div>
      </div>
    </div>
    </AdminGuard>
  );
}
