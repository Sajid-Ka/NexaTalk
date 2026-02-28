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