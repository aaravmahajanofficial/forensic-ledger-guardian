import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  FolderClosed,
  FileDigit,
  Upload,
  CheckCircle,
  HelpCircle,
  Settings,
  BarChart3,
  Users,
  Activity,
  FileText,
  AlignLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/constants";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Sidebar = ({ collapsed, toggleCollapsed }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(!isMobile);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsOpen(false);
    }
  }, [location.pathname, isMobile]);

  const roleBasedLinks = () => {
    switch (user?.role) {
      case ROLES.COURT:
        return [
          {
            to: "/users/roles",
            label: "Role Management",
            icon: <Users size={18} />,
          },
          {
            to: "/settings/security",
            label: "System Configuration",
            icon: <Settings size={18} />,
          },
          {
            to: "/activity",
            label: "Audit Logs",
            icon: <Activity size={18} />,
          },
          {
            to: "/reports",
            label: "Reports & Analytics",
            icon: <BarChart3 size={18} />,
          },
        ];
      case ROLES.OFFICER:
        return [
          {
            to: "/fir",
            label: "FIR Management",
            icon: <AlignLeft size={18} />,
          },
          {
            to: "/cases/update",
            label: "Update Cases",
            icon: <FileText size={18} />,
          },
          {
            to: "/evidence/confirm",
            label: "Confirm Evidence",
            icon: <CheckCircle size={18} />,
          },
          {
            to: "/officer/reports",
            label: "Reports",
            icon: <BarChart3 size={18} />,
          },
        ];
      case ROLES.FORENSIC:
        // Removed the duplicate Upload button from Role Specific links
        return [];
      case ROLES.LAWYER:
        return [];
      default:
        return [];
    }
  };

  // Core links shown to roles with adjustments based on requirements
  const getCoreLinks = () => {
    const baseLinks = [
      { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
      { to: "/cases", label: "Cases", icon: <FolderClosed size={18} /> },
    ];

    // For Lawyer (Defense Attorney) role - only show Cases and Evidence
    if (user?.role === ROLES.LAWYER) {
      baseLinks.push({
        to: "/evidence",
        label: "Evidence",
        icon: <FileDigit size={18} />,
      });
      return baseLinks;
    }

    // Don't show Evidence link for Court role
    if (user?.role !== ROLES.COURT) {
      baseLinks.push({
        to: "/evidence",
        label: "Evidence",
        icon: <FileDigit size={18} />,
      });
    }

    // Don't show Upload and Verify for Court role
    if (user?.role !== ROLES.COURT) {
      // Add Upload button for Forensic role
      if (user?.role === ROLES.FORENSIC || user?.role === ROLES.OFFICER) {
        baseLinks.push({
          to: "/upload",
          label: "Upload",
          icon: <Upload size={18} />,
        });
      }

      // Keep Verify for Officer role and others except Court and Forensic
      if (user?.role !== ROLES.FORENSIC) {
        baseLinks.push({
          to: "/verify",
          label: "Verify",
          icon: <CheckCircle size={18} />,
        });
      }
    }

    return baseLinks;
  };

  // Utility links shown at the bottom to all roles
  const utilityLinks = [
    { to: "/help", label: "Help", icon: <HelpCircle size={18} /> },
    { to: "/settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  // Check if sidebar should be rendered as mobile modal
  if (isMobile) {
    return (
      <>
        {/* Mobile overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full bg-card shadow-2xl transition-all duration-300 transform border-r border-border",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "w-64"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-lg text-foreground">Forensic Ledger Guardian</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {user && (
                <div className="mb-4 p-3 bg-muted/50 rounded-xl">
                  <p className="text-sm font-medium text-foreground">{user.name}</p>
                  <Badge className="mt-2 bg-accent text-accent-foreground">{user.roleTitle || "Unknown Role"}</Badge>
                </div>
              )}

              <div className="mb-6">
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                  Core
                </p>
                <nav className="space-y-1">
                  {getCoreLinks().map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2.5 text-sm rounded-lg w-full transition-all duration-200",
                          isActive
                            ? "bg-primary/10 text-primary font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                        )
                      }
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>

              {user && roleBasedLinks().length > 0 && (
                <div className="mb-6">
                  <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                    Role Specific
                  </p>
                  <nav className="space-y-1">
                    {roleBasedLinks().map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2.5 text-sm rounded-lg w-full transition-all duration-200",
                            isActive
                              ? "bg-secondary/10 text-secondary font-medium shadow-sm"
                              : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                          )
                        }
                        onClick={() => isMobile && setIsOpen(false)}
                      >
                        <span className="mr-3">{link.icon}</span>
                        <span>{link.label}</span>
                      </NavLink>
                    ))}
                  </nav>
                </div>
              )}

              <div>
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                  Utilities
                </p>
                <nav className="space-y-1">
                  {utilityLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2.5 text-sm rounded-lg w-full transition-all duration-200",
                          isActive
                            ? "bg-accent/10 text-accent font-medium shadow-sm"
                            : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                        )
                      }
                      onClick={() => isMobile && setIsOpen(false)}
                    >
                      <span className="mr-3">{link.icon}</span>
                      <span>{link.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "h-screen bg-card border-r border-border transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground">Forensic Ledger Guardian</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapsed}
            className="shrink-0"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          {user && !collapsed && (
            <div className="mb-4 p-3 bg-muted/50 rounded-xl">
              <p className="text-sm font-medium truncate text-foreground">{user.name}</p>
              <Badge className="mt-2 bg-accent text-accent-foreground">{user.roleTitle || "Unknown Role"}</Badge>
            </div>
          )}

          <div className="mb-6">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                Core
              </p>
            )}
            <nav className="space-y-1">
              {getCoreLinks().map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg w-full transition-all duration-200 hover:scale-[1.02]",
                      collapsed ? "justify-center p-3" : "px-3 py-2.5",
                      isActive
                        ? "bg-primary/10 text-primary font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    )
                  }
                >
                  <span className={cn(!collapsed && "mr-3")}>{link.icon}</span>
                  {!collapsed && <span className="text-sm">{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {user && roleBasedLinks().length > 0 && (
            <div className="mb-6">
              {!collapsed && (
                <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                  Role Specific
                </p>
              )}
              <nav className="space-y-1">
                {roleBasedLinks().map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    title={collapsed ? link.label : undefined}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-lg w-full transition-all duration-200 hover:scale-[1.02]",
                        collapsed ? "justify-center p-3" : "px-3 py-2.5",
                        isActive
                          ? "bg-secondary/10 text-secondary font-medium shadow-sm"
                          : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                      )
                    }
                  >
                    <span className={cn(!collapsed && "mr-3")}>
                      {link.icon}
                    </span>
                    {!collapsed && <span className="text-sm">{link.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          <div>
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-muted-foreground uppercase mb-3 tracking-wider">
                Utilities
              </p>
            )}
            <nav className="space-y-1">
              {utilityLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  title={collapsed ? link.label : undefined}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center rounded-lg w-full transition-all duration-200 hover:scale-[1.02]",
                      collapsed ? "justify-center p-3" : "px-3 py-2.5",
                      isActive
                        ? "bg-accent/10 text-accent font-medium shadow-sm"
                        : "text-muted-foreground hover:bg-accent/10 hover:text-foreground"
                    )
                  }
                >
                  <span className={cn(!collapsed && "mr-3")}>{link.icon}</span>
                  {!collapsed && <span className="text-sm">{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
