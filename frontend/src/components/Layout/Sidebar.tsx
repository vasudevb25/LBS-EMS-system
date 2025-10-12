import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/buttons";
import { ScrollArea } from "../../components/ui/layout";
import { 
  LayoutDashboard,
  Building2,
  BookOpen,
  Users,
  ClipboardCheck,
  Bell,
  FileText,
  Settings,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Centre Management",
    href: "/centres",
    icon: Building2,
  },
  {
    name: "Course Management", 
    href: "/courses",
    icon: BookOpen,
  },
  {
    name: "Student Registration",
    href: "/students",
    icon: Users,
  },
  {
    name: "Examination System",
    href: "/examinations",
    icon: ClipboardCheck,
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: FileText,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("pb-12 w-64", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="flex items-center space-x-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">LBS</span>
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
              {navigation.map((item) => (
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
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}