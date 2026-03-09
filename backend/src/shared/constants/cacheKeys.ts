export const CACHE_KEYS = {
    refresh: (hash: string) => `refresh:${hash}`,
    resetPassword: (hash: string) => `reset_password:${hash}`,
    verifyEmail: (hash: string) => `verify_email:${hash}`,
    refreshResult: (hash: string) => `refresh_result:${hash}`,
};