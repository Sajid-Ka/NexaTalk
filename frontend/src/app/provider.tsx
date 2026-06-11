import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "../features/auth/context/AuthProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Providers({ children }: { children: React.ReactNode }) {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

    return (
        <Provider store={store}>
            <GoogleOAuthProvider clientId={clientId}>
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>{children}</AuthProvider>
                </QueryClientProvider>
            </GoogleOAuthProvider>
        </Provider>
    );
}