import { api } from "../../../shared/lib/axios";
import type { SignupFormData } from "../validators/signupSchema";

export const signupRequest = async (data: SignupFormData) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
}