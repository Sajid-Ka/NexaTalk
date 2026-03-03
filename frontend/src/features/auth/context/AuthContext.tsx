import { createContext, useContext, useState, useEffect } from "react";
import { loginApi,logoutApi,refreshApi } from "../api/authApi";
import { 
    setAccessToken as setAxiosToken,
    setRefreshHandler,
} from "../../../shared/api/interceptors";

interface AuthContextType {
    accessToken : string | null;
    user : any | null;
    login : (data : {email : string; password : string}) => Promise<void>;
    logout : () => Promise<void>;
    isAuthenticated : boolean;
    loading : boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [accessToken,setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setAxiosToken(accessToken);
    },[accessToken]);

    const refresh = async () : Promise<string | null> => {
        try {
            const res = await refreshApi();
            const newToken = res.data.data.accessToken;
            setAccessToken(newToken);
            return newToken;
        } catch {
            setAccessToken(null);
            return null;
        }
    }

    useEffect(() => {
        setRefreshHandler(refresh);
    },[]);

    const login = async (data : {
        email : string;
        password : string;
    }) => {
        const res = await loginApi(data);

        const {accessToken,user} = res.data.data;

        setAccessToken(accessToken);
        setUser(user);
    }

    const logout = async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.error("Logout Api failed :",error);
        } finally {
            setAccessToken(null);
            setUser(null);
        }
    }

    useEffect(() => {
        const publicAuthPages = [
            "/login",
            "/signup",
            "/forgot-password",
            "/reset-password",
            "/verify-email",
            "/check-email",
        ];

        const currentPath = window.location.pathname;

        if(publicAuthPages.includes(currentPath)){
            setLoading(false);
            return
        }

        const init = async () => {
            const token = await refresh();
            if(!token) {
                setUser(null);
            }
            setLoading(false);
        };
        init();
    },[]);

    return(
        <AuthContext.Provider 
            value={{
                accessToken,
                user,
                login,
                logout,
                isAuthenticated : !!accessToken,
                loading,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("AuthProvider missing");
    return context
}