import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import type { ReactNode } from "react";

export default function AdminRoute({children} : {children : ReactNode}) {
    const {user, loading} = useAuth();

    if(loading) return null;

    if(!user) return <Navigate to="/login" replace />;

    if(user.globalRole !== "admin") return <Navigate to="/home" replace />

    return <>{children}</>;
}