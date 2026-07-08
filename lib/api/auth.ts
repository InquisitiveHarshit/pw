import request from "./client";

export type AuthUser = {
  _id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
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

/** Register a new user (email/password) */
export const register = (data: RegisterData) =>
  request<{ success: boolean; data: AuthUser }>("/auth/register", {
    method: "POST",
    body: data,
  });

/** Login — returns user + JWT token (email/password) */
export const login = (data: LoginData) =>
  request<{ success: boolean; data: AuthUser }>("/auth/login", {
    method: "POST",
    body: data,
  });

/** Check if a phone number already has an account */
export const phoneCheck = (phone: string) =>
  request<{ success: boolean; exists: boolean }>("/auth/phone-check", {
    method: "POST",
    body: { phone },
  });

/** Login by phone after OTP verified */
export const phoneLogin = (phone: string) =>
  request<{ success: boolean; data: AuthUser }>("/auth/phone-login", {
    method: "POST",
    body: { phone },
  });

/** Register new user by phone after OTP */
export const phoneRegister = (data: { phone: string; firstName: string; lastName?: string }) =>
  request<{ success: boolean; data: AuthUser }>("/auth/phone-register", {
    method: "POST",
    body: data,
  });

/** Get current logged-in user */
export const getMe = () =>
  request<{ success: boolean; data: AuthUser }>("/auth/me", { auth: true });
