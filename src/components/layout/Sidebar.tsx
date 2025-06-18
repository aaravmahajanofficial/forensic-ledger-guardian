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

// Role type and enum-like object for convenience
type Role = (typeof ROLES)[keyof typeof ROLES];
const Role = ROLES;
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
      case Role.Court:
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
      case Role.Officer:
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
      case Role.Forensic:
        // Removed the duplicate Upload button from Role Specific links
        return [];
      case Role.Lawyer:
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
    if (user?.role === Role.Lawyer) {
      baseLinks.push({
        to: "/evidence",
        label: "Evidence",
        icon: <FileDigit size={18} />,
      });
      return baseLinks;
    }

    // Don't show Evidence link for Court role
    if (user?.role !== Role.Court) {
      baseLinks.push({
        to: "/evidence",
        label: "Evidence",
        icon: <FileDigit size={18} />,
      });
    }

    // Don't show Upload and Verify for Court role
    if (user?.role !== Role.Court) {
      // Add Upload button for Forensic role
      if (user?.role === Role.Forensic || user?.role === Role.Officer) {
        baseLinks.push({
          to: "/upload",
          label: "Upload",
          icon: <Upload size={18} />,
        });
      }

      // Keep Verify for Officer role and others except Court and Forensic
      if (user?.role !== Role.Forensic) {
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
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-full bg-white shadow-xl transition-all duration-300 transform",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "w-64"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 font-bold text-lg">ForensicChain</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft size={20} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {user && (
                <div className="mb-4 p-2 bg-forensic-50 rounded-lg">
                  <p className="text-sm font-medium">{user.name}</p>
                  <Badge className="mt-1">
                    {user.roleTitle || "Unknown Role"}
                  </Badge>
                </div>
              )}

              <div className="mb-6">
                <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
                  Core
                </p>
                <nav className="space-y-1">
                  {getCoreLinks().map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 text-sm rounded-md w-full",
                          isActive
                            ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                            : "text-gray-700 hover:bg-gray-100"
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
                  <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
                    Role Specific
                  </p>
                  <nav className="space-y-1">
                    {roleBasedLinks().map((link) => (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center px-3 py-2 text-sm rounded-md w-full",
                            isActive
                              ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                              : "text-gray-700 hover:bg-gray-100"
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
                <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
                  Utilities
                </p>
                <nav className="space-y-1">
                  {utilityLinks.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 text-sm rounded-md w-full",
                          isActive
                            ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                            : "text-gray-700 hover:bg-gray-100"
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
        "h-screen bg-white border-r border-forensic-200 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {!collapsed && (
            <div className="flex items-center">
              <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-forensic-accent to-forensic-evidence rounded-md overflow-hidden">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <span className="ml-2 font-bold text-lg">ForensicChain</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapsed}
            className="p-1 h-8 w-8 ml-auto"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {user && !collapsed && (
            <div className="mb-4 p-2 bg-forensic-50 rounded-lg">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <Badge className="mt-1">{user.roleTitle || "Unknown Role"}</Badge>
            </div>
          )}

          <div className="mb-6">
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
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
                      "flex items-center rounded-md w-full",
                      collapsed ? "justify-center p-2" : "px-3 py-2",
                      isActive
                        ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                >
                  <span className={cn(!collapsed && "mr-3")}>{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
                </NavLink>
              ))}
            </nav>
          </div>

          {user && roleBasedLinks().length > 0 && (
            <div className="mb-6">
              {!collapsed && (
                <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
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
                        "flex items-center rounded-md w-full",
                        collapsed ? "justify-center p-2" : "px-3 py-2",
                        isActive
                          ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                          : "text-gray-700 hover:bg-gray-100"
                      )
                    }
                  >
                    <span className={cn(!collapsed && "mr-3")}>
                      {link.icon}
                    </span>
                    {!collapsed && <span>{link.label}</span>}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}

          <div>
            {!collapsed && (
              <p className="px-3 text-xs font-medium text-gray-500 uppercase mb-2">
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
                      "flex items-center rounded-md w-full",
                      collapsed ? "justify-center p-2" : "px-3 py-2",
                      isActive
                        ? "bg-forensic-accent/10 text-forensic-accent font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                >
                  <span className={cn(!collapsed && "mr-3")}>{link.icon}</span>
                  {!collapsed && <span>{link.label}</span>}
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
