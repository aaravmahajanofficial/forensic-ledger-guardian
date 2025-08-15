import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation, ExternalLink } from "lucide-react";
import RoutingStatus from "@/components/shared/RoutingStatus";

const RouteTestPage = () => {
  const navigate = useNavigate();

  const testRoutes = [
    { path: "/dashboard", label: "Main Dashboard" },
    { path: "/dashboard/court", label: "Court Dashboard" },
    { path: "/dashboard/officer", label: "Officer Dashboard" },
    { path: "/dashboard/forensic", label: "Forensic Dashboard" },
    { path: "/dashboard/lawyer", label: "Lawyer Dashboard" },
    { path: "/cases", label: "Cases" },
    { path: "/evidence", label: "Evidence" },
    { path: "/upload", label: "Upload" },
    { path: "/verify", label: "Verify" },
    { path: "/help", label: "Help" },
    { path: "/settings", label: "Settings" },
    { path: "/activity", label: "Activity" },
    { path: "/fir", label: "FIR" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <RoutingStatus />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Route Testing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Test navigation to different routes in the application:
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {testRoutes.map((route) => (
              <div key={route.path} className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full h-auto p-3 text-left justify-start"
                  onClick={() => handleNavigation(route.path)}
                >
                  <div>
                    <div className="font-medium">{route.label}</div>
                    <div className="text-xs text-gray-500">{route.path}</div>
                  </div>
                </Button>
                <Link
                  to={route.path}
                  className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <ExternalLink className="h-3 w-3" />
                  Direct Link
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Testing Instructions:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Click buttons to test programmatic navigation</li>
              <li>• Click "Direct Link" to test Link component navigation</li>
              <li>• Check browser back/forward buttons work</li>
              <li>• Verify URL changes correctly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RouteTestPage;
