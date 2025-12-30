import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, Settings, User } from "lucide-react";
import { Button } from "../../components/ui/buttons";
import { Input } from "../../components/ui/inputs";
import { ThemeToggle } from "../../components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/menus";

const API_URL = import.meta.env.VITE_API_URL;

export function DashboardHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; role: string } | null>(
    null
  );

  // Fetch logged-in user info from localStorage (or backend)
  useEffect(() => {
    const role = localStorage.getItem("user_role");
    const username = localStorage.getItem("username");
    if (role && username) {
      setUser({ username, role });
    }
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API_URL}/api/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // still okay for Django session-based logout
      });

      // Always clear local storage, even if backend logout fails
      localStorage.removeItem("user_role");
      localStorage.removeItem("username");

      if (res.ok) {
        console.log("✅ Logged out successfully");
      } else {
        console.warn("⚠️ Backend logout failed, clearing session anyway");
      }

      // Redirect immediately
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user_role");
      localStorage.removeItem("username");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo + Title */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">
                LBS
              </span>
            </div>
            <div>
              <h1 className="text-lg font-semibold">
                Education Management System
              </h1>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search students, courses..."
              className="pl-9 w-64"
            />
          </div>

          {/* Theme + Notifications */}
          <ThemeToggle />

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user ? `${user.role} Account` : "Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>
                {user ? user.username : "Unknown User"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
