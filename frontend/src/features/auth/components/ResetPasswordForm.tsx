import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPasswordSchema, type ResetPasswordFormData } from "../validators/resetPasswordSchema";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import Input from "../../../shared/ui/Input";
import { resetPasswordApi } from "../api/authApi";
import { useState } from "react";

export default function ResetPasswordForm() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [serverError, setServerError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setServerError("Reset token is missing. Please request a new reset link.");
            return;
        }

        try {
            setServerError(null);
            await resetPasswordApi({
                token,
                newPassword: data.newPassword,
            });
            setIsSuccess(true);
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            setServerError(err?.response?.data?.message || "Failed to reset password. The link may be expired.");
        }
    };

    if (isSuccess) {
        return (
            <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm text-center">
                <div className="space-y-4">
                    <p className="text-green-500 font-medium">
                        Password reset successfully!
                    </p>
                    <p className="text-white/60 text-sm">
                        Redirecting you to login page...
                    </p>
                </div>
            </Card>
        );
    }

    if (!token) {
        return (
            <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm text-center">
                <div className="space-y-4">
                    <p className="text-red-500">
                        Invalid or missing reset token.
                    </p>
                    <Button
                        onClick={() => navigate("/forgot-password")}
                        className="w-full bg-[#3B82F6] hover:bg-[#2563EB]"
                    >
                        Request New Link
                    </Button>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <Input
                    label="New Password"
                    placeholder="Enter your new password"
                    type="password"
                    {...register("newPassword")}
                    error={errors.newPassword?.message}
                />

                <Input
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    type="password"
                    {...register("confirmPassword")}
                    error={errors.confirmPassword?.message}
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
                    Reset Password
                </Button>
            </form>
        </Card>
    );
}
