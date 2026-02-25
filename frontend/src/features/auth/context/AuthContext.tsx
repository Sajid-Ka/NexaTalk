import { createContext, useContext, useState, } from "react";

interface AuthState {
    accessToken : string | null;
    setAccessToken : (token : string | null) => void;
}

const AuthContext = createContext<AuthState | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {
    const [accessToken,setAccessToken] = useState<string | null>(null);

    return(
        <AuthContext.Provider value={{accessToken,setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context) throw new Error("AuthContext missing");
    return context
}