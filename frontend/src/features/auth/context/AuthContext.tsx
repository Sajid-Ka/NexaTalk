import { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
import { loginApi, logoutApi, refreshApi } from "../api/authApi";
import {
    setAccessToken as setAxiosToken,
    setRefreshHandler,
} from "../../../shared/api/interceptors";

interface AuthUser {
    id: string;
    username: string;
    email: string;
    globalRole: "admin" | "user";
}

interface AuthContextType {
    accessToken: string | null;
    user: AuthUser | null;
    login: (data: { email: string; password: string }) => Promise<AuthUser>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshPromiseRef = useRef<Promise<string | null> | null>(null);

    useEffect(() => {
        setAxiosToken(accessToken);
    }, [accessToken]);

    const refresh = useCallback(async (): Promise<string | null> => {
        if (refreshPromiseRef.current) {
            return refreshPromiseRef.current;
        }

        refreshPromiseRef.current = refreshApi()
            .then((res) => {
                const payload = res.data.data;
                const token = payload.accessToken;
                const user = payload.user as AuthUser;

                setAccessToken(token);
                setUser(user);

                return token;
            })
            .catch(() => {
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
    }, []);

    const login = async (data: { email: string; password: string }): Promise<AuthUser> => {
        const res = await loginApi(data);
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
                logout,
                isAuthenticated: !!user,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("AuthProvider missing");
    return context;
};