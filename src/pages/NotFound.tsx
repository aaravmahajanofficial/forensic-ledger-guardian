import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft, Search, AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  const suggestedRoutes = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/cases", label: "Cases" },
    { path: "/evidence", label: "Evidence" },
    { path: "/help", label: "Help" },
    { path: "/route-test", label: "Route Testing" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            <AlertTriangle className="h-16 w-16 text-orange-500" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-2">
              The page "{location.pathname}" doesn't exist.
            </p>
            <p className="text-sm text-gray-500">
              You might have mistyped the URL or the page has been moved.
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={handleGoBack} className="w-full" variant="default">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>

            <Link to="/">
              <Button className="w-full" variant="outline">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Try one of these pages:
            </p>
            <div className="space-y-1">
              {suggestedRoutes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
