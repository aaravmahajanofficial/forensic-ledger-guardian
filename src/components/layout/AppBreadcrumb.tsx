import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

const AppBreadcrumb = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Route name mapping for better display
  const routeNames: Record<string, string> = {
    dashboard: "Dashboard",
    cases: "Cases",
    evidence: "Evidence",
    upload: "Upload",
    verify: "Verify",
    help: "Help",
    settings: "Settings",
    activity: "Activity",
    fir: "FIR Management",
    users: "Users",
    court: "Court",
    officer: "Officer",
    forensic: "Forensic",
    lawyer: "Lawyer",
    manage: "Manage",
    add: "Add User",
    roles: "Role Management",
    reports: "Reports",
    create: "Create",
    approval: "Approval",
    update: "Update",
    assigned: "Assigned",
    confirm: "Confirm",
    analysis: "Analysis",
    legal: "Legal",
    documentation: "Documentation",
    custody: "Chain of Custody",
    prepare: "Court Preparation",
    clients: "Client Management",
    meetings: "Meetings",
    faq: "FAQ",
    new: "New",
    security: "Security",
    "route-test": "Route Testing",
  };

  if (pathnames.length === 0) {
    return null; // Don't show breadcrumbs on home page
  }

  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName =
            routeNames[name] || name.charAt(0).toUpperCase() + name.slice(1);

          return (
            <React.Fragment key={name}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{displayName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link to={routeTo}>{displayName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
