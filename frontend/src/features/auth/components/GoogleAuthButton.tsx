import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { UserRole } from "../../../shared/constants/user.const";
import toast from "react-hot-toast";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

interface GoogleAuthButtonProps {
    actionText: string;
}

export default function GoogleAuthButton({ actionText }: GoogleAuthButtonProps) {
    const { googleLogin } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const login = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            if (!tokenResponse.access_token) return;

            const toastId = toast.loading("Verifying with Google...");
            setIsLoading(true);

            try {
                // Pass the access_token to the backend as idToken (the backend handles both now)
                const user = await googleLogin(tokenResponse.access_token);

                toast.success("Successfully logged in with Google", { id: toastId });

                if(user?.globalRole === UserRole.ADMIN) navigate("/admin", {replace : true})
                else navigate("/home", {replace : true})

            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.error?.message || error.response?.data?.message || "Google authentication failed";
                    toast.error(message, { id: toastId });
                } else {
                    toast.error("An error occurred during Google login", { id: toastId });
                }
            } finally {
                setIsLoading(false);
            }
        },
        onError: () => {
            toast.error("Google Login Failed");
        }
    });

    return (
        <button
            type="button"
            onClick={() => login()}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-3 font-medium transition-all my-4"
        >
            <FcGoogle size={24} />
            {isLoading ? "Please wait..." : actionText}
        </button>
    );
}
