import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Shield,
  Users,
  FileText,
  Upload,
  Search,
  Settings,
  HelpCircle,
  Activity,
  BarChart3,
  Scale,
  FileLock2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Role } from "@/services/web3Service";

const RoutingStatus = () => {
  const { user } = useAuth();

  type RouteInfo = {
    path: string;
    label: string;
    icon: React.ReactNode;
  };

  const routesByRole: Record<Role, RouteInfo[]> = {
    [Role.Court]: [
      {
        path: "/dashboard/court",
        label: "Court Dashboard",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        path: "/users/roles",
        label: "Role Management",
        icon: <Users className="h-4 w-4" />,
      },
      {
        path: "/settings/security",
        label: "System Configuration",
        icon: <Settings className="h-4 w-4" />,
      },
      {
        path: "/activity",
        label: "Audit Logs",
        icon: <Activity className="h-4 w-4" />,
      },
      {
        path: "/reports",
        label: "Reports & Analytics",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
    [Role.Officer]: [
      {
        path: "/dashboard/officer",
        label: "Officer Dashboard",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        path: "/fir",
        label: "FIR Management",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        path: "/cases/update",
        label: "Update Cases",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        path: "/evidence/confirm",
        label: "Confirm Evidence",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        path: "/officer/reports",
        label: "Reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        path: "/upload",
        label: "Upload Evidence",
        icon: <Upload className="h-4 w-4" />,
      },
    ],
    [Role.Forensic]: [
      {
        path: "/dashboard/forensic",
        label: "Forensic Dashboard",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        path: "/upload",
        label: "Upload Evidence",
        icon: <Upload className="h-4 w-4" />,
      },
      {
        path: "/evidence/analysis",
        label: "Evidence Analysis",
        icon: <Search className="h-4 w-4" />,
      },
      {
        path: "/evidence/verify",
        label: "Technical Verification",
        icon: <CheckCircle className="h-4 w-4" />,
      },
      {
        path: "/forensic/reports",
        label: "Forensic Reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
    ],
    [Role.Lawyer]: [
      {
        path: "/dashboard/lawyer",
        label: "Lawyer Dashboard",
        icon: <Shield className="h-4 w-4" />,
      },
      {
        path: "/legal/documentation",
        label: "Legal Documentation",
        icon: <FileText className="h-4 w-4" />,
      },
      {
        path: "/verify/custody",
        label: "Chain of Custody",
        icon: <FileLock2 className="h-4 w-4" />,
      },
      {
        path: "/legal/reports",
        label: "Legal Reports",
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        path: "/cases/prepare",
        label: "Court Preparation",
        icon: <Scale className="h-4 w-4" />,
      },
      {
        path: "/clients",
        label: "Client Management",
        icon: <Users className="h-4 w-4" />,
      },
    ],
    [Role.None]: [],
  };

  const commonRoutes = [
    {
      path: "/dashboard",
      label: "Main Dashboard",
      icon: <Shield className="h-4 w-4" />,
    },
    { path: "/cases", label: "Cases", icon: <FileText className="h-4 w-4" /> },
    {
      path: "/evidence",
      label: "Evidence",
      icon: <FileLock2 className="h-4 w-4" />,
    },
    {
      path: "/verify",
      label: "Verify",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    { path: "/help", label: "Help", icon: <HelpCircle className="h-4 w-4" /> },
    {
      path: "/settings",
      label: "Settings",
      icon: <Settings className="h-4 w-4" />,
    },
  ];

  const getRoleRoutes = () => {
    if (!user) return [];
    return routesByRole[user.role] || [];
  };

  const allAvailableRoutes = [...commonRoutes, ...getRoleRoutes()];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Navigation Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Current Role:</span>
            <Badge variant={user ? "default" : "secondary"}>
              {user?.roleTitle || "Not Logged In"}
            </Badge>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Available Routes:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {allAvailableRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 transition-colors"
                >
                  {route.icon}
                  <span className="text-sm">{route.label}</span>
                  <ArrowRight className="h-3 w-3 ml-auto text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {!user && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Please log in to access role-specific routes.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RoutingStatus;
