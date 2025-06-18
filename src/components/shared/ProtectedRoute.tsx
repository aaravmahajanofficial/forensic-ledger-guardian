/**
 * Route Protection Components
 * Handles authentication and authorization for protected routes
 */

import React, { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { APP_CONSTANTS, Role } from "@/config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Lock, ArrowLeft } from "lucide-react";
import { logSecurityEvent } from "@/utils/logger";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: Role;
  allowedRoles?: Role[];
  fallbackPath?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
  fallbackPath = "/",
}) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setHasCheckedAuth(true);
    }
  }, [isLoading]);

  // Show loading state while checking authentication
  if (isLoading || !hasCheckedAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    logSecurityEvent("Unauthenticated access attempt", {
      path: location.pathname,
      requiredRole,
      allowedRoles,
    });

    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check role-based access
  const hasRequiredRole = requiredRole ? user.role === requiredRole : true;
  const hasAllowedRole = allowedRoles ? allowedRoles.includes(user.role) : true;

  if (!hasRequiredRole && !hasAllowedRole) {
    logSecurityEvent("Unauthorized access attempt", {
      userId: user.id,
      userRole: user.role,
      path: location.pathname,
      requiredRole,
      allowedRoles,
    });

    return <UnauthorizedAccess />;
  }

  return <>{children}</>;
};

// Component for unauthorized access
const UnauthorizedAccess: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  const handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Lock className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page. Contact your
            administrator if you believe this is an error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Role-based protection shortcuts
export const CourtOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={APP_CONSTANTS.ROLES.COURT}>
    {children}
  </ProtectedRoute>
);

export const OfficerOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={APP_CONSTANTS.ROLES.OFFICER}>
    {children}
  </ProtectedRoute>
);

export const ForensicOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={APP_CONSTANTS.ROLES.FORENSIC}>
    {children}
  </ProtectedRoute>
);

export const LawyerOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute requiredRole={APP_CONSTANTS.ROLES.LAWYER}>
    {children}
  </ProtectedRoute>
);

// Multiple role protection
export const LawEnforcementRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute
    allowedRoles={[APP_CONSTANTS.ROLES.COURT, APP_CONSTANTS.ROLES.OFFICER]}
  >
    {children}
  </ProtectedRoute>
);

// This route has been removed as it's not used in the application

export const LegalRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute
    allowedRoles={[APP_CONSTANTS.ROLES.COURT, APP_CONSTANTS.ROLES.LAWYER]}
  >
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
