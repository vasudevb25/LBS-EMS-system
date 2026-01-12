import { cn } from "../../lib/utils";
import { ScrollArea } from "../ui/layout";
import {
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  ClipboardCheck,
  Bell,
  FileText,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const isAdmin = localStorage.getItem("is_admin") === "true";

const navigationAdmin = [
  { name: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { name: "Centre Management", href: "/app/centres", icon: Building2 },
  { name: "Course Management", href: "/app/courses", icon: BookOpen },
  { name: "Student Registration", href: "/app/students", icon: Users },
  {
    name: "Examination System",
    href: "/app/examinations",
    icon: ClipboardCheck,
  },
  { name: "Notifications", href: "/app/notifications", icon: Bell },
  { name: "Reports", href: "/app/reports", icon: FileText },
];

export function Sidebar() {
  const filteredNavigation = navigationAdmin.filter((item) => {
    // Only show Reports for admin users
    if (item.name === "Reports" && !isAdmin) {
      return false;
    }
    return true;
  });

  return (
    <div className={cn("pb-12 w-64")}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                LBS
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">EMS Admin</h2>
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Main Menu
            </h2>
            <ScrollArea className="h-[300px]">
              {filteredNavigation.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center space-x-2 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground",
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              ))}
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
}
