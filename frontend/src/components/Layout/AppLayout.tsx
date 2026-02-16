import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "../../components/Dashboard/DashboardHeader";
import useIdleLogout from "../../hooks/useIdleLogout";

export function AppLayout() {
  useIdleLogout();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <Sidebar />
      </div>

      {/* Main Wrapper */}
      <div
        className={`transition-all duration-300
          ${sidebarOpen ? "ml-64" : "ml-0"}`}
      >
        {/* Header */}
        <DashboardHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
