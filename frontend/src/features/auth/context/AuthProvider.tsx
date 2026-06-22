import { useState, useEffect, useRef, useCallback } from "react";
import { checkStatusApi, loginApi, googleLoginApi, logoutApi, refreshApi } from "../api/authApi";
import {
    setAccessToken as setAxiosToken,
    setRefreshHandler,
} from "../../../shared/api/interceptors";
import type { AuthUser } from "./AuthContext";
import { AuthContext } from "./AuthContext";
import { AccountStatus } from "../../../shared/constants/user.const";
import axios from "axios";



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const updateUser = useCallback((data: Partial<AuthUser>) => {
        setUser((prev) => prev ? { ...prev, ...data } : null);
    }, []);

    const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

    useEffect(() => {
        setAxiosToken(accessToken);
    }, [accessToken]);

    useEffect(() => {
        const handleForceLogout = () => {
            setAccessToken(null);
            setUser(null);
            window.location.href = "/login?forceLogout=true";
        };

        window.addEventListener("force-logout", handleForceLogout);
        
        return () => {
            window.removeEventListener("force-logout", handleForceLogout);
        };
    }, []);

    const checkUserStatus = useCallback(async () => {
        if (!accessToken || !user) return;
        
        try {
            await checkStatusApi();
        } catch (error: unknown) {
            if(axios.isAxiosError(error)){
                if (error.response?.data?.error?.message?.includes("blocked or deleted")) {
                    setAccessToken(null);
                    setUser(null);
                    window.location.href = "/login?blocked=true";
                }
            }
        }
    }, [accessToken, user]);

    useEffect(() => {
        const interval = setInterval(() => {
            checkUserStatus();
        }, 30000); // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, [checkUserStatus]);

    const refresh = useCallback(async (): Promise<string | null> => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        refreshPromiseRef.current = refreshApi()
            .then((res) => {
                const payload = res.data.data;
                const token = payload.accessToken;
                const user = payload.user as AuthUser;

                if(user.isBlocked || user.accountStatus === AccountStatus.BLOCKED || user.accountStatus === AccountStatus.DELETED ) {
                    setAccessToken(null);
                    setUser(null);
                    return null;
                }

                setAccessToken(token);
                setUser(user);

                return token;
            })
            .catch((error) => {
                if(error.response?.data?.error?.message?.includes("blocked or deleted")) {
                    window.location.href = "/login?blocked=true";
                }
                setAccessToken(null);
                setUser(null);
                return null;
            })
            .finally(() => {
                refreshPromiseRef.current = null;
            });

        return refreshPromiseRef.current;
    }, []);

    useEffect(() => {
        setRefreshHandler(refresh);
    }, [refresh]);

    useEffect(() => {
        let cancelled = false;

        const init = async () => {
            try {
                await refresh();
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        init();

        return () => { cancelled = true };
    }, [refresh]);

    const login = async (data: { email: string; password: string }): Promise<AuthUser> => {
        const res = await loginApi(data);
        const payload = res.data.data;

        setAccessToken(payload.accessToken);
        setUser(payload.user as AuthUser);

        return payload.user as AuthUser;
    };

    const googleLogin = async (idToken: string): Promise<AuthUser> => {
        const res = await googleLoginApi({ idToken });
        const payload = res.data.data;

        setAccessToken(payload.accessToken);
        setUser(payload.user as AuthUser);

        return payload.user as AuthUser;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                user,
                login,
                googleLogin,
                logout,
                updateUser,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};