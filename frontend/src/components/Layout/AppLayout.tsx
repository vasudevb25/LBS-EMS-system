import { Sidebar } from "./Sidebar";
import { DashboardHeader } from "../../components/Dashboard/DashboardHeader";

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
          <Sidebar />
        </div>
        
        <div className="lg:pl-64 flex-1">
          <DashboardHeader />
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}