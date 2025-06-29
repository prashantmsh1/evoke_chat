import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRole?: string | string[];
    fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requiredRole,
    fallbackPath = "/login",
}) => {
    const { isAuthenticated, isLoading } = useAuth();

    const user = useSelector((state: any) => state.auth.user);
    const location = useLocation();

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                    <p className="text-gray-600">Verifying authentication...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, redirect to login with return URL
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if requiredRole is specified
    if (requiredRole && user) {
        const userRoles = user?.auth; // This is an array of strings

        // Check if user has any of the required roles
        const hasRequiredRole = (() => {
            if (!userRoles || !Array.isArray(userRoles)) {
                return false;
            }

            if (Array.isArray(requiredRole)) {
                // Check if user has any of the required roles
                return requiredRole.some((role) =>
                    userRoles.some((userRole) => userRole.toLowerCase() === role.toLowerCase())
                );
            } else {
                // Check if user has the single required role
                return userRoles.some(
                    (userRole) => userRole.toLowerCase() === requiredRole.toLowerCase()
                );
            }
        })();

        // If user doesn't have required role, show access denied or redirect to fallback
        if (!hasRequiredRole) {
            // If fallbackPath is home ("/"), redirect there
            if (fallbackPath === "/") {
                return <Navigate to="/" replace />;
            }

            // Otherwise show access denied page
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-md w-full space-y-6">
                        <Alert variant="destructive">
                            <AlertDescription className="text-center">
                                <h3 className="font-semibold mb-2">Access Denied</h3>
                                <p className="mb-3">
                                    You don't have permission to access this page.
                                </p>
                                <div className="text-sm space-y-1">
                                    <p>
                                        <span className="font-medium">Required role:</span>{" "}
                                        {Array.isArray(requiredRole)
                                            ? requiredRole.join(", ")
                                            : requiredRole}
                                    </p>
                                    <p>
                                        <span className="font-medium">Your roles:</span>{" "}
                                        {userRoles && Array.isArray(userRoles)
                                            ? userRoles.join(", ")
                                            : "Unknown"}
                                    </p>
                                </div>
                            </AlertDescription>
                        </Alert>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={() => window.history.back()}
                                variant="outline"
                                className="flex-1 sm:flex-none">
                                Go Back
                            </Button>
                            <Button
                                onClick={() => (window.location.href = "/")}
                                className="flex-1 sm:flex-none bg-black hover:bg-gray-800">
                                Go to Homepage
                            </Button>
                        </div>

                        <div className="text-center">
                            <p className="text-sm text-gray-600">
                                Need access? Contact your administrator.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // User is authenticated and has required role (if specified)
    return <>{children}</>;
};

export default ProtectedRoute;
