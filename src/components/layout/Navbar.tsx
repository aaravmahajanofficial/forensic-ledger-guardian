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
import { ROLES } from "@/constants";

// Role type and enum-like object for convenience
type Role = (typeof ROLES)[keyof typeof ROLES];
const Role = ROLES;
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
      case Role.Court:
        return "bg-forensic-court text-white";
      case Role.Officer:
        return "bg-forensic-800 text-white";
      case Role.Forensic:
        return "bg-forensic-accent text-white";
      case Role.Lawyer:
        return "bg-forensic-warning text-forensic-900";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <header className="bg-white border-b border-forensic-200 h-14 md:h-16">
      <div className="h-full px-2 sm:px-4 flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="mr-1 sm:mr-2"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Show logo on mobile */}
          {isMobile && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="ml-1 font-semibold text-sm md:text-base">
                ForensicChain
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
              className="flex items-center gap-1 text-forensic-600 hover:text-forensic-accent"
              onClick={() => scrollToSection("features")}
            >
              <Sparkles className="h-4 w-4" />
              <span>Features</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-forensic-600 hover:text-forensic-accent"
              onClick={() => scrollToSection("how-it-works")}
            >
              <HelpCircle className="h-4 w-4" />
              <span>How It Works</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-forensic-600 hover:text-forensic-accent"
              onClick={() => scrollToSection("security")}
            >
              <Lock className="h-4 w-4" />
              <span>Security</span>
            </Button>
          </div>
        )}

        {user ? (
          <div className="flex items-center gap-1 sm:gap-4">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Bell className="h-4 w-4 text-forensic-500" />
            </Button>

            {/* Role Badge - hide on very small screens */}
            <Badge
              className={`${
                user.role ? getRoleBadgeColor(user.role) : "bg-gray-500"
              } px-2 py-1 hidden xs:inline-flex`}
            >
              {user.roleTitle || "Unknown"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 sm:gap-2 p-1 sm:p-2"
                >
                  <User className="h-4 w-4 text-forensic-accent" />
                  <span className="hidden sm:inline-block text-sm truncate max-w-[100px] md:max-w-none">
                    {user.name}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
                    <Shield className="h-3 w-3 text-white" />
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
                  className="text-forensic-danger cursor-pointer"
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
