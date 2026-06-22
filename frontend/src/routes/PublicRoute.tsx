import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";
import type { ReactNode } from "react";
import { UserRole } from "../shared/constants/user.const";

export default function PublicRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;


  if (user && !user.isBlocked && user.accountStatus !== "deleted") {
    if (user.globalRole === UserRole.ADMIN) {
      return <Navigate to="/admin" replace />
    }
    return <Navigate to="/home" replace />;
  }
  return <>{children}</>;
}