import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopbar } from "./AdminTopbar";

interface AdminLayoutProps {
  libraryName: string;
  onLogOut?: () => void;
}

export function AdminLayout({ libraryName, onLogOut }: AdminLayoutProps) {
  return (
    <div className="flex h-screen bg-ivory-100">
      <AdminSidebar libraryName={libraryName} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar libraryName={libraryName} onLogOut={onLogOut} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}