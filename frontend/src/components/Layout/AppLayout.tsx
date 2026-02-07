// AppLayout.tsx
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "../../components/Dashboard/DashboardHeader";
import useIdleLogout from "../../hooks/useIdleLogout";

export function AppLayout() {
  useIdleLogout();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="lg:pl-64 flex-1">
          <DashboardHeader />
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
