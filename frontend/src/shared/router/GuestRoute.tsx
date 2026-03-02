import { Navigate } from "react-router-dom";
import { useAuth } from "../../features/auth/context/AuthContext";
import type { ReactNode } from "react";

export default function PublicRoute({ children }: {children : ReactNode}) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}