/// <reference types="vite/client" />

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Search, User, Menu } from "lucide-react";
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

interface UserState {
  username: string;
  isAdmin: boolean;
}

export function DashboardHeader({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserState | null>(null);

  useEffect(() => {
    const access = localStorage.getItem("access");
    const username = localStorage.getItem("username");
    const isAdminRaw = localStorage.getItem("is_admin");

    if (!access || !username || isAdminRaw === null) {
      localStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    setUser({
      username,
      isAdmin: isAdminRaw === "true",
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  if (!user) return null;

  return (
    <header className="border-b bg-card/50 backdrop-blur px-4 py-2 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Sidebar Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/image.png"
            alt="EMS Logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-semibold text-lg">EMS</span>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 ml-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search…" className="w-64" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user.username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
