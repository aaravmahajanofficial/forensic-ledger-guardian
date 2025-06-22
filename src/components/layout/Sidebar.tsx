import React, { useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Home,
  FolderClosed,
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
import { motion as m, AnimatePresence } from "framer-motion";

interface NavLinkItem {
  to: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Sidebar = ({ collapsed, toggleCollapsed }: SidebarProps) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      // setIsOpen(false); // This logic might need to be re-evaluated based on desired mobile behavior
    }
  }, [location.pathname, isMobile]);

  const sidebarVariants = {
    expanded: { width: isMobile ? "80%" : 280 },
    collapsed: { width: 72 },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const navLinkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

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

  const commonLinks = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={18} /> },
    { to: "/cases", label: "Cases", icon: <FolderClosed size={18} /> },
  ];

  const renderNavLink = (link: NavLinkItem) => (
    <m.li key={link.to} variants={navLinkVariants}>
      <NavLink
        to={link.to}
        className={({ isActive }) =>
          cn(
            "flex items-center h-10 px-4 rounded-lg transition-colors duration-200",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
            { "bg-primary/10 text-primary font-semibold": isActive }
          )
        }
      >
        <div className="w-6 mr-4 flex items-center justify-center">
          {link.icon}
        </div>
        <AnimatePresence>
          {!collapsed && (
            <m.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="whitespace-nowrap"
            >
              {link.label}
            </m.span>
          )}
        </AnimatePresence>
      </NavLink>
    </m.li>
  );

  return (
    <m.aside
      variants={sidebarVariants}
      initial={false}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "relative flex flex-col h-full bg-card border-r border-border z-40",
        { "shadow-xl": !collapsed }
      )}
    >
      <div className="flex items-center justify-between p-4 h-16 border-b border-border">
        <AnimatePresence>
          {!collapsed && (
            <m.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="flex items-center gap-2"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-lg text-foreground whitespace-nowrap">
                Forensic Ledger Guardian
              </span>
            </m.div>
          )}
        </AnimatePresence>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className="absolute top-4 right-[-40px] bg-card border border-border rounded-full z-50 hidden md:flex"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-2">
        <m.ul variants={navItemVariants} initial="hidden" animate="visible">
          {commonLinks.map(renderNavLink)}
        </m.ul>

        {user && roleBasedLinks().length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <AnimatePresence>
              {!collapsed && (
                <m.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase"
                >
                  Role-Specific Actions
                </m.h3>
              )}
            </AnimatePresence>
            <m.ul variants={navItemVariants} initial="hidden" animate="visible">
              {roleBasedLinks().map(renderNavLink)}
            </m.ul>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <AnimatePresence>
          {!collapsed && (
            <m.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-4 rounded-lg bg-muted/50 text-center"
            >
              <p className="text-sm font-semibold text-foreground">
                Need Assistance?
              </p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">
                Check our help guides for support.
              </p>
              <Button size="sm" className="w-full">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help Center
              </Button>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.aside>
  );
};

export default Sidebar;
