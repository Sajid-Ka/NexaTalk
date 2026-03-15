import { api } from "../../../shared/api/axios";

export const loginApi = (data: { email: string; password: string }) =>
    api.post("/auth/login", data);

export const signupApi = (data: { username: string; email: string; password: string }) =>
    api.post("/auth/signup", data);

export const refreshApi = () =>
    api.post("/auth/refresh");

export const logoutApi = () =>
    api.post("/auth/logout");

export const sessionsApi = () =>
    api.get("/auth/sessions");

export const verifyEmailApi = (token: string) =>
    api.post("/auth/verify-email", { token });

export const requestPasswordResetApi = (email: string) =>
    api.post("/auth/request-password-reset", { email });

export const resetPasswordApi = (data: { token: string; newPassword: string }) =>
    api.post("/auth/reset-password", data);

export const checkStatusApi = () =>
    api.get("/auth/check-status");
