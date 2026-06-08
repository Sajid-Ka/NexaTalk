import { useForm } from "react-hook-form";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { signupSchema, type SignupFormData } from "../validators/signupSchema";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
import SignupFields from "./SignupFields";
import { signupApi } from "../api/authApi";
import toast from "react-hot-toast";

export default function SignupForm() {
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data: SignupFormData) => {
        try {
            const res = await signupApi(data);
            console.log("signup success",res)
            toast.success("Account created Successfully");

            navigate("/check-email");
        } catch (error: unknown) {
            if (axios.isAxiosError(error)) {
                const code = error.response?.data?.error?.code;
                const message =
                    error.response?.data?.error?.message ||
                    error.response?.data?.message ||
                    "Failed to create account";

                if (code === "USERNAME_ALREADY_TAKEN") {
                    setError("username", { message: "This username is already taken." });
                    toast.error("This username is already taken. Please choose another one.");
                    return;
                }

                if (code === "USERNAME_DELETED") {
                    setError("username", { message });
                    toast.error(message);
                    return;
                }

                if (code === "EMAIL_DELETED") {
                    setError("email", { message });
                    toast.error(message);
                    return;
                }

                if (code === "EMAIL_ALREADY_REGISTERED") {
                    setError("email", { message: "This email is already registered." });
                    toast.error("This email is already registered. Please log in instead.");
                    return;
                }

                toast.error(message);
                return;
            }

            toast.error("Failed to create account");
        }
    };

    return (
        <Card className="p-8 bg-[#0F121D] border border-white/5 shadow-2xl backdrop-blur-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
                <SignupFields register={register} errors={errors} />

                <Button
                    type="submit"
                    className="w-full bg-[#3B82F6] hover:bg-[#2563EB] mt-8"
                    isLoading={isSubmitting}
                >
                    Create Account
                </Button>
            </form>

            <div className="text-center text-sm text-white/40 mt-4">
                Already have an account?{" "}
                <Link to="/login" className="text-[#3B82F6] hover:text-[#2563EB] hover:underline">
                    Log In
                </Link>
            </div>
        </Card>
    );
}
