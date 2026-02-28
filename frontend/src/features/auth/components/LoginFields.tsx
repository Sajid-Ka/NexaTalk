import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { LoginFormData } from "../validators/loginSchema";
import Input from "../../../shared/ui/Input";
import { Link } from "react-router-dom";

interface LoginFieldsProps {
    register: UseFormRegister<LoginFormData>;
    errors: FieldErrors<LoginFormData>;
}

export default function LoginFields({ register, errors }: LoginFieldsProps) {
    return (
        <div className="space-y-4">
            <Input
                label="Email or Username"
                placeholder="Enter your email"
                {...register("email")}
                error={errors.email?.message}
            />

            <div className="space-y-1">
                <Input
                    label="Password"
                    placeholder="Enter your password"
                    type="password"
                    {...register("password")}
                    error={errors.password?.message}
                />
                <div className="flex justify-end">
                    <Link
                        to="/forgot-password"
                        className="text-[10px] text-[#3B82F6] hover:text-[#2563EB] hover:underline"
                    >
                        Forgot your password?
                    </Link>
                </div>
            </div>
        </div>
    );
}
