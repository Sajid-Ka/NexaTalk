import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import HomePage from "../features/home/pages/HomePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../routes/PublicRoute";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import CheckEmailPage from "../features/auth/pages/CheckEmailPage";
import ForgotPasswordPage from "../features/auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";
import AdminDashboardPage from "../features/admin/dashboard/pages/AdminDashboardPage";
import UserManagementPage from "../features/admin/users/pages/UserManagementPage";
import AdminRoute from "../routes/AdminRoute";
import NotFoundPage from "../shared/pages/NotFoundPage";
import OnboardingPage from "../features/onboarding/pages/OnboardingPage";
import ServerLayout from "../features/servers/layouts/ServerLayout";
import ServerDashboard from "../features/servers/pages/ServerDashboard";
import { AppRoute } from "../shared/constants/app-route.const";
import { Navigate } from "react-router-dom";
import OverviewSettingsPage from "../features/servers/pages/settings/OverviewSettingsPage";
import ServerSettingsLayout from "../features/servers/pages/settings/ServerSettingsLayout";
import MembersSettingsPage from "../features/servers/pages/settings/MembersSettingsPage";
import InvitesSettingsPage from "../features/servers/pages/settings/InvitesSettingsPage";
import AuditLogsPage from "../features/servers/pages/settings/AuditLogsSettingsPage";
import BansSettingsPage from "../features/servers/pages/settings/BansSettingsPage";
import DangerZonePage from "../features/servers/pages/settings/DangerZonePage";

export default function AppRouter() {
    return (
        <Routes>
            <Route
                path={AppRoute.HOME}
                element={
                    <PublicRoute>
                        <LandingPage />
                    </PublicRoute>
                }
            />
            <Route
                path={AppRoute.SIGNUP}
                element={
                    <PublicRoute>
                        <SignupPage />
                    </PublicRoute>
                }
            />
            <Route
                path={AppRoute.LOGIN}
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path={AppRoute.HOME_PAGE}
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={AppRoute.ONBOARDING}
                element={
                    <ProtectedRoute>
                        <OnboardingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={AppRoute.SETTINGS}
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path={AppRoute.VERIFY_EMAIL}
                element={
                    <PublicRoute>
                        <VerifyEmailPage />
                    </PublicRoute>
                }
            />
            <Route
                path={AppRoute.CHECK_EMAIL}
                element={
                    <PublicRoute>
                        <CheckEmailPage />
                    </PublicRoute>
                }
            />

            <Route
                path={AppRoute.FORGOT_PASSWORD}
                element={
                    <PublicRoute>
                        <ForgotPasswordPage />
                    </PublicRoute>
                }
            />

            <Route
                path={AppRoute.RESET_PASSWORD}
                element={
                    <PublicRoute>
                        <ResetPasswordPage />
                    </PublicRoute>
                }
            />

            <Route
                path={AppRoute.ADMIN}
                element={
                    <AdminRoute>
                        <AdminDashboardPage />
                    </AdminRoute>
                }
            />
            <Route
                path={AppRoute.ADMIN_USERS}
                element={
                    <AdminRoute>
                        <UserManagementPage />
                    </AdminRoute>
                }
            />

            {/* Server Routes */}
            <Route
                path={AppRoute.SERVERS}
                element={
                    <ProtectedRoute>
                        <ServerLayout />
                    </ProtectedRoute>
                }
            >
                <Route path=":serverId" element={<ServerDashboard />} />

                <Route
                    path=":serverId/settings"
                    element={<ServerSettingsLayout />}
                >
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<OverviewSettingsPage />} />
                    <Route path="members" element={<MembersSettingsPage />} />
                    <Route path="invites" element={<InvitesSettingsPage />} />
                    <Route path="audit-logs" element={<AuditLogsPage />} />
                    <Route path="bans" element={<BansSettingsPage />} />
                    <Route path="danger" element={<DangerZonePage />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFoundPage />} />
        </Routes>


    )
}