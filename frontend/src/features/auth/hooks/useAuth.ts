import { useState } from "react";
import { signupApi } from "../api/authApi";
import type { SignupFormData } from "../validators/signupSchema";

export const useSignup = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const signup = async (data: SignupFormData) => {
        try {
            setLoading(true);
            setError(null);

            const res = await signupApi(data);
            return res.data;
        } catch (err: any) {
            setError(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false)
        }
    }
    return { signup, loading, error };
}