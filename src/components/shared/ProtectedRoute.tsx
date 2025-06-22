/**
 * Route Protection Components
 * Handles authentication and authorization for protected routes
 */

import React, { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES, type RoleType } from "@/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, ShieldAlert } from "lucide-react";
import { logSecurityEvent } from "@/utils/logger";
import LoadingSpinner from "./LoadingSpinner";

type Role = RoleType;

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

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner size="large" text="Verifying access credentials..." />
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center border-destructive/50 shadow-lg">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldAlert className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-destructive">
            Access Denied
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            You do not have the necessary permissions to access this page.
            Please contact your system administrator if you believe this is an
            error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleGoBack} variant="outline" className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button onClick={handleGoHome} className="flex-1">
              <Shield className="h-4 w-4 mr-2" />
              Go to Dashboard
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
}) => <ProtectedRoute requiredRole={ROLES.COURT}>{children}</ProtectedRoute>;

export const OfficerOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={ROLES.OFFICER}>{children}</ProtectedRoute>;

export const ForensicOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={ROLES.FORENSIC}>{children}</ProtectedRoute>;

export const LawyerOnlyRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => <ProtectedRoute requiredRole={ROLES.LAWYER}>{children}</ProtectedRoute>;

// Multiple role protection
export const LawEnforcementRoute: React.FC<{ children: ReactNode }> = ({
  children,
}) => (
  <ProtectedRoute allowedRoles={[ROLES.COURT, ROLES.OFFICER]}>
    {children}
  </ProtectedRoute>
);

export const LegalRoute: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ProtectedRoute allowedRoles={[ROLES.COURT, ROLES.LAWYER]}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
