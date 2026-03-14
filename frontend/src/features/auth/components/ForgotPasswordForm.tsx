import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "../validators/forgotPasswordSchema";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Input from "../../../shared/ui/Input";
import { requestPasswordResetApi } from "../api/authApi";
import { useState } from "react";

export default function ForgotPasswordForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            setServerError(null);
            await requestPasswordResetApi(data.email);
            setIsSuccess(true);
        } catch (error: unknown) {
            const err = error as {response?:{data?:{message?: string}}}
            setServerError(err?.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    if (isSuccess) {
        return (
            <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm text-center">
                <div className="space-y-4">
                    <p className="text-white/80">
                        If an account exists for that email, we've sent a password reset link.
                    </p>
                    <Link to="/login">
                        <Button className="w-full bg-[#3B82F6] hover:bg-[#2563EB] mt-4">
                            Back to Login
                        </Button>
                    </Link>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="Email Address"
                    placeholder="Enter your email"
                    {...register("email")}
                    error={errors.email?.message}
                />

                {serverError && (
                    <p className="text-red-500 text-sm">
                        {serverError}
                    </p>
                )}

                <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                    isLoading={isSubmitting}
                >
                    Send Reset Link
                </Button>

                <div className="text-center text-sm text-white/40">
                    Remember your password?{" "}
                    <Link
                        to="/login"
                        className="text-[#3B82F6] hover:text-[#2563EB] hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </form>
        </Card>
    );
}
