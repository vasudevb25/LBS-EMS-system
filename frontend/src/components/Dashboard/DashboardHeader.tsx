/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User } from "lucide-react";
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
import { RecentActivity } from "./DashboardComponents";

import { apiFetch } from "../../lib/api";

interface UserState {
  username: string;
  isAdmin: boolean;
}

export function DashboardHeader() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserState | null>(null);

  // 🔐 Load auth state once
  useEffect(() => {
    const username = localStorage.getItem("username");
    const isAdminRaw = localStorage.getItem("is_admin");

    if (!username || isAdminRaw === null) {
      navigate("/login", { replace: true });
      return;
    }

    setUser({
      username,
      isAdmin: isAdminRaw === "true",
    });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await apiFetch(`/api/logout/`, {
        method: "POST",
      });
    } finally {
      localStorage.clear();
      navigate("/login", { replace: true });
    }
  };

  // ⛔ Don’t render junk while redirecting
  if (!user) return null;

  return (
    <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">
              LBS
            </span>
          </div>
          <h1 className="text-lg font-semibold">Education Management System</h1>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <RecentActivity />
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user.isAdmin ? "Admin Account" : "Centre Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem disabled>{user.username}</DropdownMenuItem>
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
