import { createContext } from "react";
import { UserRole, UserStatus } from "../../../shared/constants/user.const";

export interface AuthUser {
    id: string;
    username: string;
    email: string;
    globalRole: UserRole;
    isBlocked: boolean;
    accountStatus: UserStatus;
    hasCompletedOnboarding: boolean;
    authProviders?: {
        password: boolean;
        google: boolean;
    };
}

export interface AuthContextType {
    accessToken: string | null;
    user: AuthUser | null;
    login: (data: { email: string; password: string }) => Promise<AuthUser>;
    googleLogin: (idToken: string) => Promise<AuthUser>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);