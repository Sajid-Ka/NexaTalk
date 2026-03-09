import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../validators/loginSchema";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import LoginFields from "./LoginFields";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        try {
            setServerError(null);

            const user = await login(data);

            console.log("Logged in user", user);

            if(user?.globalRole === "admin") navigate("/admin", {replace : true})
            else navigate("/home", {replace : true})

        } catch (error: any) {
            const message = error?.response?.data?.message;
            if (message === "Email not verified") {
                setServerError("Please verify your email before logging in.");
            } else {
                setServerError(message || "Invalid email or password");
            }
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
                            <Link
                                to="/check-email"
                                className="inline-block text-[#3B82F6] text-sm hover:underline"
                            >
                                Resend verification email
                            </Link>
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

            <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase px-2 text-white/40 bg-[#0F121D]">
                    Or continue with
                </div>
            </div>

            <Button
                type="button"
                variant="secondary"
                className="w-full bg-[#1A1D2D] hover:bg-white/5 border border-white/10 mb-6 flex items-center gap-2"
            >
                Google
            </Button>

            <div className="text-center text-sm text-white/40">
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