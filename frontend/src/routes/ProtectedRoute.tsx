import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";
import type { ReactNode } from "react";
import { UserRole, UserStatus } from "../shared/constants/user.const";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.isBlocked || user.accountStatus === UserStatus.BLOCKED || user.accountStatus === UserStatus.DELETED) {
    return <Navigate to="/login" replace />;
  }

  if (user.globalRole === UserRole.ADMIN || user.globalRole === UserRole.SUPER_ADMIN) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}