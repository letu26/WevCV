export const getAccessToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token || token === "null" || token === "undefined") return null;
  return token;
};

export const getRoles = (): string[] => {
  const roles = localStorage.getItem("roles");
  return roles ? JSON.parse(roles) : [];
};

export const hasRole = (requiredRoles: string[]) => {
  const roles = getRoles();
  return requiredRoles.some((r) => roles.includes(r));
};

export const clearAuth = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("roles");
};

export const getLoginRedirectPath = () => {
  const path = window.location.pathname;

  if (path.startsWith("/admin")) {
    return "/admin/login";
  }

  return "/signin";
};