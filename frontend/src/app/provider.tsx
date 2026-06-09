import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "../features/auth/context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";

export default function Providers({ children }: { children: React.ReactNode }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={clientId}>
                <AuthProvider>{children}</AuthProvider>
            </GoogleOAuthProvider>
        </Provider>
    );
}