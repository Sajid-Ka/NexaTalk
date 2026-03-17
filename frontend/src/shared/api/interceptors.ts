import { api } from "./axios";

let accessToken : string | null = null;
let refreshHandler : (() => Promise<string | null>) | null = null;
let isRefreshing = false;
let pendingRequests : ((token : string | null) => void) [] = [];

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
        const originalRequest = error.config;

        const errorMsg = error.response?.data?.error?.message?.toLowerCase() || "";
        const isBlockedOrDeleted = (error.response?.status === 401 || error.response?.status === 403) &&
            (errorMsg.includes("blocked") || errorMsg.includes("deleted") || errorMsg.includes("revoked"));

        if(isBlockedOrDeleted) {
            setAccessToken(null);
            if (window.location.pathname !== "/login") {
                window.dispatchEvent(new Event("force-logout"));
                window.location.href = "/login?blocked=true";
            }
            return Promise.reject(error);
        }

        if(
            error.response?.status === 401 &&
            refreshHandler &&
            !originalRequest._retry &&
            !originalRequest.url?.includes("/auth/login") &&
            !originalRequest.url?.includes("/auth/signup") &&
            !originalRequest.url?.includes("/auth/refresh")
        ) {
            originalRequest._retry = true;

            if(!isRefreshing) {
                isRefreshing = true;
        
                try {
                    const newToken = await refreshHandler();
                    
                    pendingRequests.forEach((cb) => cb(newToken));
                    pendingRequests = [];

                    isRefreshing = false;

                    if(newToken) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    pendingRequests.forEach((cb) => cb(null));
                    pendingRequests = [];
                    isRefreshing = false;
                    
                    // If refresh itself fails with 401/403, and we aren't already on login, redirect
                    if (window.location.pathname !== "/login") {
                        setAccessToken(null);
                        window.location.href = "/login?session=expired";
                    }
                    return Promise.reject(refreshError);
                }
            }

            return new Promise((resolve, reject) => {
                pendingRequests.push((token) => {
                    if(!token) {
                        reject(error);
                        return;
                    }

                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    resolve(api(originalRequest));
                })
            })
        }

        return Promise.reject(error);
    }
)