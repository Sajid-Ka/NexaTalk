import { AuthProvider } from "../features/auth/context/AuthProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>
}