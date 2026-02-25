import { api } from "../../../shared/lib/axios";

export const loginApi = (data : {email : string; password : string}) =>
    api.post("/auth/login",data);

export const signupApi = (data : {username : string; email : string; password : string}) => 
    api.post("/auth/signup",data);

export const refreshApi = (refreshToken : string) => 
    api.post("/auth/refresh",{refreshToken});

export const logoutApi = (refreshToken: string) =>
  api.post("/auth/logout", { refreshToken });

export const sessionsApi = () =>
  api.get("/auth/sessions");