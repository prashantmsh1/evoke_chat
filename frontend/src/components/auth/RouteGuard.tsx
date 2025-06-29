import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useRole } from "@/hooks/useRole";

interface RouteGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    requiredRole?: string | string[];
    requireAuth?: boolean;
}

const RouteGuard: React.FC<RouteGuardProps> = ({
    children,
    fallback = null,
    requiredRole,
    requireAuth = false,
}) => {
    const { isAuthenticated } = useAuth();
    const { hasRole } = useRole();

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
        return <>{fallback}</>;
    }

    // Check role requirement
    if (requiredRole && !hasRole(requiredRole)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default RouteGuard;
