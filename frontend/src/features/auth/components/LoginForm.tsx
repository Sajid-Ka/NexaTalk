import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../validators/loginSchema";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import LoginFields from "./LoginFields";
import { useAuth } from "../context/useAuth";
import { useState } from "react";
import { UserRole } from "../../../shared/constants/user.const";
import toast from "react-hot-toast";
import { resendVerificationEmailApi } from "../api/authApi";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);
    const [isResending, setIsResending] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        trigger,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setServerError(null);

            const user = await login(data);

            console.log("Logged in user", user);

            if(user?.globalRole === UserRole.ADMIN) navigate("/admin", {replace : true})
            else navigate("/home", {replace : true})

        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const code = error.response?.data?.error?.code;
                const message =
                    error.response?.data?.error?.message ||
                    error.response?.data?.message;

                if (code === "EMAIL_NOT_VERIFIED" || message === "Email is not verified") {
                    setServerError("Please verify your email before logging in.");
                    return;
                }

                if (code === "USER_BLOCKED") {
                    setServerError(message || "Your account is blocked. Please contact support.");
                    return;
                }

                setServerError(message || "Invalid email or password");
                return;
            }

            setServerError("Invalid email or password");
        }
    };

    const handleResendVerificationEmail = async () => {
        const isEmailValid = await trigger("email");
        if (!isEmailValid) {
            toast.error("Please enter a valid email address first.");
            return;
        }

        const toastId = toast.loading("Sending verification link...");

        try {
            setIsResending(true);

            const email = getValues("email");
            const response = await resendVerificationEmailApi(email);

            toast.success(
                response.data?.message || "Verification link resent. Please check your inbox.",
                { id: toastId }
            );
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error?.message ||
                    error.response?.data?.message ||
                    "Failed to resend verification link.",
                    { id: toastId }
                );
                return;
            }

            toast.error("Failed to resend verification link.", { id: toastId });
        } finally {
            setIsResending(false);
        }
    };

    return (
        <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <LoginFields register={register} errors={errors} />

                {serverError && (
                    <div className="mt-4 space-y-2">
                        <p className="text-red-500 text-sm">
                            {serverError}
                        </p>
                        {serverError === "Please verify your email before logging in." && (
                            <button
                                type="button"
                                onClick={handleResendVerificationEmail}
                                disabled={isResending}
                                className="
                                    rounded-lg
                                    border
                                    border-gray-600
                                    px-4
                                    py-2
                                    text-sm
                                    text-gray-200
                                    transition-colors
                                    hover:bg-gray-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {isResending ? "Sending..." : "Resend verification email"}
                            </button>
                        )}
                    </div>
                )}

                <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] mt-8"
                    isLoading={isSubmitting}
                >
                    Log In
                </Button>
            </form>

            <div className="text-center text-sm text-white/40 mt-4">
                Need an account?{" "}
                <Link
                    to="/signup"
                    className="text-[#3B82F6] hover:text-[#2563EB] hover:underline"
                >
                    Register
                </Link>
            </div>
        </Card>
    );
}