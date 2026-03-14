import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import type { ReactNode } from "react";

export default function AdminRoute({children} : {children : ReactNode}) {
    const {user, loading} = useAuth();

    if(loading) return null;

    if(!user) return <Navigate to="/login" replace />;

    if (user.isBlocked || user.accountStatus === "blocked" || user.accountStatus === "deleted") {
      return <Navigate to="/login?blocked=true" replace />;
    }

    if(user.globalRole !== "admin" && user.globalRole !== "super_admin") {
      return <Navigate to="/home" replace />
    }

    return <>{children}</>;
}