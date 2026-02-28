import { Routes,Route } from "react-router-dom";
import LandingPage from "../features/landing/pages/LandingPage";
import LoginPage from "../features/auth/pages/LoginPage";
import SignupPage from "../features/auth/pages/SignupPage";
import ProtectedRoute from "../routes/ProtectedRoute";
import PublicRoute from "../shared/router/TemperyRoute";

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
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <div>Dashboard</div>
                    </ProtectedRoute>
                }
            />
        </Routes>
    )
}