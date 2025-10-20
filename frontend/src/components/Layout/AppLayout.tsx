import { Outlet } from "react-router-dom";
import { SidebarAdmin } from "./SidebarAdmin";
import { SidebarCentre } from "./SidebarCentre";
import { DashboardHeader } from "../../components/Dashboard/DashboardHeader";

interface AppLayoutProps {
  role: "Admin" | "Centre";
}

export function AppLayout({ role }: AppLayoutProps) {
  // cast the imported component to any to allow passing the role prop without TS errors
  const Header: any = DashboardHeader;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
          {role === "Admin" ? <SidebarAdmin /> : <SidebarCentre />}
        </div>

        <div className="lg:pl-64 flex-1">
          <Header role={role} />
          <main className="p-6">
            <Outlet /> {/* render nested routes */}
          </main>
        </div>
      </div>
    </div>
  );
}
