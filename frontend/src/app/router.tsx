import { Routes, Route } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import HomePage from "../features/home/pages/HomePage";
import SettingsPage from "../features/settings/pages/SettingsPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../shared/router/GuestRoute";
import VerifyEmailPage from "../features/auth/pages/VerifyEmailPage";
import CheckEmailPage from "../features/auth/pages/CheckEmailPage";

export default function AppRouter() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
                path="/signup"
                element={
                    <PublicRoute>
                        <SignupPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <LoginPage />
                    </PublicRoute>
                }
            />
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <HomePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />
            <Route 
                path="/verify-email" 
                element={
                    <ProtectedRoute>
                        <VerifyEmailPage />
                    </ProtectedRoute>
                } />
            <Route 
                path="/check-email" 
                element={
                    <ProtectedRoute>
                        <CheckEmailPage />
                    </ProtectedRoute>
                } />
        </Routes>
    )
}