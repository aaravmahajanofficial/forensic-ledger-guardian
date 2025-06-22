import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { logError } from "@/utils/logger";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    logError("404 Error: User attempted to access non-existent route", {
      pathname: location.pathname,
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4 bg-card shadow-2xl shadow-primary/10">
        <CardHeader className="text-center">
          <div className="mx-auto bg-destructive/10 rounded-full p-4 w-fit">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive mt-4">
            404 - Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Sorry, the page you are looking for does not exist or has been moved.
          </p>
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
