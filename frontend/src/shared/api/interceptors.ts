import { api } from "./axios";

let accessToken : string | null = null;
let refreshHandler : (() => Promise<string | null>) | null = null;

export const setAccessToken = (token : string | null) => {
    accessToken = token;
}

export const setRefreshHandler = (
    handler : () => Promise<string | null>
) => {
    refreshHandler = handler;
}

api.interceptors.request.use((config) => {
    if(accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as any;

        if(
            error.response?.status === 401 &&
            !originalRequest._retry &&
            refreshHandler &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/signup") &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshHandler();

                if(newToken) {
                    originalRequest.headers = {
                        ...originalRequest.handler,
                        Authorization : `Bearer ${newToken}`,
                    };
                    return api(originalRequest);
                }
            } catch (refreshError) {
                console.error("Refresh failed:", refreshError);
            }
        }

        return Promise.reject(error);
    }
)