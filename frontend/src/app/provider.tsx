import { Provider } from "react-redux";
import { store } from "./store";
import { AuthProvider } from "../features/auth/context/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <AuthProvider>{children}</AuthProvider>
        </Provider>
    );
}