import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/context/useAuth";
import type { ReactNode } from "react";
import { UserRole, AccountStatus } from "../shared/constants/user.const";
import { AppRoute } from "../shared/constants/app-route.const";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user) {
    return <Navigate to={AppRoute.LOGIN} replace />;
  }

  if (user.isBlocked || user.accountStatus === AccountStatus.BLOCKED || user.accountStatus === AccountStatus.DELETED) {
    return <Navigate to={AppRoute.LOGIN} replace />;
  }

  const isInterestsPage = window.location.pathname === AppRoute.ONBOARDING;

  // Redirect to onboarding if not completed
  if (!user.hasCompletedOnboarding && !isInterestsPage && (user.globalRole === UserRole.USER)) {
    return <Navigate to={AppRoute.ONBOARDING} replace />;
  }

  // Redirect away from onboarding if already completed
  if (user.hasCompletedOnboarding && isInterestsPage) {
    return <Navigate to={AppRoute.HOME_PAGE} replace />;
  }

  if (user.globalRole === UserRole.ADMIN) {
    // If admin is on a user protected route, redirect to admin dashboard
    if (!window.location.pathname.startsWith(AppRoute.ADMIN)) {
        return <Navigate to={AppRoute.ADMIN} replace />;
    }
  }

  return <>{children}</>;
}