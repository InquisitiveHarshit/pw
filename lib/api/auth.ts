import request from "./client";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  token: string;
};

export type RegisterData = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export type LoginData = {
  email: string;
  password: string;
};

/** Register a new user */
export const register = (data: RegisterData) =>
  request<{ success: boolean; data: AuthUser }>("/auth/register", {
    method: "POST",
    body: data,
  });

/** Login — returns user + JWT token */
export const login = (data: LoginData) =>
  request<{ success: boolean; data: AuthUser }>("/auth/login", {
    method: "POST",
    body: data,
  });

/** Get current logged-in user */
export const getMe = () =>
  request<{ success: boolean; data: AuthUser }>("/auth/me", { auth: true });
