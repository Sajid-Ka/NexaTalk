export const forceLogout = (reason: "blocked" | "deleted" = "blocked") => {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = `/login?${reason}=true`;
}