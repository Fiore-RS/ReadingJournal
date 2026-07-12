import { apiFetch } from "./api.js";

export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  isDemo: boolean;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authService = {
  login: (username: string, password: string) =>
    apiFetch<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  me: () => apiFetch<AuthUser>("/auth/me"),
};
