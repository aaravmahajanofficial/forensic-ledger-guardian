import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LogOut,
  User,
  Menu,
  Shield,
  Bell,
  Sparkles,
  HelpCircle,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES, ROLE_NAMES } from "@/constants";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// Role type and enum-like object for convenience
type Role = (typeof ROLES)[keyof typeof ROLES];
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isHomePage = location.pathname === "/";

  const scrollToSection = (sectionId: string) => {
    if (isHomePage) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case ROLES.COURT:
        return "bg-primary text-primary-foreground";
      case ROLES.OFFICER:
        return "bg-secondary text-secondary-foreground";
      case ROLES.FORENSIC:
        return "bg-accent text-accent-foreground";
      case ROLES.LAWYER:
        return "bg-warning text-warning-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <header className="bg-card border-b border-border h-16 sticky top-0 z-50 backdrop-blur-sm bg-card/95">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Enhanced Logo */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground">
                Forensic Ledger Guardian
              </span>
            </div>
          )}
        </div>

        {/* Navigation links for homepage */}
        {isHomePage && !isMobile && (
          <div className="hidden md:flex space-x-6 ml-auto mr-6">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => scrollToSection("features")}
            >
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => scrollToSection("how-it-works")}
            >
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => scrollToSection("security")}
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </Button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="hidden sm:flex relative">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-white">•</span>
              </span>
            </Button>

            {/* Role Badge - hide on very small screens */}
            <Badge
              className={`${
                user.role ? getRoleBadgeColor(user.role) : "bg-gray-500"
              } px-3 py-1 hidden xs:inline-flex rounded-full font-medium`}
            >
              {user.role ? ROLE_NAMES[user.role] : "Unknown"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2"
                >
                  <User className="h-4 w-4 text-accent" />
                  <span className="hidden sm:inline-block text-sm truncate max-w-[100px] md:max-w-none">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-primary rounded-md overflow-hidden">
                    <Shield className="h-3 w-3 text-primary-foreground" />
                  </div>
                  <span>User Profile</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/dashboard")}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => navigate("/settings")}
                >
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="text-xs sm:text-sm"
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
