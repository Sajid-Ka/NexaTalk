import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/AuthContext";
import type { ReactNode } from "react";

export default function PublicRoute({ children }: {children : ReactNode}) {
  const { user, loading } = useAuth();

  if (loading) return null;


  if (user) {
    if(user.globalRole === "admin") {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}