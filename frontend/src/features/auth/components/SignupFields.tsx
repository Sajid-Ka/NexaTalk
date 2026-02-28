import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { SignupFormData } from "../validators/signupSchema";
import Input from "../../../shared/ui/Input";

interface SignupFieldsProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
}

export default function SignupFields({ register, errors }: SignupFieldsProps) {
    return (
        <div className="space-y-4">
            <Input
                label="Username"
                placeholder="What should we call you?"
                {...register("username")}
                error={errors.username?.message}
            />

            <Input
                label="Email"
                placeholder="name@example.com"
                type="email"
                {...register("email")}
                error={errors.email?.message}
            />

            <Input
                label="Password"
                placeholder="Create a strong password"
                type="password"
                {...register("password")}
                error={errors.password?.message}
            />

            <Input
                label="Confirm password"
                placeholder="Repeat password"
                type="password"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
            />
        </div>
    );
}
